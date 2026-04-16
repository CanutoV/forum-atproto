import { useState, useEffect } from 'react'
import { client, logout as doLogout } from '../lib/atproto'

export function useAuth() {
  const [session, setSession] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.restore()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    await doLogout()
    setSession(null)
  }

  return { session, loading, logout }
}
