'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  status: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      alert('Please enter a project title')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjectTitle,
          description: newProjectDescription
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProjects([...projects, data.project])
        setShowCreateModal(false)
        setNewProjectTitle('')
        setNewProjectDescription('')
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#DCDFD5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '2px solid #000', padding: '1rem 2rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0000FF', cursor: 'pointer' }}>
              Magnus Opus Hydraskript
            </h1>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard">
              <span style={{ padding: '0.5rem 1.5rem', backgroundColor: '#0000FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', display: 'inline-block', cursor: 'pointer' }}>
                📚 Dashboard
              </span>
            </Link>
            <Link href="/editorial">
              <span style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', display: 'inline-block', cursor: 'pointer' }}>
                📝 Editorial
              </span>
            </Link>
            <Link href="/styles">
              <span style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', display: 'inline-block', cursor: 'pointer' }}>
                🎨 Styles
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0000FF' }}>
            📚 My Projects
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '1rem 2rem', backgroundColor: '#FF00FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', fontSize: '1.1rem', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer' }}
          >
            + Create New Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              No Projects Yet
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Create your first project to start writing your book!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '1rem 2rem', backgroundColor: '#FF00FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', fontSize: '1.1rem', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer' }}
            >
              + Create New Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {project.title}
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem', minHeight: '3rem' }}>
                  {project.description}
                </p>
                <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem' }}>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <Link href={`/projects/${project.id}/write`}>
                  <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0000FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer' }}>
                    ✍️ Start Writing
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 1)', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Create New Project
            </h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Project Title *
              </label>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="My Amazing Book"
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', fontSize: '1rem' }}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Description (Optional)
              </label>
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your book..."
                rows={4}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewProjectTitle('')
                  setNewProjectDescription('')
                }}
                disabled={isCreating}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FFFFFF', border: '2px solid #000', fontWeight: '600', cursor: isCreating ? 'not-allowed' : 'pointer', opacity: isCreating ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#FF00FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', cursor: isCreating ? 'not-allowed' : 'pointer', opacity: isCreating ? 0.5 : 1 }}
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
