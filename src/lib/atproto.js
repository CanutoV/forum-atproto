import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { AtpAgent } from '@atproto/api'

const isDev = import.meta.env.DEV

export const client = new BrowserOAuthClient({
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
    alert('OAuth pode não funcionar completamente em localhost devido a restrições de CORS e HTTPS. Teste em produção para funcionalidade completa.')
  }
  await client.signIn(handle, {
    scope: 'atproto transition:generic',
  })
}

export async function getSession() {
  return await client.restore()
}

export async function logout() {
  const session = await getSession()
  if (session) await session.signOut()
}

export const publicAgent = new AtpAgent({
  service: 'https://public.api.bsky.app',
})
