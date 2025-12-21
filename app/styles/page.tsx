'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAllStyleProfiles, StyleProfile, DEFAULT_PROFILES, TEST_SCENARIOS, saveCustomProfile } from '@/lib/style-profiles'

export default function StyleLibraryPage() {
  const [profiles, setProfiles] = useState<StyleProfile[]>(getAllStyleProfiles())
  const [showCreator, setShowCreator] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<StyleProfile | null>(null)

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
              📚 Dashboard
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '3rem 2rem' }}>
        {!showCreator && !selectedProfile && (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero Section */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              backgroundColor: '#FFFFFF',
              padding: '3rem',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)'
            }}>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                🎨 Style Library
              </h1>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                marginBottom: '2rem'
              }}>
                Create and manage author writing styles. Test them before using in your books.
              </p>
              <button
                onClick={() => {
                  setShowCreator(true)
                  setSelectedProfile(null)
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
                + Create New Style Profile
              </button>
            </div>

            {/* Profiles Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1.5rem',
                    border: '2px solid #000',
                    boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedProfile(profile)}
                >
                  {!DEFAULT_PROFILES.find(p => p.id === profile.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProfile(profile)
                          setShowCreator(true)
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#FFBF00',
                          border: '2px solid #000',
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    paddingRight: '4rem'
                  }}>
                    {profile.name}
                  </h3>
                  {profile.authorReference && (
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#0000FF',
                      fontStyle: 'italic',
                      marginBottom: '0.5rem'
                    }}>
                      Inspired by: {profile.authorReference}
                    </p>
                  )}
                  <p style={{ color: '#666', marginBottom: '1rem' }}>
                    {profile.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid #000'
                    }}>
                      {profile.characteristics.tone}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#F0F0F0',
                      border: '1px solid #000'
                    }}>
                      {profile.characteristics.perspective}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator */}
        {showCreator && (
          <StyleProfileCreator
            existingProfile={selectedProfile}
            onSave={(profile) => {
              saveCustomProfile(profile)
              setProfiles(getAllStyleProfiles())
              setShowCreator(false)
              setSelectedProfile(profile)
            }}
            onCancel={() => {
              setShowCreator(false)
              setSelectedProfile(null)
            }}
          />
        )}

        {/* Viewer */}
        {selectedProfile && !showCreator && (
          <StyleProfileViewer
            profile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onEdit={() => setShowCreator(true)}
          />
        )}
      </main>
    </div>
  )
}

