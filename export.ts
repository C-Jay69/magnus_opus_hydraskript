import path from 'path'
import { PDFDocument, rgb } from 'pdf-lib'
import { create } from 'epub-gen'
import { Packer } from 'docx'
import { Document, Paragraph, TextRun, HeadingLevel, ImageRun, Table, TableRow, TableCell, WidthType } from 'docx'
import { exec } from 'child_process'
import { promisify } from 'util'
import imageClient from './images'
import queueService from './queue'
import { generateRandomId } from './utils'

const execAsync = promisify(exec)

// Configuration for export system
const config = {
  exportDir: path.join(process.cwd(), 'exports'),
  tempDir: path.join(process.cwd(), 'temp'),
  ffmpegPath: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
  maxAudioChunkSize: 250, // characters per TTS chunk
  audioBitrate: '192k',
  audioSampleRate: '44100',
  
  // Format-specific configurations
  formats: {
    pdf: {
      pageSize: { width: 612, height: 792 }, // US Letter
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      fontSize: 12,
      lineHeight: 1.5,
    },
    epub: {
      title: 'Magnum Opus Book',
      author: 'AI Author',
      publisher: 'Magnum Opus',
      coverImage: 'cover.jpg',
    },
    docx: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
      styles: { default: { heading1: { run: { size: 28, bold: true } } } },
    },
    audiobook: {
      voice: 'en-US-Neural2-F', // Default female voice
      speed: 1.0,
      volume: 1.0,
    },
    coloringBook: {
      pageSize: { width: 8.5 * 300, height: 11 * 300 }, // 8.5x11 inches at 300 DPI
      lineWidth: 2,
      complexity: 'medium', // low, medium, high
    },
  },
}

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(config.exportDir, { recursive: true })
    await fs.mkdir(config.tempDir, { recursive: true })
  } catch (error) {
    console.error('[EXPORT] Failed to create directories:', error)
    throw error
  }
}

// Export Service Class
class ExportService {
  constructor() {
    // Initialize directories
    ensureDirectories().catch(console.error)
  }

  // Generate a unique export filename
  private generateExportFilename(projectId: string, format: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `${projectId}-${timestamp}-export.${format}`
  }

  // Export to PDF format
  async exportToPDF(
    projectId: string,
    title: string,
    content: string,
    coverImageUrl?: string,
    isChildrenBook: boolean = false
  ): Promise<{ success: boolean, filePath?: string, error?: string }> {
    try {
      const filename = this.generateExportFilename(projectId, 'pdf')
      const filePath = path.join(config.exportDir, filename)

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()

      // Add cover page if available
      if (coverImageUrl) {
        try {
          const coverResponse = await fetch(coverImageUrl)
          const coverImageBytes = await coverResponse.arrayBuffer()
          const coverImage = await pdfDoc.embedPng(coverImageBytes)
          