import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { AtpAgent } from '@atproto/api'

const isDev = import.meta.env.DEV

export const client = isDev ? null : new BrowserOAuthClient({
  clientMetadata: {
    client_id: `${window.location.origin}/client-metadata.json`,
    client_name: 'Subplot',
    redirect_uris: [`${window.location.origin}/oauth/callback`],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    application_type: 'web',
    dpop_bound_access_tokens: true,
  },
  handleResolver: 'https://bsky.social',
})

export async function login(handle) {
  if (isDev) {
    alert('OAuth não funciona em localhost. Teste em subplot.netlify.app')
    return
  }
  await client.signIn(handle, {
    scope: 'atproto transition:generic',
  })
}

export async function getSession() {
  if (isDev) return null
  return await client.restore()
}

export async function logout() {
  if (isDev) return
  const session = await getSession()
  if (session) await session.signOut()
}

export const publicAgent = new AtpAgent({
  service: 'https://public.api.bsky.app',
})
