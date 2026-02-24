// Vercel serverless function — wraps the TanStack Start SSR fetch handler
const { default: server } = await import(
  new URL('../dist/server/server.js', import.meta.url)
)

export default async function handler(req, res) {
  const proto = (req.headers['x-forwarded-proto'] ?? 'https').split(',')[0].trim()
  const host = req.headers['host'] ?? 'localhost'
  const url = new URL(req.url, `${proto}://${host}`)

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value != null) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    }
  }

  const request = new Request(url.href, { method: req.method, headers })

  try {
    const response = await server.fetch(request)
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (err) {
    console.error('[SSR]', err)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
}
