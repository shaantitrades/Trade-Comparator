export default function NotFound() {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#ffffff',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '4rem', fontWeight: 700, margin: 0 }}>404</h1>
          <p style={{ fontSize: '1.25rem', color: '#999', marginTop: '1rem' }}>
            Page not found
          </p>
          <a
            href="/"
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: '#1d4ed8',
              color: '#fff',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  )
}
