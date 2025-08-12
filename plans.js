// api/plans.js
// API sencilla para devolver planes por ZIP (mock)
// Despliega esto en Vercel. Endpoint: /api/plans?zip=XXXXX

export default async function handler(req, res) {
  // CORS básico para que Framer pueda hacer fetch
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const zip = (req.query.zip || "").toString().trim().slice(0,5);
  if (!zip) return res.status(400).json({ error: "ZIP requerido (5 dígitos)" });

  // Catálogo de planes por proveedor (mock). Ajusta precios/nombres a tu gusto.
  const catalog = {
    "Frontier": {
      tech: "Fibra/DSL",
      plans: [
        { name: "Fiber 500",  down: 500,  up: 500,  price: 49.99, promo: true,  contract: "none", fees: { install: 0, equip: 10 } },
        { name: "Fiber 1 Gig", down: 1000, up: 1000, price: 69.99, promo: true,  contract: "none", fees: { install: 0, equip: 15 } }
      ]
    },
    "Xfinity": {
      tech: "Cable",
      plans: [
        { name: "Fast 400",   down: 400,  up: 10,   price: 45.00, promo: true,  contract: "12m", fees: { install: 0, equip: 14 } },
        { name: "Superfast 800", down: 800, up: 20, price: 60.00, promo: false, contract: "12m", fees: { install: 0, equip: 14 } }
      ]
    },
    "Spectrum": {
      tech: "Cable",
      plans: [
        { name: "Internet 300", down: 300, up: 10,  price: 49.99, promo: true,  contract: "none", fees: { install: 0, equip: 0 } },
        { name: "Internet 500", down: 500, up: 20,  price: 59.99, promo: false, contract: "none", fees: { install: 0, equip: 0 } }
      ]
    }
  };

  // Disponibilidad ficticia por ZIP (solo ejemplo). Cambia estos ZIPs a los tuyos.
  const availabilityByZip = {
    "93458": ["Frontier", "Spectrum"],
    "90001": ["Xfinity", "Spectrum"],
    "10001": ["Xfinity"],
    "default": ["Frontier", "Xfinity", "Spectrum"]
  };

  const list = availabilityByZip[zip] || availabilityByZip["default"];
  const providers = list.map(name => ({
    name,
    tech: catalog[name].tech,
    plans: catalog[name].plans
  }));

  // Orden simple: por mejor valor (precio por 100 Mbps, si empata deja como viene)
  const scored = providers.map(p => ({
    ...p,
    plans: [...p.plans].sort((a,b) => (a.price / (a.down || 1)) - (b.price / (b.down || 1)))
  }));

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.status(200).json({ zip, providers: scored, lastUpdated: new Date().toISOString() });
}
