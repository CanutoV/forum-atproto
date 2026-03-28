import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { AtpAgent } from '@atproto/api'

const isDev = import.meta.env.DEV

export const client = isDev ? null : new BrowserOAuthClient({
  clientMetadata: {
    client_id: `${window.location.origin}/client-metadata.json`,
    redirect_uris: [`${window.location.origin}/oauth/callback`],
  },
  handleResolver: 'https://bsky.social',
})

export async function login(handle) {
  if (isDev) {
    throw new Error('OAuth não funciona em localhost. Use npm run preview após build, ou faça deploy no Netlify.')
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
