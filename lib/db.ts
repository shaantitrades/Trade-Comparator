import { Pool } from 'pg'

// Log DB host on startup (sanitized - no password)
const dbUrl = process.env.DATABASE_URL || ''
if (dbUrl) {
  try {
    const u = new URL(dbUrl)
    console.log(`[DB] Connecting to: ${u.hostname}:${u.port || 5432}${u.pathname}`)
  } catch {
    console.warn('[DB] DATABASE_URL is set but could not be parsed')
  }
} else {
  console.error('[DB] DATABASE_URL is NOT set!')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  query_timeout: 10000,
  statement_timeout: 10000,
})

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message)
})

export default pool
