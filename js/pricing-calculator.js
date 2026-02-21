/**
 * Leaf 2 Leaf — Smart Pricing Calculator (client-side only).
 * Detects service from page filename, renders service-specific inputs,
 * calculates min–max price range, and injects UI into .service-pricing.
 */
(function () {
  'use strict';

  var PRICING_SERVICES = typeof window.PRICING_SERVICES !== 'undefined' ? window.PRICING_SERVICES : {};
  var CONTACT_PATH = '../../contact.html';

  /**
   * Get current service id from page URL/path (e.g. resin-bound.html → "resin-bound").
   */
  function getServiceId() {
    var path = window.location.pathname || window.location.href || '';
    var filename = path.split('/').pop() || '';
    var match = filename.match(/^(.+)\.html$/);
    return match ? match[1] : null;
  }

  /**
   * Calculate estimated price from base + selected options.
   * Applies multipliers first (to running total), then adds fixed amounts.
   */
  function calculatePrice(serviceConfig, selectedValues) {
    if (!serviceConfig || !serviceConfig.inputs || !selectedValues) {
      return null;
    }
    var base = serviceConfig.basePrice;
    var price = base;
    var inputId, opt, mult, add;
    for (var i = 0; i < serviceConfig.inputs.length; i++) {
      inputId = serviceConfig.inputs[i].id;
      opt = serviceConfig.inputs[i].options[selectedValues[inputId]];
      if (!opt) continue;
      if (typeof opt.multiplier === 'number') {
        price = price * opt.multiplier;
      }
    }
    for (var j = 0; j < serviceConfig.inputs.length; j++) {
      inputId = serviceConfig.inputs[j].id;
      opt = serviceConfig.inputs[j].options[selectedValues[inputId]];
      if (!opt) continue;
      if (typeof opt.add === 'number') {
        price = price + opt.add;
      }
    }
    return Math.round(price);
  }

  /**
   * Compute min and max range from point estimate and rangePercent.
   */
  function getPriceRange(pointEstimate, rangePercent) {
    if (typeof pointEstimate !== 'number' || pointEstimate <= 0) return { min: 0, max: 0 };
    var pct = typeof rangePercent === 'number' ? rangePercent : 0.15;
    var min = Math.round(pointEstimate * (1 - pct));
    var max = Math.round(pointEstimate * (1 + pct));
    return { min: min, max: max };
  }

  /**
   * Build and inject calculator DOM into .service-pricing (below pricing grid).
   */
  function injectCalculator(serviceId, serviceConfig) {
    var section = document.querySelector('.service-pricing');
    if (!section) return null;

    var grid = section.querySelector('.service-pricing__grid');
    var refNode = grid ? grid.nextElementSibling : section.firstElementChild;
    var wrapper = document.createElement('div');
    wrapper.className = 'pricing-calculator';
    wrapper.setAttribute('data-service', serviceId);

    var title = document.createElement('h3');
    title.className = 'pricing-calculator__title';
    title.textContent = 'Get a rough estimate';

    var form = document.createElement('form');
    form.className = 'pricing-calculator__form';
    form.setAttribute('action', '#');
    form.setAttribute('method', 'get');

    serviceConfig.inputs.forEach(function (input) {
      if (input.type !== 'select' || !input.options) return;
      var fieldset = document.createElement('div');
      fieldset.className = 'pricing-calculator__field';
      var label = document.createElement('label');
      label.className = 'pricing-calculator__label';
      label.setAttribute('for', 'pricing-' + input.id);
      label.textContent = input.label;
      var select = document.createElement('select');
      select.id = 'pricing-' + input.id;
      select.name = input.id;
      select.className = 'pricing-calculator__select';
      select.setAttribute('data-input-id', input.id);
      var optKeys = Object.keys(input.options);
      optKeys.forEach(function (key, idx) {
        var opt = input.options[key];
        var option = document.createElement('option');
        option.value = key;
        option.textContent = opt.label;
        option.selected = idx === 0;
        select.appendChild(option);
      });
      fieldset.appendChild(label);
      fieldset.appendChild(select);
      form.appendChild(fieldset);
    });

    var btnWrap = document.createElement('div');
    btnWrap.className = 'pricing-calculator__actions';
    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--outline-dark pricing-calculator__btn';
    submitBtn.textContent = 'Calculate Estimate';
    btnWrap.appendChild(submitBtn);
    form.appendChild(btnWrap);

    var resultEl = document.createElement('div');
    resultEl.className = 'pricing-calculator__result';
    resultEl.setAttribute('aria-live', 'polite');
    resultEl.hidden = true;

    var disclaimer = document.createElement('p');
    disclaimer.className = 'pricing-calculator__disclaimer';
    disclaimer.textContent = 'This is a rough estimate. Final pricing is confirmed after a site visit.';

    wrapper.appendChild(title);
    wrapper.appendChild(form);
    wrapper.appendChild(resultEl);
    wrapper.appendChild(disclaimer);

    if (refNode) {
      section.insertBefore(wrapper, refNode);
    } else {
      section.appendChild(wrapper);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = {};
      serviceConfig.inputs.forEach(function (input) {
        var sel = form.querySelector('[name="' + input.id + '"]');
        if (sel) selected[input.id] = sel.value;
      });
      var point = calculatePrice(serviceConfig, selected);
      if (point == null) return;
      var range = getPriceRange(point, serviceConfig.rangePercent);
      showResult(wrapper, resultEl, serviceConfig, range, selected);
    });

    return wrapper;
  }

  /**
   * Show min–max range and action buttons (Book a Visit, Send Estimate).
   */
  function showResult(wrapper, resultEl, serviceConfig, range, selected) {
    resultEl.hidden = false;
    resultEl.innerHTML = '';
    var rangeText = document.createElement('p');
    rangeText.className = 'pricing-calculator__range';
    rangeText.textContent = 'Estimated range: €' + formatNum(range.min) + ' – €' + formatNum(range.max);
    resultEl.appendChild(rangeText);
    var actions = document.createElement('div');
    actions.className = 'pricing-calculator__result-actions';
    var bookLink = document.createElement('a');
    bookLink.href = CONTACT_PATH;
    bookLink.className = 'btn btn--cream pricing-calculator__result-btn';
    bookLink.textContent = 'Book a Visit';
    var sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'btn btn--outline-dark pricing-calculator__result-btn';
    sendBtn.textContent = 'Send Estimate';
    sendBtn.addEventListener('click', function () {
      try {
        var payload = {
          service: serviceConfig.displayName,
          serviceId: wrapper.getAttribute('data-service'),
          min: range.min,
          max: range.max,
          selected: selected,
          at: new Date().toISOString()
        };
        window.localStorage.setItem('leaf2leaf_pricing_estimate', JSON.stringify(payload));
        sendBtn.textContent = 'Saved — use contact form to send';
        sendBtn.disabled = true;
      } catch (err) {
        sendBtn.textContent = 'Could not save';
      }
    });
    actions.appendChild(bookLink);
    actions.appendChild(sendBtn);
    resultEl.appendChild(actions);
  }

  function formatNum(n) {
    return Number(n).toLocaleString('en-IE', { maximumFractionDigits: 0 });
  }

  function init() {
    var serviceId = getServiceId();
    if (!serviceId) return;
    var serviceConfig = PRICING_SERVICES[serviceId];
    if (!serviceConfig || !serviceConfig.inputs || serviceConfig.inputs.length === 0) return;
    injectCalculator(serviceId, serviceConfig);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
