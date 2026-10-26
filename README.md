# my-landing

Landing personal de Manuel Espinoza, ingeniero de software. Vite + React + TypeScript + Tailwind CSS v4, pensada para Cloudflare Pages.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
npm run preview   # sirve dist/ en local
```

## Dónde editar

| Qué | Archivo |
|---|---|
| Todo el texto (hero, trayectoria, proyectos, stack, FAQ) | `src/content.ts` |
| Colores, fuentes y curvas de animación | `src/index.css` (bloque `@theme`) |
| Escenas isométricas de la trayectoria | `src/components/journey/scenes.tsx` |
| Animaciones de las tarjetas de proyectos | `src/components/work/visuals.tsx` y `work.css` |
| Dominio para canonical, Open Graph, robots y sitemap | `.env` → `VITE_SITE_URL` |

## Páginas

- `/` landing principal
- `/privacidad/` política de privacidad
- `404.html` página de error propia (Cloudflare Pages la sirve con estado 404)

## Despliegue en Cloudflare Pages

**Opción A, desde Git (recomendada).** Sube el repo a GitHub o GitLab y en Cloudflare: Workers & Pages → Create → Pages → Connect to Git.

- Framework preset: `None` (o `Vite`)
- Build command: `npm run build`
- Build output directory: `dist`
- Variable de entorno: `VITE_SITE_URL=https://tu-dominio` (y `NODE_VERSION=22` si el build usa una versión antigua)

Luego en el proyecto: Custom domains → Set up a custom domain → tu dominio. Si el dominio ya está en Cloudflare, el DNS se configura solo.

**Opción B, subida directa con Wrangler.**

```bash
npx wrangler login
npm run deploy    # build + wrangler pages deploy dist
```

`public/_headers` define caché larga para `/assets/*` y cabeceras de seguridad básicas.

## Créditos de diseño

- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills): `landing-page-design` (estructura, copy y sistema visual) y `design-to-motion` (historias animadas de las tarjetas).
- [oso95/scroll-world](https://github.com/oso95/scroll-world): la idea de la cámara que vuela entre escenas al hacer scroll. Aquí se dibuja en SVG en vez de video generado.
