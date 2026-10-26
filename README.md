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
| Todo el texto (hero, stack, experiencia, contacto) | `src/content.ts` |
| Colores, fuentes y curvas de animación | `src/index.css` (bloque `@theme`) |
| Escenas isométricas de la experiencia | `src/components/experience/scenes.tsx` |
| Logos de tecnologías | `src/components/experience/logos.tsx` |
| Diagrama del inicio (pestañas) | `src/components/showcase/scenes.tsx` |
| Dominio para canonical, Open Graph, robots y sitemap | `.env` → `VITE_SITE_URL` |

## Páginas

- `/` landing principal
- `/privacidad/` política de privacidad
- `404.html` página de error propia (Cloudflare la sirve con estado 404)

## Despliegue en Cloudflare

El sitio se publica como Worker con assets estáticos (`wrangler.toml` → `[assets]`), sin código de servidor.

**Desde Git (recomendado).** Workers & Pages → Create → Import a repository.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- El `name` de `wrangler.toml` debe coincidir con el nombre del Worker en el dashboard
- `VITE_SITE_URL` sale de `.env`; para cambiarlo sin tocar el repo, agrégalo en Settings → Build → Variables

Luego: Settings → Domains & Routes → Add → Custom domain → tu dominio. Si el dominio ya está en Cloudflare, el DNS se configura solo.

**Desde tu máquina.**

```bash
npx wrangler login
npm run deploy    # build + wrangler deploy
```

`public/_headers` define caché larga para `/assets/*` y cabeceras de seguridad básicas. Las rutas que no existen devuelven `404.html` con estado 404.

## Créditos de diseño

- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills): `landing-page-design` (estructura, copy y sistema visual) y `design-to-motion` (historias animadas de las tarjetas).
- [oso95/scroll-world](https://github.com/oso95/scroll-world): la idea de la cámara que vuela entre escenas al hacer scroll. Aquí se dibuja en SVG en vez de video generado.
