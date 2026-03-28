import { useState, useEffect } from 'react'

const API = '/xrpc'

const TAGS = {
  series: '#subplot-series',
  filme:  '#subplot-filme',
  anime:  '#subplot-anime',
}

export function useFeed(filter = 'todos') {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPosts(filter)
      .then(setPosts)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [filter])

  return { posts, loading, error }
}

async function fetchPosts(filter) {
  const tags = filter === 'todos'
    ? Object.values(TAGS)
    : [TAGS[filter]]
  const results = await Promise.all(tags.map(searchByTag))
  const merged = results.flat()
  merged.sort((a, b) => b.replyCount - a.replyCount)
  return merged
}

async function searchByTag(tag) {
  const res = await fetch(
    `${API}/app.bsky.feed.searchPosts?q=${encodeURIComponent(tag)}&limit=20`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return (data.posts ?? [])
    .filter(p => p.record?.$type === 'app.bsky.feed.post')
    .filter(p => !p.record?.reply)
    .map(p => ({
      uri: p.uri,
      cid: p.cid,
      author: p.author.handle,
      text: p.record.text,
      tag: resolveTag(p.record.text),
      replyCount: p.replyCount ?? 0,
      indexedAt: p.indexedAt,
    }))
}

function resolveTag(text) {
  if (text.includes('#subplot-series')) return 'series'
  if (text.includes('#subplot-filme'))  return 'filme'
  if (text.includes('#subplot-anime'))  return 'anime'
  return 'series'
}
