export default async (req, context) => {
  const url = new URL(req.url)
  const path = url.pathname.replace('/.netlify/functions/bsky-proxy', '')
  const target = `https://public.api.bsky.app/xrpc${path}${url.search}`

  const res = await fetch(target, {
    headers: { 'Accept': 'application/json' }
  })

  const data = await res.text()

  return new Response(data, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}

export const config = { path: '/xrpc/*' }
