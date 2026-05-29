import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

function mapPost(p: Record<string, unknown>, comments: Record<string, unknown>[]) {
  return {
    id: p.id,
    authorName: p.author_name,
    authorInitials: p.author_initials,
    avatarColor: p.avatar_color,
    routeName: p.route_name,
    grade: p.grade,
    difficulty: p.difficulty ?? '',
    comment: p.comment,
    timestamp: p.timestamp,
    imageDataUrl: p.image_data_url ?? undefined,
    likes: p.likes,
    likedByMe: false,
    comments: comments
      .filter(c => c.post_id === p.id)
      .map(c => ({
        id: c.id,
        authorName: c.author_name,
        authorInitials: c.author_initials,
        avatarColor: c.avatar_color,
        text: c.text,
        timestamp: c.timestamp,
      })),
  }
}

app.get('/api/posts', (req, res) => {
  const limit  = Math.min(parseInt((req.query.limit  as string) || '8', 10), 50)
  const offset = Math.max(parseInt((req.query.offset as string) || '0', 10), 0)

  const { total } = db.prepare('SELECT COUNT(*) as total FROM posts').get() as { total: number }
  const posts = db.prepare(
    'SELECT * FROM posts ORDER BY timestamp DESC LIMIT ? OFFSET ?'
  ).all(limit, offset) as Record<string, unknown>[]

  const comments = posts.length > 0
    ? db.prepare(
        `SELECT * FROM comments WHERE post_id IN (${posts.map(() => '?').join(',')}) ORDER BY timestamp ASC`
      ).all(...posts.map(p => p.id)) as Record<string, unknown>[]
    : []

  res.json({
    posts: posts.map(p => mapPost(p, comments)),
    total,
    hasMore: offset + posts.length < total,
  })
})

app.post('/api/posts', (req, res) => {
  const { id, authorName, authorInitials, avatarColor, routeName, grade, difficulty, comment, timestamp, imageDataUrl } = req.body
  db.prepare(`
    INSERT INTO posts (id, author_name, author_initials, avatar_color, route_name, grade, difficulty, comment, timestamp, image_data_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, authorName, authorInitials, avatarColor, routeName, grade ?? '', difficulty ?? '', comment, timestamp, imageDataUrl ?? null)
  res.json({ ok: true })
})

app.post('/api/posts/:id/like', (req, res) => {
  const { increment } = req.body as { increment: boolean }
  db.prepare(`UPDATE posts SET likes = MAX(0, likes ${increment ? '+' : '-'} 1) WHERE id = ?`).run(req.params.id)
  const row = db.prepare('SELECT likes FROM posts WHERE id = ?').get(req.params.id) as { likes: number }
  res.json({ likes: row?.likes ?? 0 })
})

app.post('/api/posts/:id/comments', (req, res) => {
  const { id, authorName, authorInitials, avatarColor, text, timestamp } = req.body
  db.prepare(`
    INSERT INTO comments (id, post_id, author_name, author_initials, avatar_color, text, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.id, authorName, authorInitials, avatarColor, text, timestamp)
  res.json({ ok: true })
})

const PORT = parseInt(process.env.PORT ?? '3002', 10)
app.listen(PORT, () => console.log(`API server running on port ${PORT}`))
