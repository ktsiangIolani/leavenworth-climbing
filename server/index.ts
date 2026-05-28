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

app.get('/api/posts', (_req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY timestamp DESC').all() as Record<string, unknown>[]
  const comments = db.prepare('SELECT * FROM comments ORDER BY timestamp ASC').all() as Record<string, unknown>[]
  res.json(posts.map(p => mapPost(p, comments)))
})

app.post('/api/posts', (req, res) => {
  const { id, authorName, authorInitials, avatarColor, routeName, grade, comment, timestamp, imageDataUrl } = req.body
  db.prepare(`
    INSERT INTO posts (id, author_name, author_initials, avatar_color, route_name, grade, comment, timestamp, image_data_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, authorName, authorInitials, avatarColor, routeName, grade ?? '', comment, timestamp, imageDataUrl ?? null)
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
