
export const API_BASE = 'http://localhost:4000/api/v1'

export async function api(path, method='GET', body=null, token=null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = 'Bearer ' + token

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  })

  const text = await res.text()
  let json = {}
  try { json = JSON.parse(text) } catch {}

  if (!res.ok) throw new Error(json.error || 'Request failed')

  return json
}
