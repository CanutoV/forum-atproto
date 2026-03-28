import { useParams, useNavigate } from 'react-router-dom'
import { useThread } from '../hooks/useThread'
import { useAuth } from '../hooks/useAuth'
import { login } from '../lib/atproto'
import { useState } from 'react'

const TAG_STYLE = {
  series: { background: '#E6F1FB', color: '#0C447C' },
  filme:  { background: '#EEEDFE', color: '#3C3489' },
  anime:  { background: '#FAECE7', color: '#712B13' },
}
const TAG_LABEL = { series: 'série', filme: 'filme', anime: 'anime' }

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`
  return `há ${Math.floor(diff / 86400)}d`
}

function cleanText(text) {
  return text.replace(/#subplot-\w+/g, '').trim()
}

function Avatar({ initials, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#E6F1FB', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.38, fontWeight: 500,
      color: '#0C447C', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function Reply({ post, depth = 0 }) {
  if (depth > 4) return null
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
      <div>
        <Avatar initials={post.initials} />
        {post.replies.length > 0 && (
          <div style={{ width: 1, background: '#e5e5e5', margin: '4px auto 0', height: '100%', minHeight: 24 }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{post.author}</span>
          <span style={{ fontSize: 12, color: '#888' }}>{timeAgo(post.indexedAt)}</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 8 }}>
          {cleanText(post.text)}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 12, color: '#888' }}>curtir · {post.likeCount}</span>
          
          <a href={`https://bsky.app/profile/${post.author}/post/${post.uri.split('/').pop()}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: '#888' }}
          >
            ver no Bluesky
          </a>
        </div>
        {post.replies.map(r => (
          <div key={r.uri} style={{ marginTop: 16 }}>
            <Reply post={r} depth={depth + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Thread() {
  const { uri } = useParams()
  const navigate = useNavigate()
  const decoded = decodeURIComponent(uri)
  const { thread, loading, error } = useThread(decoded)
  const { session } = useAuth()
  const [handle, setHandle] = useState('')
  const [showGate, setShowGate] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!handle.trim()) return
    try { await login(handle.trim()) } catch (err) { console.error(err) }
  }

  if (loading) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontSize: 14, color: '#888' }}>
      carregando...
    </div>
  )

  if (error || !thread) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontSize: 14, color: '#c00' }}>
      erro ao carregar thread
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1rem' }}>

      <div style={{ padding: '14px 0 18px', borderBottom: '0.5px solid #e5e5e5', marginBottom: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          todos os tópicos
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, ...TAG_STYLE[thread.tag] }}>
          {TAG_LABEL[thread.tag]}
        </span>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, lineHeight: 1.35 }}>
        {cleanText(thread.text)}
      </h1>

      <div style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <Avatar initials={thread.initials} size={22} />
        <span>{thread.author}</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
        <span>{timeAgo(thread.indexedAt)}</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
        
          <a href={`https://bsky.app/profile/${thread.author}/post/${thread.uri.split('/').pop()}`}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 12, color: '#888' }}
        >
          ver no Bluesky
        </a>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.7, padding: 16, background: '#f7f7f5', borderRadius: 12, marginBottom: 24 }}>
        {cleanText(thread.text)}
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 14, paddingBottom: 10, borderBottom: '0.5px solid #e5e5e5' }}>
        {thread.replyCount} {thread.replyCount === 1 ? 'resposta' : 'respostas'} · leitura pública
      </div>

      {thread.replies.length === 0 && (
        <p style={{ fontSize: 14, color: '#888' }}>nenhuma resposta ainda.</p>
      )}

      {thread.replies.map(reply => (
        <Reply key={reply.uri} post={reply} />
      ))}

      <div style={{ marginTop: 24, borderTop: '0.5px solid #e5e5e5', paddingTop: 20 }}>
        {session ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              placeholder="sua resposta..."
              style={{ width: '100%', fontSize: 14, padding: '10px 12px', borderRadius: 8, border: '0.5px solid #ccc', resize: 'none', minHeight: 72, fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#888' }}>postando como {session.did}</span>
              <button style={{ fontSize: 13, padding: '7px 16px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', cursor: 'pointer' }}>
                responder
              </button>
            </div>
          </div>
        ) : showGate ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>para responder, entre com sua conta Bluesky</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8 }}>
              <input
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="seu.handle.bsky.social"
                style={{ fontSize: 13, padding: '6px 10px', border: '0.5px solid #ccc', borderRadius: 8 }}
              />
              <button type="submit" style={{ fontSize: 13, padding: '7px 14px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', cursor: 'pointer' }}>
                entrar
              </button>
            </form>
            <span style={{ fontSize: 12, color: '#aaa' }}>sua resposta aparece aqui e no Bluesky</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
              para responder ou curtir,<br />entre com sua conta Bluesky
            </p>
            <button
              onClick={() => setShowGate(true)}
              style={{ fontSize: 13, padding: '9px 20px', borderRadius: 8, border: '0.5px solid #ccc', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0085ff', display: 'inline-block' }} />
              entrar com Bluesky
            </button>
            <span style={{ fontSize: 12, color: '#aaa' }}>sua resposta aparece aqui e no Bluesky</span>
          </div>
        )}
      </div>

    </div>
  )
}
