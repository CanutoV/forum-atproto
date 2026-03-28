import { useState } from 'react'
import { useFeed } from '../hooks/useFeed'
import { useAuth } from '../hooks/useAuth'
import { login } from '../lib/atproto'
import TopicList from '../components/TopicList'
import '../index.css'

const TABS = ['todos', 'series', 'filme', 'anime']
const TAB_LABEL = { todos: 'todos', series: 'séries', filme: 'filmes', anime: 'animes' }

export default function Home() {
  const [filter, setFilter] = useState('todos')
  const [handle, setHandle] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const { session, loading: authLoading, logout } = useAuth()
  const { posts, loading, error } = useFeed(filter)

  async function handleLogin(e) {
    e.preventDefault()
    if (!handle.trim()) return
    try {
      await login(handle.trim())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 18px', borderBottom: '0.5px solid var(--color-border, #e5e5e5)' }}>
        <h1 style={{ fontSize: 18, fontWeight: 500 }}>Subplot</h1>
        {authLoading ? null : session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#888' }}>{session.did}</span>
            <button onClick={logout} style={btnStyle}>sair</button>
          </div>
        ) : showLogin ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8 }}>
            <input
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="seu.handle.bsky.social"
              style={{ fontSize: 13, padding: '6px 10px', border: '0.5px solid #ccc', borderRadius: 8 }}
            />
            <button type="submit" style={btnStyle}>entrar</button>
          </form>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ ...btnStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0085ff', display: 'inline-block' }} />
            entrar com Bluesky
          </button>
        )}
      </div>

      <div style={{ display: 'flex', borderBottom: '0.5px solid #e5e5e5', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            fontSize: 13, padding: '10px 16px', background: 'none',
            border: 'none', borderBottom: filter === t ? '2px solid #000' : '2px solid transparent',
            cursor: 'pointer', fontWeight: filter === t ? 500 : 400,
            color: filter === t ? '#000' : '#888', marginBottom: -0.5
          }}>
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '.05em', textTransform: 'uppercase', margin: '20px 0 10px' }}>
        em alta
      </p>

      {loading && <p style={{ color: '#888', fontSize: 14 }}>carregando...</p>}
      {error && <p style={{ color: '#c00', fontSize: 14 }}>erro ao carregar posts</p>}
      {!loading && !error && posts.length === 0 && (
        <p style={{ color: '#888', fontSize: 14 }}>
          nenhum tópico ainda. poste no Bluesky com <code>#subplot-series</code>, <code>#subplot-filme</code> ou <code>#subplot-anime</code>
        </p>
      )}
      {!loading && <TopicList posts={posts} />}
    </div>
  )
}

const btnStyle = {
  fontSize: 13, padding: '7px 14px',
  borderRadius: 8, border: '0.5px solid #ccc',
  background: '#fff', cursor: 'pointer'
}
