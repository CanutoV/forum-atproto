import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../lib/atproto'

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    client.callback(new URLSearchParams(window.location.search))
      .then(() => navigate('/'))
      .catch(console.error)
  }, [])

  return <p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Autenticando...</p>
}