// Style Profile Creator Component
function StyleProfileCreator({ 
  onSave, 
  onCancel,
  existingProfile 
}: { 
  onSave: (profile: StyleProfile) => void
  onCancel: () => void
  existingProfile?: StyleProfile | null
}) {
  const [formData, setFormData] = useState<Partial<StyleProfile>>(
    existingProfile || {
      name: '',
      description: '',
      authorReference: '',
      characteristics: {
        sentenceLength: 'medium',
        vocabulary: '',
        pacing: '',
        perspective: '',
        tone: ''
      },
      guidelines: '',
      doThis: [''],
      dontDoThis: [''],
      sampleText: ''
    }
  )

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in at least the name and description')
      return
    }

    const profile: StyleProfile = {
      id: existingProfile?.id || `custom-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      authorReference: formData.authorReference,
      characteristics: {
        sentenceLength: formData.characteristics?.sentenceLength || 'medium',
        vocabulary: formData.characteristics?.vocabulary || '',
        pacing: formData.characteristics?.pacing || '',
        perspective: formData.characteristics?.perspective || '',
        tone: formData.characteristics?.tone || ''
      },
      guidelines: formData.guidelines || '',
      doThis: (formData.doThis || ['']).filter(item => item.trim() !== ''),
      dontDoThis: (formData.dontDoThis || ['']).filter(item => item.trim() !== ''),
      sampleText: formData.sampleText,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(profile)
  }

  const updateDoThis = (index: number, value: string) => {
    const newDoThis = [...(formData.doThis || [''])]
    newDoThis[index] = value
    setFormData({ ...formData, doThis: newDoThis })
  }

  const addDoThis = () => {
    setFormData({ ...formData, doThis: [...(formData.doThis || ['']), ''] })
  }

  const removeDoThis = (index: number) => {
    const newDoThis = (formData.doThis || ['']).filter((_, i) => i !== index)
    setFormData({ ...formData, doThis: newDoThis.length > 0 ? newDoThis : [''] })
  }

  const updateDontDoThis = (index: number, value: string) => {
    const newDontDoThis = [...(formData.dontDoThis || [''])]
    newDontDoThis[index] = value
    setFormData({ ...formData, dontDoThis: newDontDoThis })
  }

  const addDontDoThis = () => {
    setFormData({ ...formData, dontDoThis: [...(formData.dontDoThis || ['']), ''] })
  }

  const removeDontDoThis = (index: number) => {
    const newDontDoThis = (formData.dontDoThis || ['']).filter((_, i) => i !== index)
    setFormData({ ...formData, dontDoThis: newDontDoThis.length > 0 ? newDontDoThis : [''] })
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '2rem',
      border: '2px solid #000',
      boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        {existingProfile ? '✏️ Edit Style Profile' : '+ Create New Style Profile'}
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Style Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Hemingway-esque Minimalism"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #000',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Description *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this writing style..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #000',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Author Reference (Optional)
        </label>
        <input
          type="text"
          value={formData.authorReference || ''}
          onChange={(e) => setFormData({ ...formData, authorReference: e.target.value })}
          placeholder="e.g., Ernest Hemingway, Stephen King"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #000',
            fontSize: '1rem'
          }}
        />
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
        Style Characteristics
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Sentence Length
          </label>
          <select
            value={formData.characteristics?.sentenceLength || 'medium'}
            onChange={(e) => setFormData({
              ...formData,
              characteristics: {
                ...formData.characteristics!,
                sentenceLength: e.target.value as any
              }
            })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000',
              fontSize: '1rem'
            }}
          >
            <option value="very-short">Very Short</option>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
            <option value="varied">Varied</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Tone
          </label>
          <input
            type="text"
            value={formData.characteristics?.tone || ''}
            onChange={(e) => setFormData({
              ...formData,
              characteristics: {
                ...formData.characteristics!,
                tone: e.target.value
              }
            })}
            placeholder="e.g., dark, humorous, authoritative"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Vocabulary
          </label>
          <input
            type="text"
            value={formData.characteristics?.vocabulary || ''}
            onChange={(e) => setFormData({
              ...formData,
              characteristics: {
                ...formData.characteristics!,
                vocabulary: e.target.value
              }
            })}
            placeholder="e.g., technical, poetic, simple"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Pacing
          </label>
          <input
            type="text"
            value={formData.characteristics?.pacing || ''}
            onChange={(e) => setFormData({
              ...formData,
              characteristics: {
                ...formData.characteristics!,
                pacing: e.target.value
              }
            })}
            placeholder="e.g., fast-paced, methodical, contemplative"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Perspective
          </label>
          <input
            type="text"
            value={formData.characteristics?.perspective || ''}
            onChange={(e) => setFormData({
              ...formData,
              characteristics: {
                ...formData.characteristics!,
                perspective: e.target.value
              }
            })}
            placeholder="e.g., first-person, third-person omniscient"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Writing Guidelines
        </label>
        <textarea
          value={formData.guidelines || ''}
          onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
          placeholder="Detailed instructions on how to write in this style..."
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #000',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#008000' }}>
          ✅ Do This
        </label>
        {(formData.doThis || ['']).map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={item}
              onChange={(e) => updateDoThis(index, e.target.value)}
              placeholder="Add a guideline..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid #000',
                fontSize: '1rem'
              }}
            />
            {(formData.doThis || ['']).length > 1 && (
              <button
                onClick={() => removeDoThis(index)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF',
                  border: '2px solid #000',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDoThis}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#FFFFFF',
            border: '2px solid #000',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          + Add Item
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#FF0000' }}>
          ❌ Don't Do This
        </label>
        {(formData.dontDoThis || ['']).map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={item}
              onChange={(e) => updateDontDoThis(index, e.target.value)}
              placeholder="Add a restriction..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid #000',
                fontSize: '1rem'
              }}
            />
            {(formData.dontDoThis || ['']).length > 1 && (
              <button
                onClick={() => removeDontDoThis(index)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF',
                  border: '2px solid #000',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDontDoThis}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#FFFFFF',
            border: '2px solid #000',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          + Add Item
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Sample Text (Optional)
        </label>
        <textarea
          value={formData.sampleText || ''}
          onChange={(e) => setFormData({ ...formData, sampleText: e.target.value })}
          placeholder="Paste a sample of writing in this style for reference..."
          rows={8}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #000',
            fontSize: '1rem',
            fontFamily: 'monospace'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#FFFFFF',
            border: '2px solid #000',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#0000FF',
            color: '#FFFFFF',
            border: '2px solid #000',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            cursor: 'pointer'
          }}
        >
          {existingProfile ? '💾 Update Profile' : '💾 Save Profile'}
        </button>
      </div>
    </div>
  )
}

// Style Profile Viewer Component
function StyleProfileViewer({ 
  profile, 
  onClose,
  onEdit
}: { 
  profile: StyleProfile
  onClose: () => void
  onEdit: () => void
}) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTestScenario = async (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/styles/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profile,
          scenarioId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        alert(`Failed to generate test scene: ${error.details || error.error}`)
      }
    } catch (error) {
      console.error('Error generating test scene:', error)
      alert('Error generating test scene')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        border: '2px solid #000',
        boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {profile.name}
            </h2>
            {profile.authorReference && (
              <p style={{ fontSize: '1.1rem', color: '#0000FF', fontStyle: 'italic' }}>
                Inspired by: {profile.authorReference}
              </p>
            )}
            <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.5rem' }}>
              {profile.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onEdit}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '2px solid #000',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '2px solid #000',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <strong>Sentence Length:</strong> {profile.characteristics.sentenceLength}
          </div>
          <div>
            <strong>Tone:</strong> {profile.characteristics.tone}
          </div>
          <div>
            <strong>Vocabulary:</strong> {profile.characteristics.vocabulary}
          </div>
          <div>
            <strong>Pacing:</strong> {profile.characteristics.pacing}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <strong>Perspective:</strong> {profile.characteristics.perspective}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Writing Guidelines
          </h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {profile.guidelines}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#008000' }}>
              ✅ Do This
            </h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {profile.doThis.map((item, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#FF0000' }}>
              ❌ Don't Do This
            </h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {profile.dontDoThis.map((item, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        border: '2px solid #000',
        boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)'
      }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          🧪 Test This Style
        </h3>
        <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
          Generate sample scenes to see how this style performs
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {TEST_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleTestScenario(scenario.id)}
              disabled={isGenerating}
              style={{
                padding: '1.5rem',
                backgroundColor: selectedScenario === scenario.id ? '#0000FF' : '#FFFFFF',
                color: selectedScenario === scenario.id ? '#FFFFFF' : '#000000',
                border: '2px solid #000',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: isGenerating ? 0.6 : 1
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {scenario.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {scenario.name}
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: 'normal',
                color: selectedScenario === scenario.id ? '#FFFFFF' : '#666'
              }}>
                {scenario.description}
              </div>
            </button>
          ))}
        </div>

        {isGenerating && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#F5F5F5',
            border: '2px solid #000'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              Generating test scene...
            </p>
          </div>
        )}

        {generatedContent && !isGenerating && (
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '2rem',
            border: '2px solid #000',
            marginTop: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {TEST_SCENARIOS.find(s => s.id === selectedScenario)?.icon}{' '}
                {TEST_SCENARIOS.find(s => s.id === selectedScenario)?.name}
              </h4>
              <button
                onClick={() => {
                  setSelectedScenario(null)
                  setGeneratedContent('')
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
            <div style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8',
              fontSize: '1.05rem'
            }}>
              {generatedContent}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
