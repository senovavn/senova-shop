import { getResponse } from 'msw'
import { createHandlers } from './handlers'

/**
 * A fetch that answers Storefront API calls from MSW handlers without patching global fetch,
 * so it behaves the same in Server Components, route handlers and tests.
 */
export function createMockFetch(base: string): typeof fetch {
  const handlers = createHandlers(base)
  return async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    const response = await getResponse(handlers, request)
    return (
      response ??
      Response.json(
        { code: 'mock_missing', message: `No mock for ${request.method} ${new URL(request.url).pathname}` },
        { status: 501 },
      )
    )
  }
}
