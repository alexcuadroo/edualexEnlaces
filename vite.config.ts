import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function reorderLinksPlugin(): Plugin {
  return {
    name: 'reorder-links',
    configureServer(server) {
      server.middlewares.use('/reorder', (req, res, next) => {
        if (req.method !== 'GET') return next()
        const filePath = path.resolve(__dirname, 'scripts/reorder.html')
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404
          res.end('Not found')
          return
        }
        const html = fs.readFileSync(filePath, 'utf-8')
        res.setHeader('Content-Type', 'text/html')
        res.end(html)
      })

      server.middlewares.use('/api/links.json', (req, res, next) => {
        if (req.method !== 'PUT') return next()

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const jsonPath = path.resolve(__dirname, 'public/links.json')
            const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
            const update = JSON.parse(body)
            const merged = { ...existing, ...update }
            fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2) + '\n', 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  build: { outDir: 'dist' },
  plugins: [reorderLinksPlugin()],
})
