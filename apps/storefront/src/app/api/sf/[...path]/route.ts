import { apiEnv } from '@/lib/env'
import { createMockFetch } from '@/mocks/fetch'

// Backend-for-frontend: lets Client Components read public Storefront API data
// without exposing the upstream host or credentials. Read-only, allow-listed.
const ALLOWED: Array<[RegExp, string]> = [
  [/^products$/, 'public, s-maxage=30, stale-while-revalidate=300'],
  [/^products\/[a-z0-9-]+$/, 'public, s-maxage=30, stale-while-revalidate=300'],
  [/^search\/suggest$/, 'public, s-maxage=30, stale-while-revalidate=300'],
  [/^vouchers$/, 'public, s-maxage=60'],
  [/^promotions\/flash$/, 'public, s-maxage=30'],
  [/^geo\/provinces$/, 'public, s-maxage=86400'],
  [/^inventory$/, 'no-store'],
]

let mockFetch: typeof fetch | undefined

export async function GET(req: Request, ctx: RouteContext<'/api/sf/[...path]'>) {
  const path = (await ctx.params).path.join('/')
  const rule = ALLOWED.find(([re]) => re.test(path))
  if (!rule) return Response.json({ code: 'not_found', message: 'Unknown endpoint' }, { status: 404 })

  const env = apiEnv()
  const upstream = `${env.base}/${path}${new URL(req.url).search}`
  const doFetch = env.mode === 'mock' ? (mockFetch ??= createMockFetch(env.base)) : fetch
  const res = await doFetch(upstream, { headers: { 'X-Storefront-Host': env.host, Accept: 'application/json' } })
  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': res.ok ? rule[1] : 'no-store' },
  })
}
