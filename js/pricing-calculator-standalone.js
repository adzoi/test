/**
 * Leaf 2 Leaf — Standalone pricing calculator (client-side only).
 * Estimates cost for any of 16 services in any Dublin location.
 * Calculation: base cost from area/measurement or size tier, then optional
 * extras (ground prep ×1.2, premium materials ×1.5), then range 90%–110%.
 */

(function () {
  'use strict';

  // ——— Service configuration ———
  // type: 'area_m2' = numeric m², 'linear_m' = linear meters, 'size' = Small/Medium/Large dropdown
  // rate: for area_m2/linear_m = price per unit; for size = { small, medium, large } in euros
  var SERVICES = [
    { id: 'driveway', name: 'Driveway Services', type: 'area_m2', rate: 50 },
    { id: 'lawn-turf', name: 'New Lawn Turf Services', type: 'area_m2', rate: 20 },
    { id: 'garden-features', name: 'Garden Features Services', type: 'size', rate: { small: 200, medium: 400, large: 600 } },
    { id: 'landscaping', name: 'Landscaping & Garden Design', type: 'size', rate: { small: 300, medium: 600, large: 900 } },
    { id: 'natural-stone', name: 'Natural Stone Services', type: 'area_m2', rate: 60 },
    { id: 'gravel', name: 'Gravel Driveways Services', type: 'area_m2', rate: 35 },
    { id: 'paving', name: 'Paving Services', type: 'area_m2', rate: 45 },
    { id: 'kerbs', name: 'Kerbs & Walling Services', type: 'area_m2', rate: 40 },
    { id: 'patios', name: 'Patios (including Patio Paving Contractors)', type: 'area_m2', rate: 50 },
    { id: 'fence', name: 'Garden Fence Services', type: 'linear_m', rate: 35 },
    { id: 'planting', name: 'Planting Services', type: 'size', rate: { small: 100, medium: 200, large: 300 } },
    { id: 'flower-bed', name: 'Flower Bed Design Services', type: 'size', rate: { small: 80, medium: 160, large: 240 } },
    { id: 'flagging', name: 'Flagging Services', type: 'area_m2', rate: 40 },
    { id: 'artificial-grass', name: 'Artificial Grass Services', type: 'area_m2', rate: 25 },
    { id: 'resin-bound', name: 'Resin-Bound Surface Services', type: 'area_m2', rate: 55 },
    { id: 'porcelain', name: 'Porcelain Paving Services', type: 'area_m2', rate: 60 }
  ];

  // ——— Dublin locations (County Dublin) ———
  var LOCATIONS = [
    'Arbour Hill', 'Artane', 'Ashtown', 'Ayrfield', 'Balbutcher', 'Balcurris', 'Baldoyle', 'Balgriffin',
    'Ballinteer', 'Ballsbridge', 'Ballyboden', 'Ballybough', 'Ballyedmonduff', 'Ballyfermot', 'Ballygall',
    'Ballymount', 'Ballymun', 'Bayside', 'Beaumont', 'Belcamp', 'Belfield', 'Blackrock', 'Blanchardstown',
    'Bluebell', 'Bray', 'Broadstone', 'Cabinteely', 'Cabra', 'Cappagh', 'Carrickmines', 'Castleknock',
    'Chapelizod', 'Cherry Orchard', 'Churchtown', 'Clondalkin', 'Clongriffin', 'Clonliffe', 'Clonsilla',
    'Clonskeagh', 'Clontarf', 'Coolmine', 'Coolock', 'Coolquay', 'Corduff', 'Crumlin', 'Darndale', 'Dartry',
    'Dollymount', "Dolphin's Barn", 'Donaghmede', 'Donnybrook', 'Donnycarney', 'Drimnagh', 'Drumcondra',
    'Dubber Cross', 'Dublin', 'Dublin Docklands', 'Dun Laoghaire', 'Dundrum', 'East Wall', 'Elm Mount',
    'Fairview', 'Finglas', 'Firhouse', 'Foxrock', 'Glasnevin', 'Goatstown', 'Grangegorman', 'Greenhills',
    'Griffith Avenue', 'Harmonstown', "Harold's Cross", 'Howth', 'Inchicore', 'Irishtown', 'Islandbridge',
    'Jobstown', 'Kilbarrack', 'Killester', 'Kilmainham', 'Kilmashogue', 'Kilshane Cross', 'Kilternan',
    'Kimmage', 'Knocklyon', 'Leopardstown', 'Liffey Valley', 'Lucan', 'Malahide', 'Marino', 'Merchants Quay',
    'Merrion', 'Milltown', 'Mulhuddart', 'Neilstown', 'Newcastle', 'North City Centre', 'North Strand',
    'Old Bawn', 'Ongar', 'Oxmantown', 'Palmerstown', 'Pembroke', 'Perrystown', 'Phibsborough', 'Poppintree',
    'Portobello', 'Priorswood', 'Raheny', 'Ranelagh', 'Rathfarnham', 'Rathgar', 'Rathmines', 'Ringsend',
    'Rockbrook', 'Rush', 'Sandyford', 'Sandyhill', 'Sandymount', 'Santry', 'Sarsfield Road', 'Shankill',
    'Sillogue', 'Skerries', 'Smithfield', 'South Circular Road', 'South City Centre', 'Stepaside', 'Stoneybatter',
    'Sutton', 'Swords', 'Tallaght', 'Templeogue', 'Terenure', 'The Liberties', 'The Phoenix Park', 'The Ward',
    'Ticknock', 'Tyrrelstown', 'Wadelai', 'Walkinstown', 'Whitehall', 'Windy Arbour'
  ].map(function (name) { return name + ' County Dublin'; });

  // ——— Extra multipliers ———
  var EXTRA_GROUND_PREP = 1.2;
  var EXTRA_PREMIUM_MATERIALS = 1.5;
  var RANGE_MIN = 0.9;
  var RANGE_MAX = 1.1;

  /**
   * Get base cost for the selected service and area/measurement/size.
   * @param {Object} service - One of SERVICES
   * @param {number|null} areaNum - For area_m2 or linear_m
   * @param {string|null} sizeKey - 'small'|'medium'|'large' for type 'size'
   * @returns {number|null} Base cost in euros or null if invalid
   */
  function getBaseCost(service, areaNum, sizeKey) {
    if (!service) return null;
    if (service.type === 'area_m2' || service.type === 'linear_m') {
      if (typeof areaNum !== 'number' || areaNum <= 0) return null;
      return service.rate * areaNum;
    }
    if (service.type === 'size') {
      var rate = service.rate[sizeKey];
      return typeof rate === 'number' ? rate : null;
    }
    return null;
  }

  /**
   * Apply optional extras to a cost (multipliers are cumulative).
   * @param {number} cost - Base or intermediate cost
   * @param {boolean} groundPrep
   * @param {boolean} premiumMaterials
   * @returns {number}
   */
  function applyExtras(cost, groundPrep, premiumMaterials) {
    var total = cost;
    if (groundPrep) total = total * EXTRA_GROUND_PREP;
    if (premiumMaterials) total = total * EXTRA_PREMIUM_MATERIALS;
    return total;
  }

  /**
   * Compute min and max of the estimated range (90% and 110% of total).
   * @param {number} totalCost
   * @returns {{ min: number, max: number }}
   */
  function getRange(totalCost) {
    return {
      min: Math.round(totalCost * RANGE_MIN),
      max: Math.round(totalCost * RANGE_MAX)
    };
  }

  /**
   * Validate numeric input: positive number only.
   * @param {string} value
   * @returns {number|null}
   */
  function parsePositiveNumber(value) {
    if (value == null || value === '') return null;
    var num = Number(value);
    if (isNaN(num) || num <= 0) return null;
    return num;
  }

  /**
   * Format number as euros (e.g. 1,500).
   */
  function formatEuros(n) {
    return Number(n).toLocaleString('en-IE', { maximumFractionDigits: 0 });
  }

  /**
   * Build area/measurement label for output (e.g. "45 m²" or "12 linear meters").
   */
  function getAreaLabel(service, areaNum, sizeKey) {
    if (service.type === 'area_m2') return (areaNum != null ? formatEuros(areaNum) : '—') + ' m²';
    if (service.type === 'linear_m') return (areaNum != null ? formatEuros(areaNum) : '—') + ' linear meters';
    if (service.type === 'size') return (sizeKey || '—').charAt(0).toUpperCase() + (sizeKey ? sizeKey.slice(1) : '');
    return '—';
  }

  /**
   * Run calculation and return result object or null if invalid.
   */
  function calculate(service, areaNum, sizeKey, location, groundPrep, premiumMaterials) {
    var base = getBaseCost(service, areaNum, sizeKey);
    if (base == null) return null;
    var total = applyExtras(base, groundPrep, premiumMaterials);
    var range = getRange(total);
    return {
      serviceName: service.name,
      location: location || 'Dublin',
      areaLabel: getAreaLabel(service, areaNum, sizeKey),
      min: range.min,
      max: range.max
    };
  }

  /**
   * DOM: get or create calculator container and wire inputs.
   */
  function init() {
    var container = document.getElementById('quote-calculator');
    if (!container) return;

    var serviceSelect = document.getElementById('quote-service');
    var areaWrap = document.getElementById('quote-area-wrap');
    var areaInput = document.getElementById('quote-area');
    var sizeWrap = document.getElementById('quote-size-wrap');
    var sizeSelect = document.getElementById('quote-size');
    var locationInput = document.getElementById('quote-location-input');
    var locationHidden = document.getElementById('quote-location');
    var locationListbox = document.getElementById('quote-location-listbox');
    var extraGround = document.getElementById('quote-extra-ground');
    var extraPremium = document.getElementById('quote-extra-premium');
    var resultEl = document.getElementById('quote-result');
    var resultText = document.getElementById('quote-result-text');

    if (!serviceSelect || !areaWrap || !locationHidden || !locationListbox || !resultEl) return;

    // Populate service dropdown
    SERVICES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      serviceSelect.appendChild(opt);
    });

    // ——— Location: searchable autocomplete ———
    // We use a combobox: a text input + a hidden input (stores selected value for calculation)
    // and a listbox that shows filtered locations. User types → we filter LOCATIONS by
    // substring (case-insensitive) and re-render the listbox. On option click we set
    // the hidden input and the visible input text, then hide the listbox.
    var locationBlurTimer = null;
    var locationHighlightIndex = -1;

    /**
     * Filter locations by query: case-insensitive substring match on the full string
     * (e.g. "Sandy" matches "Sandyford County Dublin").
     */
    function filterLocations(query) {
      var q = (query || '').trim().toLowerCase();
      if (q === '') return LOCATIONS.slice();
      return LOCATIONS.filter(function (loc) {
        return loc.toLowerCase().indexOf(q) !== -1;
      });
    }

    /**
     * Render the listbox with the given locations and show it.
     * Sets data-value on each item to the full location string for selection.
     */
    function renderLocationList(filtered) {
      locationListbox.innerHTML = '';
      locationHighlightIndex = -1;
      if (!filtered.length) {
        locationListbox.setAttribute('aria-hidden', 'true');
        if (locationInput) locationInput.setAttribute('aria-expanded', 'false');
        return;
      }
      filtered.forEach(function (loc, idx) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', loc);
        li.setAttribute('id', 'quote-location-opt-' + idx);
        li.className = 'quote-location-option';
        li.textContent = loc;
        locationListbox.appendChild(li);
      });
      locationListbox.setAttribute('aria-hidden', 'false');
      if (locationInput) locationInput.setAttribute('aria-expanded', 'true');
    }

    /**
     * Set the selected location (hidden + visible input) and hide listbox.
     */
    function setLocationValue(loc) {
      if (locationHidden) locationHidden.value = loc;
      if (locationInput) locationInput.value = loc;
      locationListbox.setAttribute('aria-hidden', 'true');
      if (locationInput) locationInput.setAttribute('aria-expanded', 'false');
      locationListbox.innerHTML = '';
      locationHighlightIndex = -1;
      runCalculation();
    }

    /**
     * Open listbox and show all or filtered options based on current input.
     */
    function openLocationList() {
      var q = locationInput ? locationInput.value : '';
      var filtered = filterLocations(q);
      renderLocationList(filtered);
    }

    /**
     * Hide listbox after a short delay (so click on option fires before blur).
     */
    function scheduleCloseList() {
      if (locationBlurTimer) clearTimeout(locationBlurTimer);
      locationBlurTimer = setTimeout(function () {
        locationListbox.setAttribute('aria-hidden', 'true');
        if (locationInput) locationInput.setAttribute('aria-expanded', 'false');
        locationListbox.innerHTML = '';
        locationHighlightIndex = -1;
        locationBlurTimer = null;
      }, 200);
    }

    if (locationInput) {
      locationInput.addEventListener('focus', openLocationList);
      locationInput.addEventListener('input', function () {
        openLocationList();
      });
      locationInput.addEventListener('blur', scheduleCloseList);
      locationInput.addEventListener('keydown', function (e) {
        var opts = locationListbox.querySelectorAll('[role="option"]');
        if (e.key === 'Escape') {
          locationListbox.setAttribute('aria-hidden', 'true');
          locationInput.setAttribute('aria-expanded', 'false');
          locationListbox.innerHTML = '';
          locationHighlightIndex = -1;
          e.preventDefault();
          return;
        }
        if (e.key === 'Enter' && opts.length) {
          e.preventDefault();
          var idx = locationHighlightIndex >= 0 ? locationHighlightIndex : 0;
          var opt = opts[idx];
          if (opt) setLocationValue(opt.getAttribute('data-value'));
          return;
        }
        if (e.key === 'ArrowDown' && opts.length) {
          e.preventDefault();
          locationHighlightIndex = locationHighlightIndex < opts.length - 1 ? locationHighlightIndex + 1 : 0;
          opts.forEach(function (o, i) {
            o.classList.toggle('highlight', i === locationHighlightIndex);
          });
          return;
        }
        if (e.key === 'ArrowUp' && opts.length) {
          e.preventDefault();
          locationHighlightIndex = locationHighlightIndex <= 0 ? opts.length - 1 : locationHighlightIndex - 1;
          opts.forEach(function (o, i) {
            o.classList.toggle('highlight', i === locationHighlightIndex);
          });
        }
      });
    }

    locationListbox.addEventListener('mousedown', function (e) {
      // Prevent blur so the option click is processed before the input blurs
      e.preventDefault();
    });
    locationListbox.addEventListener('click', function (e) {
      var opt = e.target.closest('[role="option"]');
      if (opt) setLocationValue(opt.getAttribute('data-value'));
    });

    function getCurrentService() {
      var id = serviceSelect.value;
      return SERVICES.filter(function (s) { return s.id === id; })[0] || null;
    }

    function updateAreaVisibility() {
      var service = getCurrentService();
      if (!service) return;
      if (service.type === 'size') {
        areaWrap.classList.add('hidden');
        if (sizeWrap) sizeWrap.classList.remove('hidden');
        if (sizeSelect) sizeSelect.removeAttribute('disabled');
      } else {
        areaWrap.classList.remove('hidden');
        if (sizeWrap) sizeWrap.classList.add('hidden');
        if (sizeSelect) sizeSelect.setAttribute('disabled', 'disabled');
        if (areaInput) {
          areaInput.placeholder = service.type === 'linear_m' ? 'Linear meters' : 'Area (m²)';
          areaInput.setAttribute('min', '0.1');
          areaInput.setAttribute('step', service.type === 'linear_m' ? '0.5' : '1');
        }
      }
    }

    function runCalculation() {
      var service = getCurrentService();
      // Location comes from the searchable combobox: hidden input holds selected value
      var location = locationHidden ? locationHidden.value.trim() : '';
      var groundPrep = extraGround && extraGround.checked;
      var premiumMaterials = extraPremium && extraPremium.checked;

      // Validate location: must be selected from the list (stored in hidden input)
      if (!location) {
        resultEl.classList.add('quote-result--error');
        resultText.textContent = 'Please select a location from the list.';
        return;
      }

      var areaNum = null;
      var sizeKey = null;

      if (service.type === 'size') {
        sizeKey = sizeSelect && sizeSelect.value ? sizeSelect.value : 'small';
      } else {
        areaNum = parsePositiveNumber(areaInput && areaInput.value);
        if (areaNum == null && service.type !== 'size') {
          resultEl.classList.add('quote-result--error');
          resultText.textContent = 'Please enter a valid area or length (positive number).';
          return;
        }
      }

      var result = calculate(service, areaNum, sizeKey, location, groundPrep, premiumMaterials);
      if (!result) {
        resultEl.classList.add('quote-result--error');
        resultText.textContent = 'Please select a service and enter a valid area or size.';
        return;
      }

      resultEl.classList.remove('quote-result--error');
      resultText.textContent = 'Estimated cost for ' + result.serviceName + ' in ' + result.location + ' (' + result.areaLabel + '): €' + formatEuros(result.min) + ' – €' + formatEuros(result.max);
    }

    serviceSelect.addEventListener('change', function () {
      updateAreaVisibility();
      runCalculation();
    });
    if (areaInput) {
      areaInput.addEventListener('input', runCalculation);
      areaInput.addEventListener('change', runCalculation);
    }
    if (sizeSelect) sizeSelect.addEventListener('change', runCalculation);
    if (extraGround) extraGround.addEventListener('change', runCalculation);
    if (extraPremium) extraPremium.addEventListener('change', runCalculation);

    updateAreaVisibility();
    runCalculation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
