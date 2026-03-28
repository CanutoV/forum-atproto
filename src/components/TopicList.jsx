import { useNavigate } from 'react-router-dom'

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

function excerpt(text, max = 80) {
  const clean = text.replace(/#subplot-\w+/g, '').trim()
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

export default function TopicList({ posts }) {
  const navigate = useNavigate()

  return (
    <div>
      {posts.map(post => (
        <div
          key={post.uri}
          onClick={() => navigate(`/thread/${encodeURIComponent(post.uri)}`)}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '0.5px solid #e5e5e5', cursor: 'pointer' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {excerpt(post.text)}
            </div>
            <div style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, ...TAG_STYLE[post.tag] }}>
                {TAG_LABEL[post.tag]}
              </span>
              <span>{post.author}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
              <span>{timeAgo(post.indexedAt)}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 500, display: 'block' }}>{post.replyCount}</span>
            <span style={{ fontSize: 12, color: '#888' }}>replies</span>
          </div>
        </div>
      ))}
    </div>
  )
}
