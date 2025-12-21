// lib/export-utils.ts
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

export interface Chapter {
  chapterNumber: number
  title: string
  content: string
}

export interface BookMetadata {
  title: string
  author?: string
  description?: string
}

// Export as plain text
export function exportAsTxt(chapters: Chapter[], metadata: BookMetadata): void {
  const fullText = `${metadata.title}\n${metadata.author ? `By ${metadata.author}\n` : ''}\n${'='.repeat(50)}\n\n${
    chapters
      .map(ch => `CHAPTER ${ch.chapterNumber}: ${ch.title}\n\n${ch.content}`)
      .join('\n\n---\n\n')
  }`
  
  downloadFile(fullText, `${metadata.title}.txt`, 'text/plain')
}

// Export as PDF
export async function exportAsPdf(chapters: Chapter[], metadata: BookMetadata): Promise<void> {
  const pdf = new jsPDF()
  const Width = pdf.internal.pageSize.getWidth()
  const Height = pdf.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = Width - (margin * 2)
  let yPosition = margin

  // Title 
  pdf.setFontSize(24)
  pdf.text(metadata.title, Width / 2, yPosition, { align: 'center' })
  yPosition += 15

  if (metadata.author) {
    pdf.setFontSize(14)
    pdf.text(`By ${metadata.author}`, Width / 2, yPosition, { align: 'center' })
    yPosition += 10
  }

  // Add chapters
  for (const chapter of chapters) {
    pdf.addPage()
    yPosition = margin

    // Chapter title
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    const chapterTitle = `Chapter ${chapter.chapterNumber}: ${chapter.title}`
    pdf.text(chapterTitle, margin, yPosition)
    yPosition += 15

    // Chapter content
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    
    const lines = pdf.splitTextToSize(chapter.content, maxWidth)
    
    for (const line of lines) {
      if (yPosition > Height - margin) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(line, margin, yPosition)
      yPosition += 7
    }
  }

  pdf.save(`${metadata.title}.pdf`)
}

// Export as DOCX
export async function exportAsDocx(chapters: Chapter[], metadata: BookMetadata): Promise<void> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title 
        new Paragraph({
          text: metadata.title,
          heading: HeadingLevel.TITLE,
          spacing: { after: 200 }
        }),
        ...(metadata.author ? [
          new Paragraph({
            text: `By ${metadata.author}`,
            spacing: { after: 400 }
          })
        ] : []),
        
        // Chapters
        ...chapters.flatMap(chapter => [
          new Paragraph({
            text: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          ...chapter.content.split('\n\n').map(paragraph => 
            new Paragraph({
              children: [new TextRun(paragraph)],
              spacing: { after: 200 }
            })
          )
        ])
      ]
    }]
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${metadata.title}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Export as EPUB - Simplified version using HTML
export async function exportAsEpub(chapters: Chapter[], metadata: BookMetadata): Promise<void> {
  // For now, we'll create a simple HTML version that can be converted to EPUB
  // This avoids the Node.js fs module issue
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${metadata.title}</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; margin-bottom: 50px; }
    h2 { margin-top: 50px; -break-before: always; }
    p { margin: 1em 0; text-indent: 2em; }
  </style>
</head>
<body>
  <h1>${metadata.title}</h1>
  ${metadata.author ? `<p style="text-align: center;"><em>By ${metadata.author}</em></p>` : ''}
  
  ${chapters.map(chapter => `
    <h2>Chapter ${chapter.chapterNumber}: ${chapter.title}</h2>
    ${chapter.content.split('\n\n').map(p => `<p>${p}</p>`).join('\n')}
  `).join('\n')}
</body>
</html>
  `

  // Download as HTML (can be converted to EPUB using external tools)
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${metadata.title}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  alert('Downloaded as HTML. You can convert this to EPUB using online tools like https://convertio.co/html-epub/' )
}

// Helper function to download text files
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
