'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  targetPages: number
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Fiction',
    targetPages: 100
  })

  // Fetch projects on load
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newProject = await response.json()
        setProjects([newProject, ...projects])
        setShowModal(false)
        setFormData({ title: '', description: '', genre: 'Fiction', targetPages: 100 })
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    } finally {
      setLoading(false)
    }
  }

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
                backgroundColor: '#0000FF',
                color: '#FFFFFF',
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
                backgroundColor: '#FFFFFF',
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#0000FF'
          }}>
            📚 My Projects
          </h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#FF00FF',
              color: '#FFFFFF',
              border: '2px solid #000',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
              cursor: 'pointer'
            }}
          >
            ✨ Create New Project
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '4rem',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              No Projects Yet
            </h2>
            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              marginBottom: '2rem'
            }}>
              Create your first AI-generated eBook project to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#FF00FF',
                color: '#FFFFFF',
                border: '2px solid #000',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                cursor: 'pointer'
              }}
            >
              ✨ Create Your First Project
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  border: '2px solid #000',
                  boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '2rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: 'bold'
                    }}>
                      {project.title}
                    </h2>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#FFBF00',
                      color: '#000000',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid #000'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <p style={{
                    color: '#666',
                    marginBottom: '1rem',
                    fontSize: '1.05rem'
                  }}>
                    {project.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <span>📖 {project.genre}</span>
                    <span>📄 Target: {project.targetPages} pages</span>
                    <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <Link href={`/projects/${project.id}/write`}>
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#0000FF',
                      color: '#FFFFFF',
                      border: '2px solid #000',
                      fontWeight: '600',
                      boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>
                      Start Writing
                    </span>
                  </Link>

                  <button style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000',
                    fontWeight: '600',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            border: '2px solid #000',
            boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#0000FF'
            }}>
              ✨ Create New Project
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The AI Revolution"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your eBook..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Genre
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Science Fiction</option>
                  <option>Fantasy</option>
                  <option>Mystery</option>
                  <option>Romance</option>
                  <option>Thriller</option>
                  <option>Business</option>
                  <option>Self-Help</option>
                  <option>Biography</option>
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Target Pages: {formData.targetPages}
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={formData.targetPages}
                  onChange={(e) => setFormData({ ...formData, targetPages: parseInt(e.target.value) })}
                  style={{
                    width: '100%'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: '#666',
                  marginTop: '0.25rem'
                }}>
                  <span>50 pages</span>
                  <span>200 pages</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000',
                    fontWeight: '600',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#FF00FF',
                    color: '#FFFFFF',
                    border: '2px solid #000',
                    fontWeight: '600',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
