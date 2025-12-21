'use client'

import { useState } from 'react'
import Link from 'next/link'

type EditingMode = 'proofread' | 'style' | 'character' | 'chapter' | 'creative' | 'continuity'

interface UploadedFile {
  name: string
  content: string
  type: string
  size: number
}

export default function EditorialAssistantPage() {
  const [manuscriptFile, setManuscriptFile] = useState<UploadedFile | null>(null)
  const [supportingFiles, setSupportingFiles] = useState<UploadedFile[]>([])
  const [selectedMode, setSelectedMode] = useState<EditingMode | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  
  // Generate Book feature states
  const [showGenerateSection, setShowGenerateSection] = useState(false)
  const [bookTitle, setBookTitle] = useState('')
  const [bookDescription, setBookDescription] = useState('')
  const [targetLength, setTargetLength] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const editingModes = [
    { id: 'proofread' as EditingMode, icon: '📖', name: 'Proofreading', description: 'Grammar, spelling, punctuation fixes', color: '#FF6B6B' },
    { id: 'style' as EditingMode, icon: '✨', name: 'Style Enhancement', description: 'Improve flow, clarity, word choice', color: '#4ECDC4' },
    { id: 'character' as EditingMode, icon: '🎭', name: 'Character Consistency', description: 'Check character voice and behavior', color: '#FFE66D' },
    { id: 'chapter' as EditingMode, icon: '📊', name: 'Chapter Feedback', description: 'Structure, pacing, plot analysis', color: '#95E1D3' },
    { id: 'creative' as EditingMode, icon: '💡', name: 'Creative Suggestions', description: 'Alternative phrasings, scene ideas', color: '#F38181' },
    { id: 'continuity' as EditingMode, icon: '🔍', name: 'Continuity Check', description: 'Spot inconsistencies in your story', color: '#AA96DA' }
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isManuscript: boolean) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const content = event.target?.result as string
      const uploadedFile: UploadedFile = {
        name: file.name,
        content: content,
        type: file.type,
        size: file.size
      }

      if (isManuscript) {
        setManuscriptFile(uploadedFile)
        setFeedback('')
      } else {
        setSupportingFiles(prev => [...prev, uploadedFile])
      }
    }

    reader.readAsText(file)
    e.target.value = '' // Reset input to allow re-uploading same file
  }

  const handleAnalyze = async () => {
    if (!manuscriptFile || !selectedMode) {
      alert('Please upload a manuscript and select an editing mode')
      return
    }

    setIsAnalyzing(true)
    setFeedback('')

    try {
      const response = await fetch('/api/editorial/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manuscript: manuscriptFile.content,
          mode: selectedMode,
          supportingFiles: supportingFiles.map(f => ({ name: f.name, content: f.content })),
          additionalInstructions
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
      } else {
        const error = await response.json()
        alert(`Failed to analyze: ${error.error}`)
      }
    } catch (error) {
      console.error('Error analyzing manuscript:', error)
      alert('Error analyzing manuscript')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateBook = async () => {
    if (!bookTitle.trim()) {
      alert('Please enter a book title')
      return
    }

    if (supportingFiles.length === 0) {
      alert('Please upload at least one supporting file (outline, character bible, style guide, etc.)')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/editorial/generate-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookTitle,
          description: bookDescription,
          targetLength,
          supportingFiles: supportingFiles.map(f => ({ name: f.name, content: f.content })),
          manuscriptDraft: manuscriptFile?.content || ''
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
      } else {
        const error = await response.json()
        alert(`Failed to generate book: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating book:', error)
      alert('Error generating book')
    } finally {
      setIsGenerating(false)
    }
  }

  const removeSupportingFile = (index: number) => {
    setSupportingFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#DCDFD5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '2px solid #000', padding: '1rem 2rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0000FF', cursor: 'pointer' }}>Magnus Opus Hydraskript</h1>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard"><span style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', display: 'inline-block', cursor: 'pointer' }}>📚 Dashboard</span></Link>
          <Link href="/styles"><span style={{ padding: '0.5rem 1.5rem', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', display: 'inline-block', cursor: 'pointer' }}>🎨 Styles</span></Link>
        </div>
      </nav>

      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', backgroundColor: '#FFFFFF', padding: '3rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>📝 Editorial Assistant</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>Upload your manuscript at any stage and get AI-powered editing assistance</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => { setShowGenerateSection(false); setGeneratedContent('') }} style={{ padding: '0.75rem 1.5rem', backgroundColor: !showGenerateSection ? '#0000FF' : '#FFFFFF', color: !showGenerateSection ? '#FFFFFF' : '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: !showGenerateSection ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '2px 2px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer' }}>📖 Edit Manuscript</button>
              <button onClick={() => { setShowGenerateSection(true); setFeedback('') }} style={{ padding: '0.75rem 1.5rem', backgroundColor: showGenerateSection ? '#FF00FF' : '#FFFFFF', color: showGenerateSection ? '#FFFFFF' : '#000000', border: '2px solid #000', fontWeight: '600', boxShadow: showGenerateSection ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '2px 2px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer' }}>✨ Generate Book</button>
            </div>
          </div>

          {!showGenerateSection ? (
            <>
              {/* EDITING MODE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Upload Section */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📤 Upload Files</h2>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Main Manuscript *</label>
                    <input type="file" accept=".txt,.md,.doc,.docx" onChange={(e) => handleFileUpload(e, true)} style={{ display: 'none' }} id="manuscript-upload" />
                    <label htmlFor="manuscript-upload" style={{ display: 'block', padding: '2rem', border: '2px dashed #000', textAlign: 'center', cursor: 'pointer', backgroundColor: manuscriptFile ? '#E8F5E9' : '#F5F5F5' }}>
                      {manuscriptFile ? (<div><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div><div style={{ fontWeight: '600' }}>{manuscriptFile.name}</div><div style={{ fontSize: '0.85rem', color: '#666' }}>{(manuscriptFile.size / 1024).toFixed(2)} KB</div></div>) : (<div><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div><div>Click to upload manuscript</div><div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>.txt, .md, .doc, .docx</div></div>)}
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Supporting Files (Optional)</label>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Character sheets, outlines, world-building notes, etc.</p>
                    <input type="file" accept=".txt,.md,.doc,.docx" onChange={(e) => handleFileUpload(e, false)} style={{ display: 'none' }} id="supporting-upload" />
                    <label htmlFor="supporting-upload" style={{ display: 'block', padding: '1.5rem', border: '2px dashed #000', textAlign: 'center', cursor: 'pointer', backgroundColor: '#F5F5F5', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📎</div><div>Add supporting file</div>
                    </label>
                    {supportingFiles.length > 0 && (<div style={{ marginTop: '1rem' }}>{supportingFiles.map((file, index) => (<div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '2px solid #000', marginBottom: '0.5rem', backgroundColor: '#FFF9C4' }}><div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{file.name}</div><div style={{ fontSize: '0.75rem', color: '#666' }}>{(file.size / 1024).toFixed(2)} KB</div></div><button onClick={() => removeSupportingFile(index)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#FF0000', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', cursor: 'pointer' }}>✕</button></div>))}</div>)}
                  </div>
                </div>

                {/* Editing Mode Selection */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>🎯 Select Editing Mode</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {editingModes.map((mode) => (<button key={mode.id} onClick={() => setSelectedMode(mode.id)} style={{ padding: '1.5rem', backgroundColor: selectedMode === mode.id ? mode.color : '#FFFFFF', border: '2px solid #000', fontWeight: '600', boxShadow: selectedMode === mode.id ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '2px 2px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{mode.icon}</div><div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{mode.name}</div><div style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>{mode.description}</div></button>))}
                  </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Additional Instructions (Optional)</label>
                <textarea value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)} placeholder="Any specific areas you'd like me to focus on?" rows={4} style={{ width: '100%', padding: '1rem', border: '2px solid #000', fontSize: '1rem', fontFamily: 'inherit', marginBottom: '1rem' }} />
                <button onClick={handleAnalyze} disabled={!manuscriptFile || !selectedMode || isAnalyzing} style={{ padding: '1rem 2rem', backgroundColor: !manuscriptFile || !selectedMode || isAnalyzing ? '#CCCCCC' : '#0000FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', fontSize: '1.1rem', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', cursor: !manuscriptFile || !selectedMode || isAnalyzing ? 'not-allowed' : 'pointer', width: '100%' }}>
                  {isAnalyzing ? '✨ Analyzing Your Manuscript...' : '🚀 Analyze Manuscript'}
                </button>
              </div>

              {/* Feedback Display */}
              {(isAnalyzing || feedback) && (<div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}><h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📋 Editorial Feedback</h2>{isAnalyzing ? (<div style={{ textAlign: 'center', padding: '3rem' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div><p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Your AI editor is reading your manuscript...</p></div>) : (<div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem', fontFamily: 'Georgia, serif' }}>{feedback}</div>)}</div>)}
            </>
          ) : (
            <>
              {/* GENERATE BOOK MODE */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>✨ Generate Book from Context Files</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Upload your outlines, character bibles, style guides, and plot notes. The AI will use them to generate your book!</p>
                
                {/* Upload Area for Generate Mode */}
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F5F5F5', border: '2px dashed #000' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>📎 Context Files ({supportingFiles.length})</h3>
                  <input type="file" accept=".txt,.md,.doc,.docx" onChange={(e) => handleFileUpload(e, false)} style={{ display: 'none' }} id="context-upload" />
                  <label htmlFor="context-upload" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#0000FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', cursor: 'pointer', marginBottom: '1rem' }}>+ Add Context File</label>
                  {supportingFiles.length > 0 && (<div style={{ marginTop: '1rem' }}>{supportingFiles.map((file, index) => (<div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '2px solid #000', marginBottom: '0.5rem', backgroundColor: '#FFFFFF' }}><div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{file.name}</div><div style={{ fontSize: '0.75rem', color: '#666' }}>{(file.size / 1024).toFixed(2)} KB</div></div><button onClick={() => removeSupportingFile(index)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#FF0000', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', cursor: 'pointer' }}>✕</button></div>))}</div>)}
                </div>

                <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Book Title *</label><input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Enter your book title" style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', fontSize: '1rem' }} /></div>
                <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Book Description</label><textarea value={bookDescription} onChange={(e) => setBookDescription(e.target.value)} placeholder="Brief description or additional context..." rows={3} style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', fontSize: '1rem', fontFamily: 'inherit' }} /></div>
                <div style={{ marginBottom: '2rem' }}><label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Target Length</label><select value={targetLength} onChange={(e) => setTargetLength(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', fontSize: '1rem' }}><option value="short">Short (5-10 chapters)</option><option value="medium">Medium (10-20 chapters)</option><option value="long">Long (20-30 chapters)</option><option value="epic">Epic (30+ chapters)</option></select></div>
                <button onClick={handleGenerateBook} disabled={isGenerating || !bookTitle.trim() || supportingFiles.length === 0} style={{ padding: '1rem 2rem', backgroundColor: isGenerating || !bookTitle.trim() || supportingFiles.length === 0 ? '#CCCCCC' : '#FF00FF', color: '#FFFFFF', border: '2px solid #000', fontWeight: '600', fontSize: '1.1rem', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', cursor: isGenerating || !bookTitle.trim() || supportingFiles.length === 0 ? 'not-allowed' : 'pointer', width: '100%' }}>
                  {isGenerating ? '✨ Generating Your Book...' : '🚀 Generate Book'}
                </button>
              </div>

              {/* Generated Content Display */}
              {(isGenerating || generatedContent) && (<div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}><h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📖 Generated Book</h2>{isGenerating ? (<div style={{ textAlign: 'center', padding: '3rem' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div><p style={{ fontSize: '1.2rem', fontWeight: '600' }}>AI is crafting your book using your context files...</p><p style={{ color: '#666', marginTop: '0.5rem' }}>This may take several minutes</p></div>) : (<div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem', fontFamily: 'Georgia, serif' }}>{generatedContent}</div>)}</div>)}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
