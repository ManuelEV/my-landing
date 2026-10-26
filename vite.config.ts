import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { faq } from './src/content'

/** Static SEO files that depend on the site URL: FAQ schema, robots.txt and sitemap.xml. */
function seo(siteUrl: string): Plugin {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return {
    name: 'seo',
    transformIndexHtml(html, ctx) {
      if (!ctx.path.endsWith('/index.html') || ctx.path.includes('privacidad')) return html
      return html.replace(
        '</head>',
        `  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n  </head>`,
      )
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      const urls = ['/', '/privacidad/']
        .map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// Multi page build: each HTML file is a real route on Cloudflare Pages,
// so /privacidad works without a SPA fallback and 404.html returns a real 404.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/$/, '')
  return {
    plugins: [react(), tailwindcss(), seo(siteUrl)],
    build: {
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          privacidad: resolve(import.meta.dirname, 'privacidad/index.html'),
          notFound: resolve(import.meta.dirname, '404.html'),
        },
      },
    },
  }
})
