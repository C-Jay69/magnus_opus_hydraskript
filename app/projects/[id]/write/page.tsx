'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BOOK_TEMPLATES, BookTemplate, getTemplateById } from '@/lib/templates'

interface Project {
  id: string
  title: string
  description: string
  genre: string
  targetPages: number
}

interface GeneratedChapter {
  chapterNumber: number
  title: string
  content: string
  status: 'completed' | 'generating' | 'pending'
}

export default function WritePage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<BookTemplate | null>(null)
  const [exportFormat, setExportFormat] = useState<'txt' | 'pdf' | 'docx' | 'epub'>('txt')
  const [config, setConfig] = useState({
    targetPages: 100,
    genre: 'Fiction',
    tone: 'Professional',
    audience: 'General',
    additionalInstructions: ''
  })
  const [generatedChapters, setGeneratedChapters] = useState<GeneratedChapter[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch project data
  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }

  const handleTemplateSelect = (template: BookTemplate) => {
    setSelectedTemplate(template)
    setConfig({
      ...config,
      ...template.defaultConfig
    })
    setCurrentStep(2)
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || !project) return

    setIsGenerating(true)
    setCurrentStep(3)

    try {
      const response = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          config,
          projectTitle: project.title,
          projectDescription: project.description
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedChapters(data.chapters)
        setCurrentStep(4)
      } else {
        alert('Failed to generate content')
        setCurrentStep(2)
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error generating content')
      setCurrentStep(2)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#DCDFD5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <nav style={{
        borderBottom: '2px solid #000',
        padding: '1rem 2rem',
        backgroundColor: '#FFFFFF',
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {project && (
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              {project.title}
            </span>
          )}
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
              Back to Dashboard
            </span>
          </Link>
        </div>
      </nav>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {[
            { num: 1, label: 'Choose Template' },
            { num: 2, label: 'Configure' },
            { num: 3, label: 'Generate' },
            { num: 4, label: 'Edit' }
          ].map((step) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step.num ? '#0000FF' : '#FFFFFF',
                color: currentStep >= step.num ? '#FFFFFF' : '#000000',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {step.num}
              </div>
              <span style={{
                fontWeight: currentStep === step.num ? 'bold' : 'normal',
                color: currentStep >= step.num ? '#000000' : '#999999'
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Choose Your Book Template
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              Select a template that matches your vision
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {BOOK_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '2rem',
                    border: '2px solid #000',
                    boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)'
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0, 0, 0, 1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0, 0)'
                    e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(0, 0, 0, 1)'
                  }}
                >
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    {template.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {template.name}
                  </h3>
                  <p style={{
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {template.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {template.features.aiGeneration && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#BEF754',
                        border: '1px solid #000',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        AI Generated
                      </span>
                    )}
                    {template.features.imageGeneration && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#FFBF00',
                        border: '1px solid #000',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Images
                      </span>
                    )}
                    {template.features.audioGeneration && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#00FFFF',
                        border: '1px solid #000',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Audio
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configuration */}
        {currentStep === 2 && selectedTemplate && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Configure Your {selectedTemplate.name}
            </h2>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
              marginBottom: '2rem'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Target Pages: {config.targetPages}
                </label>
                <input
                  type="range"
                  min={selectedTemplate.pageRange.min}
                  max={selectedTemplate.pageRange.max}
                  value={config.targetPages}
                  onChange={(e) => setConfig({ ...config, targetPages: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  <span>{selectedTemplate.pageRange.min}</span>
                  <span>{selectedTemplate.pageRange.max}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Genre
                </label>
                <input
                  type="text"
                  value={config.genre}
                  onChange={(e) => setConfig({ ...config, genre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Tone
                </label>
                <select
                  value={config.tone}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem'
                  }}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Playful</option>
                  <option>Dramatic</option>
                  <option>Epic</option>
                  <option>Humorous</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={config.audience}
                  onChange={(e) => setConfig({ ...config, audience: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Additional Instructions (Optional)
                </label>
                <textarea
                  value={config.additionalInstructions}
                  onChange={(e) => setConfig({ ...config, additionalInstructions: e.target.value })}
                  placeholder="Any specific themes, characters, or elements you want included..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #000',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '2px solid #000',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#0000FF',
                  color: '#FFFFFF',
                  border: '2px solid #000',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                  cursor: 'pointer'
                }}
              >
                Generate Book →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {currentStep === 3 && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '4rem 2rem',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                animation: 'pulse 2s infinite'
              }}>
                ✨
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                Generating Your Book...
              </h2>
              <p style={{
                color: '#666',
                fontSize: '1.1rem'
              }}>
                AI is crafting your {selectedTemplate?.name}. This may take a few moments.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Edit Generated Content */}
        {currentStep === 4 && (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📝 Your Generated Content
            </h2>

            <div style={{
              display: 'grid',
              gap: '1.5rem'
            }}>
              {generatedChapters.map((chapter) => (
                <div
                  key={chapter.chapterNumber}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '2rem',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#BEF754',
                      border: '1px solid #000',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {chapter.status}
                    </span>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F5F5F5',
                    border: '1px solid #DDD',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Georgia, serif',
                    lineHeight: '1.6'
                  }}>
                    {chapter.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Export Section */}
            <div style={{
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              {/* Format Selector */}
              <div style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                {(['txt', 'pdf', 'docx', 'epub'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: exportFormat === format ? '#0000FF' : '#FFFFFF',
                      color: exportFormat === format ? '#FFFFFF' : '#000000',
                      border: '2px solid #000',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={async () => {
                  if (!project) return

                  const metadata = {
                    title: project.title,
                    author: 'AI Generated',
                    description: project.description
                  }

                  try {
                    switch (exportFormat) {
                      case 'txt':
                        const { exportAsTxt } = await import('@/lib/export-utils')
                        exportAsTxt(generatedChapters, metadata)
                        break
                      case 'pdf':
                        const { exportAsPdf } = await import('@/lib/export-utils')
                        await exportAsPdf(generatedChapters, metadata)
                        break
                      case 'docx':
                        const { exportAsDocx } = await import('@/lib/export-utils')
                        await exportAsDocx(generatedChapters, metadata)
                        break
                      case 'epub':
                        const { exportAsEpub } = await import('@/lib/export-utils')
                        await exportAsEpub(generatedChapters, metadata)
                        break
                    }
                  } catch (error) {
                    console.error('Export error:', error)
                    alert(`Failed to export as ${exportFormat.toUpperCase()}`)
                  }
                }}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#0000FF',
                  color: '#FFFFFF',
                  border: '2px solid #000',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                  cursor: 'pointer'
                }}
              >
                💾 Download as {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
