# zip-plans-api (Vercel)

API súper simple que devuelve planes de internet por código postal (mock) para **Frontier**, **Xfinity** y **Spectrum**.

## Estructura
```
zip-plans-api/
└── api/
    └── plans.js   # Endpoint GET /api/plans?zip=XXXXX
```

## Cómo desplegar en Vercel
1. Crea un repositorio en GitHub llamado `zip-plans-api`.
2. Sube estos archivos (carpeta `api` con `plans.js` y este `README.md`).
3. Entra a https://vercel.com → **Add New → Project** → conecta tu repo y **Deploy**.
4. Prueba en el navegador:  
   `https://TU-PROYECTO.vercel.app/api/plans?zip=93458`

## Notas
- La disponibilidad por ZIP es **de ejemplo** (mock). Modifica `availabilityByZip` en `api/plans.js`.
- Los precios/planes son ficticios. Úsalos de prueba y luego conéctalos a datos reales.
- Incluye CORS abierto para poder usarlo desde Framer.

## Respuesta de ejemplo
```json
{
  "zip": "93458",
  "providers": [
    {
      "name": "Frontier",
      "tech": "Fibra/DSL",
      "plans": [
        {"name":"Fiber 500","down":500,"up":500,"price":49.99,"promo":true,"contract":"none","fees":{"install":0,"equip":10}},
        {"name":"Fiber 1 Gig","down":1000,"up":1000,"price":69.99,"promo":true,"contract":"none","fees":{"install":0,"equip":15}}
      ]
    }
  ],
  "lastUpdated": "2025-08-12T00:00:00.000Z"
}
```

## Uso desde Framer (fetch)
```js
fetch("https://TU-PROYECTO.vercel.app/api/plans?zip=93458")
  .then(r => r.json())
  .then(data => console.log(data));
```
