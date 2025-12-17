import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: '#DCDFD5',
      color: '#000000',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '2px solid #000',
        padding: '1rem 2rem',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/HYDRASKRIPT_LOGO6.jpg" 
              alt="Hydraskript Logo" 
              style={{ 
                height: '50px',
                width: 'auto',
                border: '2px solid #000'
              }} 
            />
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#0000FF'
            }}>
              Magnus Opus Hydraskript
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard">
              <span style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#0000FF',
                color: '#FFFFFF',
                textDecoration: 'none',
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
                textDecoration: 'none',
                border: '2px solid #000',
                fontWeight: '600',
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                display: 'inline-block',
                cursor: 'pointer'
              }}>
                Admin
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              <span style={{ color: '#0000FF' }}>Magnus Opus</span>
                

              <span style={{ color: '#FF00FF' }}>AI eBook Generator</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              color: '#333'
            }}>
              Generate professional 90-150+ page eBooks with AI. Free-tier architecture, extreme long-form capability.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/dashboard">
                <span style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#FF00FF',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  border: '2px solid #000',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}>
                  ✨ Start Writing
                </span>
              </Link>
              <Link href="/admin">
                <span style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#00FFFF',
                  color: '#000000',
                  textDecoration: 'none',
                  border: '2px solid #000',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}>
                  📊 Admin Dashboard
                </span>
              </Link>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#0000FF'
            }}>
              Key Features
            </h3>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { icon: '📚', text: '90-150+ Pages', color: '#0000FF' },
                { icon: '⚡', text: 'Free-Tier Architecture', color: '#FF00FF' },
                { icon: '🎨', text: 'Multi-Modal Output', color: '#00FFFF' },
                { icon: '🤖', text: 'AI-Powered Generation', color: '#FFBF00' },
                { icon: '📤', text: 'PDF, EPUB, DOCX Export', color: '#BEF754' }
              ].map((feature, index) => (
                <li 
                  key={index}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    borderLeft: `4px solid ${feature.color}`,
                    backgroundColor: '#F9F9F9'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                    {feature.icon}
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '2px solid #000',
        borderBottom: '2px solid #000',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            Powerful Features
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '3rem'
          }}>
            Everything you need to create professional eBooks
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '📖',
                title: 'Extreme Long-Form',
                description: 'Generate 90-150+ page books with maintained coherence and consistency.',
                color: '#0000FF'
              },
              {
                icon: '⚡',
                title: 'Free-Tier Architecture',
                description: 'Zero dependency on paid OpenAI/Anthropic APIs. Uses OpenRouter, FAL.ai, and Gemini.',
                color: '#FFBF00'
              },
              {
                icon: '🎨',
                title: 'Multi-Modal Output',
                description: 'Generate text, images, and audiobooks from a single platform.',
                color: '#FF00FF'
              },
              {
                icon: '📊',
                title: 'Admin Dashboard',
                description: 'Complete system monitoring and user management for platform owners.',
                color: '#00FFFF'
              },
              {
                icon: '👥',
                title: 'Character Consistency',
                description: 'AI ensures character names and details remain consistent throughout.',
                color: '#BEF754'
              },
              {
                icon: '📤',
                title: 'Export Options',
                description: 'Download as PDF, EPUB, DOCX, or generate complete audiobooks.',
                color: '#FF00FF'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  border: '2px solid #000',
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: feature.color
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
          padding: '3rem',
          border: '2px solid #000',
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#FFFFFF'
          }}>
            Ready to Create Your Magnum Opus?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: '#FFFFFF'
          }}>
            Start generating professional eBooks with AI. No technical skills required.
          </p>
          <Link href="/dashboard">
            <span style={{
              padding: '1rem 2.5rem',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              textDecoration: 'none',
              border: '2px solid #000',
              fontWeight: '600',
              fontSize: '1.2rem',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
              display: 'inline-block',
              cursor: 'pointer'
            }}>
              🚀 Start Writing Now
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '2px solid #000',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <p style={{ color: '#666' }}>
          Magnus Opus Hydraskript © 2025 | AI-Powered eBook Generation Platform
        </p>
      </footer>
    </div>
  )
}
