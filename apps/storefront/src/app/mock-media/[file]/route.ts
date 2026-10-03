import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { apiEnv } from '@/lib/env'

// Dev/demo only: serves fixture SVGs referenced by the mock API. Real images come from SourceLiq media CDN.
const FIXTURE_DIR = join(process.cwd(), '../../fixtures/storefront/images')
const SAFE_NAME = /^[a-z0-9-]+\.svg$/

export async function GET(_req: Request, ctx: RouteContext<'/mock-media/[file]'>) {
  const { file } = await ctx.params
  if (apiEnv().mode !== 'mock' || !SAFE_NAME.test(file)) return new Response('Not found', { status: 404 })
  try {
    const svg = await readFile(join(FIXTURE_DIR, file))
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400, immutable' },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
