import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, '..', 'posts.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id           TEXT PRIMARY KEY,
    author_name  TEXT NOT NULL,
    author_initials TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    route_name   TEXT NOT NULL,
    grade        TEXT NOT NULL DEFAULT '',
    comment      TEXT NOT NULL,
    timestamp    TEXT NOT NULL,
    image_data_url TEXT,
    likes        INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id              TEXT PRIMARY KEY,
    post_id         TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_name     TEXT NOT NULL,
    author_initials TEXT NOT NULL,
    avatar_color    TEXT NOT NULL,
    text            TEXT NOT NULL,
    timestamp       TEXT NOT NULL
  );
`)

const postCount = (db.prepare('SELECT COUNT(*) as n FROM posts').get() as { n: number }).n

export default db
