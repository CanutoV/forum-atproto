import { useState, useEffect } from 'react'

const API = '/xrpc'

export function useThread(uri) {
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uri) return
    setLoading(true)
    setError(null)
    fetchThread(uri)
      .then(setThread)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [uri])

  return { thread, loading, error }
}

async function fetchThread(uri) {
  const res = await fetch(
    `${API}/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=10`
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return parseThread(data.thread)
}

function parseThread(node) {
  if (!node || node.$type !== 'app.bsky.feed.defs#threadViewPost') return null
  const post = node.post
  return {
    uri: post.uri,
    author: post.author.handle,
    displayName: post.author.displayName || post.author.handle,
    initials: getInitials(post.author.displayName || post.author.handle),
    text: post.record.text,
    indexedAt: post.indexedAt,
    replyCount: post.replyCount ?? 0,
    likeCount: post.likeCount ?? 0,
    tag: resolveTag(post.record.text),
    replies: (node.replies ?? [])
      .map(parseThread)
      .filter(Boolean)
      .sort((a, b) => new Date(a.indexedAt) - new Date(b.indexedAt)),
  }
}

function resolveTag(text) {
  if (text.includes('#subplot-series')) return 'series'
  if (text.includes('#subplot-filme'))  return 'filme'
  if (text.includes('#subplot-anime'))  return 'anime'
  return 'series'
}

function getInitials(name) {
  return name.split(/[\s.]+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
}
