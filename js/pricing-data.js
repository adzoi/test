/**
 * Leaf 2 Leaf — Pricing calculator data for all 16 services.
 * Each service: id (matches page filename), displayName, basePrice (€), rangePercent (e.g. 0.15 = ±15%),
 * inputs[] with type "select" only. Options use multiplier (applied to running total) or add (fixed €).
 */
(function (global) {
  'use strict';

  global.PRICING_SERVICES = {
    /* ---------- Paving & Driveways ---------- */
    "driveways": {
      displayName: "Driveways",
      basePrice: 3500,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Driveway size",
          type: "select",
          options: {
            small: { label: "Small (up to 40 m²)", multiplier: 1 },
            medium: { label: "Medium (40–80 m²)", multiplier: 1.5 },
            large: { label: "Large (80+ m²)", multiplier: 2.2 }
          }
        },
        {
          id: "prep",
          label: "Ground preparation",
          type: "select",
          options: {
            none: { label: "Minimal (existing base good)", add: 0 },
            standard: { label: "Standard (some levelling)", add: 400 },
            full: { label: "Full (excavation / new base)", add: 900 }
          }
        }
      ]
    },
    "resin-bound": {
      displayName: "Resin-Bound Driveway",
      basePrice: 2800,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Driveway size",
          type: "select",
          options: {
            small: { label: "Small (up to 30 m²)", multiplier: 1 },
            medium: { label: "Medium (30–60 m²)", multiplier: 1.4 },
            large: { label: "Large (60+ m²)", multiplier: 1.9 }
          }
        },
        {
          id: "ground",
          label: "Ground preparation required?",
          type: "select",
          options: {
            no: { label: "No (sound existing base)", add: 0 },
            yes: { label: "Yes", add: 600 }
          }
        }
      ]
    },
    "block-paving": {
      displayName: "Block Paving",
      basePrice: 3200,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Area size",
          type: "select",
          options: {
            small: { label: "Small (up to 25 m²)", multiplier: 1 },
            medium: { label: "Medium (25–50 m²)", multiplier: 1.45 },
            large: { label: "Large (50+ m²)", multiplier: 1.95 }
          }
        },
        {
          id: "pattern",
          label: "Pattern complexity",
          type: "select",
          options: {
            simple: { label: "Simple (e.g. herringbone)", multiplier: 1 },
            detailed: { label: "Detailed / border", multiplier: 1.2 }
          }
        }
      ]
    },
    "flagging": {
      displayName: "Flagging",
      basePrice: 2200,
      rangePercent: 0.18,
      inputs: [
        {
          id: "area",
          label: "Area size",
          type: "select",
          options: {
            small: { label: "Small (up to 20 m²)", multiplier: 1 },
            medium: { label: "Medium (20–40 m²)", multiplier: 1.5 },
            large: { label: "Large (40+ m²)", multiplier: 2 }
          }
        },
        {
          id: "stone",
          label: "Stone type",
          type: "select",
          options: {
            standard: { label: "Standard flagstone", multiplier: 1 },
            premium: { label: "Premium / natural stone", multiplier: 1.35 }
          }
        }
      ]
    },
    "patios": {
      displayName: "Patios",
      basePrice: 2600,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Patio size",
          type: "select",
          options: {
            small: { label: "Small (up to 25 m²)", multiplier: 1 },
            medium: { label: "Medium (25–50 m²)", multiplier: 1.5 },
            large: { label: "Large (50+ m²)", multiplier: 2 }
          }
        },
        {
          id: "material",
          label: "Material",
          type: "select",
          options: {
            block: { label: "Block paving", multiplier: 1 },
            stone: { label: "Natural stone", multiplier: 1.3 },
            porcelain: { label: "Porcelain", multiplier: 1.4 }
          }
        }
      ]
    },
    "kerbs-walling": {
      displayName: "Kerbs & Walling",
      basePrice: 800,
      rangePercent: 0.2,
      inputs: [
        {
          id: "kerb",
          label: "Kerb length / type",
          type: "select",
          options: {
            short: { label: "Short run (up to 10 m)", multiplier: 1 },
            medium: { label: "Medium (10–25 m)", multiplier: 1.6 },
            long: { label: "Long (25+ m)", multiplier: 2.5 }
          }
        },
        {
          id: "walling",
          label: "Walling included?",
          type: "select",
          options: {
            no: { label: "No", add: 0 },
            yes: { label: "Yes (retaining / feature wall)", add: 1200 }
          }
        }
      ]
    },
    "gravel-driveways": {
      displayName: "Gravel Driveways",
      basePrice: 1400,
      rangePercent: 0.18,
      inputs: [
        {
          id: "area",
          label: "Driveway size",
          type: "select",
          options: {
            small: { label: "Small (up to 35 m²)", multiplier: 1 },
            medium: { label: "Medium (35–70 m²)", multiplier: 1.5 },
            large: { label: "Large (70+ m²)", multiplier: 2 }
          }
        },
        {
          id: "gravel",
          label: "Gravel type",
          type: "select",
          options: {
            standard: { label: "Standard gravel", multiplier: 1 },
            premium: { label: "Premium (e.g. golden gravel)", multiplier: 1.25 }
          }
        }
      ]
    },

    /* ---------- Garden Design & Planting ---------- */
    "landscaping-design": {
      displayName: "Full Garden Landscaping & Design",
      basePrice: 5500,
      rangePercent: 0.2,
      inputs: [
        {
          id: "scope",
          label: "Project scope",
          type: "select",
          options: {
            small: { label: "Small (front garden / courtyard)", multiplier: 1 },
            medium: { label: "Medium (back garden, one zone)", multiplier: 1.6 },
            full: { label: "Full (design + hard + soft)", multiplier: 2.5 }
          }
        },
        {
          id: "design",
          label: "Design complexity",
          type: "select",
          options: {
            simple: { label: "Simple layout", multiplier: 1 },
            detailed: { label: "Detailed design & plans", multiplier: 1.3 }
          }
        }
      ]
    },
    "flower-bed-design": {
      displayName: "Flower Bed Design",
      basePrice: 650,
      rangePercent: 0.18,
      inputs: [
        {
          id: "area",
          label: "Bed size",
          type: "select",
          options: {
            small: { label: "Small (up to 10 m²)", multiplier: 1 },
            medium: { label: "Medium (10–25 m²)", multiplier: 1.5 },
            large: { label: "Large (25+ m²)", multiplier: 2 }
          }
        },
        {
          id: "style",
          label: "Style",
          type: "select",
          options: {
            low: { label: "Low-maintenance", multiplier: 1 },
            cottage: { label: "Cottage / mixed", multiplier: 1.2 },
            tropical: { label: "Tropical / exotic", multiplier: 1.35 }
          }
        }
      ]
    },
    "natural-stone": {
      displayName: "Natural Stone",
      basePrice: 3200,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Area size",
          type: "select",
          options: {
            small: { label: "Small (up to 20 m²)", multiplier: 1 },
            medium: { label: "Medium (20–45 m²)", multiplier: 1.55 },
            large: { label: "Large (45+ m²)", multiplier: 2.1 }
          }
        },
        {
          id: "stone",
          label: "Stone type",
          type: "select",
          options: {
            sandstone: { label: "Indian sandstone", multiplier: 1 },
            limestone: { label: "Limestone", multiplier: 1.2 },
            granite: { label: "Granite / slate", multiplier: 1.4 }
          }
        }
      ]
    },
    "planting-services": {
      displayName: "Planting Services",
      basePrice: 550,
      rangePercent: 0.18,
      inputs: [
        {
          id: "area",
          label: "Planting area",
          type: "select",
          options: {
            small: { label: "Small (borders / pots)", multiplier: 1 },
            medium: { label: "Medium (several beds)", multiplier: 1.6 },
            large: { label: "Large (full scheme)", multiplier: 2.2 }
          }
        },
        {
          id: "density",
          label: "Plant density",
          type: "select",
          options: {
            light: { label: "Light (shrubs + few perennials)", multiplier: 1 },
            medium: { label: "Medium (mixed planting)", multiplier: 1.25 },
            full: { label: "Full (dense perennial beds)", multiplier: 1.5 }
          }
        }
      ]
    },
    "garden-features": {
      displayName: "Garden Features",
      basePrice: 1800,
      rangePercent: 0.25,
      inputs: [
        {
          id: "feature",
          label: "Feature type",
          type: "select",
          options: {
            planter: { label: "Planters / seating", multiplier: 1 },
            water: { label: "Water feature", multiplier: 1.8 },
            pergola: { label: "Pergola / structure", multiplier: 2 },
            fire: { label: "Fire pit area", multiplier: 1.5 }
          }
        },
        {
          id: "complexity",
          label: "Complexity",
          type: "select",
          options: {
            simple: { label: "Simple", multiplier: 1 },
            bespoke: { label: "Bespoke / integrated", multiplier: 1.4 }
          }
        }
      ]
    },
    "porcelain-paving": {
      displayName: "Porcelain Paving",
      basePrice: 3000,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Area size",
          type: "select",
          options: {
            small: { label: "Small (up to 25 m²)", multiplier: 1 },
            medium: { label: "Medium (25–50 m²)", multiplier: 1.5 },
            large: { label: "Large (50+ m²)", multiplier: 2 }
          }
        },
        {
          id: "finish",
          label: "Finish / grade",
          type: "select",
          options: {
            standard: { label: "Standard outdoor porcelain", multiplier: 1 },
            premium: { label: "Premium / large format", multiplier: 1.25 }
          }
        }
      ]
    },

    /* ---------- Lawn & Fencing ---------- */
    "new-lawn-turf": {
      displayName: "New Lawn & Turf",
      basePrice: 950,
      rangePercent: 0.18,
      inputs: [
        {
          id: "area",
          label: "Lawn area",
          type: "select",
          options: {
            small: { label: "Small (up to 50 m²)", multiplier: 1 },
            medium: { label: "Medium (50–120 m²)", multiplier: 1.55 },
            large: { label: "Large (120+ m²)", multiplier: 2.1 }
          }
        },
        {
          id: "prep",
          label: "Preparation needed",
          type: "select",
          options: {
            minimal: { label: "Minimal (level only)", add: 0 },
            topsoil: { label: "Topsoil + levelling", add: 350 },
            full: { label: "Full (strip / rotavate / topsoil)", add: 600 }
          }
        }
      ]
    },
    "artificial-grass": {
      displayName: "Artificial Grass",
      basePrice: 2200,
      rangePercent: 0.15,
      inputs: [
        {
          id: "area",
          label: "Area size",
          type: "select",
          options: {
            small: { label: "Small (up to 25 m²)", multiplier: 1 },
            medium: { label: "Medium (25–50 m²)", multiplier: 1.5 },
            large: { label: "Large (50+ m²)", multiplier: 2 }
          }
        },
        {
          id: "base",
          label: "Base condition",
          type: "select",
          options: {
            good: { label: "Good (existing hard surface)", add: 0 },
            new: { label: "New sub-base required", add: 500 }
          }
        }
      ]
    },
    "garden-fencing": {
      displayName: "Garden Fencing",
      basePrice: 1100,
      rangePercent: 0.18,
      inputs: [
        {
          id: "length",
          label: "Fence length",
          type: "select",
          options: {
            short: { label: "Short (up to 15 m)", multiplier: 1 },
            medium: { label: "Medium (15–30 m)", multiplier: 1.6 },
            long: { label: "Long (30+ m)", multiplier: 2.2 }
          }
        },
        {
          id: "style",
          label: "Style",
          type: "select",
          options: {
            panel: { label: "Panel fencing", multiplier: 1 },
            slatted: { label: "Slatted / horizontal", multiplier: 1.25 },
            composite: { label: "Composite", multiplier: 1.5 }
          }
        }
      ]
    }
  };
})(typeof window !== 'undefined' ? window : this);
