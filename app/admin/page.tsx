import Link from 'next/link'

export default function AdminPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#DCDFD5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '2px solid #000',
        padding: '1rem 2rem',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/">
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#0000FF',
              cursor: 'pointer'
            }}>
              Magnus Opus Hydraskript
            </h1>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard">
              <span style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: '2px solid #000',
                fontWeight: '600',
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                display: 'inline-block',
                cursor: 'pointer'
              }}>
                Dashboard
              </span>
            </Link>
            <Link href="/admin">
              <span style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#FFBF00',
                color: '#000000',
                border: '2px solid #000',
                fontWeight: '600',
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                display: 'inline-block',
                cursor: 'pointer'
              }}>
                Admin
              </span>
            </Link>
            <Link href="/">
              <span style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: '2px solid #000',
                fontWeight: '600',
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                display: 'inline-block',
                cursor: 'pointer'
              }}>
                Home
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#FFBF00'
        }}>
          ⚙️ Admin Dashboard
        </h1>

        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '3rem',
          border: '2px solid #000',
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔧</div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Admin Control Panel
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1.1rem'
          }}>
            System monitoring and management tools
          </p>
        </div>
      </main>
    </div>
  )
}
