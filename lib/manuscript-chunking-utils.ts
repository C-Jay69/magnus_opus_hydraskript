/**
 * Manuscript Chunking Utility
 * Intelligently splits large manuscripts into manageable chunks for LLM analysis
 * while preserving context and narrative flow
 */

interface ManuscriptChunk {
  chunkId: number
  startIndex: number
  endIndex: number
  content: string
  characterCount: number
  approximateTokens: number
  chapterInfo?: {
    startChapter?: number
    endChapter?: number
    chapterBreaks: number
  }
}

interface ChunkingConfig {
  maxTokensPerChunk: number
  maxCharsPerChunk: number
  overlapChars: number
  preserveChapterBoundaries: boolean
}

/**
 * Rough token estimation: 1 token ≈ 4 characters
 * This is a conservative estimate for English text
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Find chapter boundaries in manuscript
 * Looks for common chapter markers like "CHAPTER X", "Chapter X", "Ch. X"
 */
function findChapterBoundaries(text: string): number[] {
  const boundaries: number[] = []
  const chapterRegex = /(?:^|\n)(CHAPTER\s+\d+|Chapter\s+\d+|Ch\.\s+\d+|SCENE\s+\d+|Scene\s+\d+)/gim
  
  let match
  while ((match = chapterRegex.exec(text)) !== null) {
    boundaries.push(match.index)
  }
  
  return boundaries
}

/**
 * Find paragraph boundaries for cleaner chunk breaks
 * Looks for double newlines (paragraph breaks)
 */
function findParagraphBoundaries(text: string, startIndex: number, endIndex: number): number[] {
  const boundaries: number[] = []
  const section = text.substring(startIndex, endIndex)
  const paragraphRegex = /\n\n+/g
  
  let match
  while ((match = paragraphRegex.exec(section)) !== null) {
    boundaries.push(startIndex + match.index)
  }
  
  return boundaries
}

/**
 * Find the best break point near the target position
 * Prioritizes: chapter boundaries > paragraph boundaries > sentence boundaries
 */
function findBestBreakPoint(
  text: string,
  targetIndex: number,
  maxDeviation: number,
  chapterBoundaries: number[]
): number {
  const searchStart = Math.max(0, targetIndex - maxDeviation)
  const searchEnd = Math.min(text.length, targetIndex + maxDeviation)

  // Try to find chapter boundary first
  const nearbyChapters = chapterBoundaries.filter(
    (idx) => idx >= searchStart && idx <= searchEnd
  )
  if (nearbyChapters.length > 0) {
    return nearbyChapters[nearbyChapters.length - 1]
  }

  // Try to find paragraph boundary
  const paragraphBoundaries = findParagraphBoundaries(text, searchStart, searchEnd)
  if (paragraphBoundaries.length > 0) {
    return paragraphBoundaries[paragraphBoundaries.length - 1]
  }

  // Try to find sentence boundary
  const sentenceRegex = /[.!?]\s+/g
  let match
  let lastSentenceEnd = searchStart
  while ((match = sentenceRegex.exec(text.substring(searchStart, searchEnd))) !== null) {
    lastSentenceEnd = searchStart + match.index + match[0].length
    if (lastSentenceEnd >= targetIndex) break
  }

  if (lastSentenceEnd > searchStart) {
    return lastSentenceEnd
  }

  // Fallback to target index
  return Math.min(targetIndex, text.length)
}

/**
 * Split manuscript into intelligent chunks
 * Respects chapter/paragraph boundaries and manages token limits
 */
export function chunkManuscript(
  manuscript: string,
  config: Partial<ChunkingConfig> = {}
): ManuscriptChunk[] {
  const defaultConfig: ChunkingConfig = {
    maxTokensPerChunk: 8000,      // Safe for most free-tier models
    maxCharsPerChunk: 32000,      // ~8000 tokens
    overlapChars: 500,            // Overlap for context
    preserveChapterBoundaries: true,
  }

  const finalConfig = { ...defaultConfig, ...config }
  const chunks: ManuscriptChunk[] = []

  // Find chapter boundaries if configured
  const chapterBoundaries = finalConfig.preserveChapterBoundaries
    ? findChapterBoundaries(manuscript)
    : []

  let currentIndex = 0
  let chunkId = 0

  while (currentIndex < manuscript.length) {
    // Calculate target end index
    const targetEndIndex = currentIndex + finalConfig.maxCharsPerChunk

    // Find the best break point
    const breakPoint = findBestBreakPoint(
      manuscript,
      targetEndIndex,
      finalConfig.maxCharsPerChunk * 0.1, // 10% deviation allowed
      chapterBoundaries
    )

    // Extract chunk
    const endIndex = Math.min(breakPoint, manuscript.length)
    const chunkContent = manuscript.substring(currentIndex, endIndex)

    // Verify token count
    const approximateTokens = estimateTokens(chunkContent)

    if (approximateTokens > finalConfig.maxTokensPerChunk) {
      console.warn(
        `[Chunking] Chunk ${chunkId} exceeds token limit: ${approximateTokens} > ${finalConfig.maxTokensPerChunk}`
      )
    }

    // Find chapter info for this chunk
    const chapterInfo = {
      startChapter: chapterBoundaries.filter((idx) => idx <= currentIndex).length,
      endChapter: chapterBoundaries.filter((idx) => idx <= endIndex).length,
      chapterBreaks: chapterBoundaries.filter(
        (idx) => idx > currentIndex && idx < endIndex
      ).length,
    }

    chunks.push({
      chunkId,
      startIndex: currentIndex,
      endIndex,
      content: chunkContent,
      characterCount: chunkContent.length,
      approximateTokens,
      chapterInfo,
    })

    // Move to next chunk with overlap
    currentIndex = Math.max(currentIndex + 1, endIndex - finalConfig.overlapChars)
    chunkId++

    // Safety check to prevent infinite loops
    if (currentIndex === endIndex && endIndex < manuscript.length) {
      currentIndex = endIndex
    }
  }

  return chunks
}

/**
 * Create analysis prompts for each chunk
 * Includes context about which chunk this is and what to look for
 */
export function createChunkAnalysisPrompt(
  chunk: ManuscriptChunk,
  totalChunks: number,
  editingMode: string
): string {
  const chunkInfo = `
[CHUNK ${chunk.chunkId + 1} of ${totalChunks}]
Character range: ${chunk.startIndex} - ${chunk.endIndex}
${chunk.chapterInfo ? `Chapters covered: ${chunk.chapterInfo.startChapter} - ${chunk.chapterInfo.endChapter}` : ''}
${chunk.chunkId > 0 ? 'NOTE: This chunk includes overlap from previous chunk for context continuity.' : ''}
${chunk.chunkId < totalChunks - 1 ? 'NOTE: This chunk includes overlap with next chunk for context continuity.' : ''}
`

  const modeSpecificInstructions = {
    continuity: `
For CONTINUITY analysis on this chunk:
1. Identify any timeline inconsistencies within this section
2. Check for character detail contradictions (appearance, abilities, background)
3. Look for plot logic problems or gaps
4. Note any forgotten plot threads
5. Flag any world-building contradictions

IMPORTANT: Since this is chunk ${chunk.chunkId + 1} of ${totalChunks}, focus on:
- Internal consistency within this chunk
- Consistency with information mentioned in this chunk
- Do NOT assume information from other chunks unless explicitly referenced

Format your response as a structured list of issues found.
`,
    proofread: `
For PROOFREADING on this chunk:
1. Grammar errors
2. Spelling mistakes
3. Punctuation issues
4. Sentence structure problems
5. Typos and formatting inconsistencies

Focus on this specific section and provide line-by-line corrections where applicable.
`,
    style: `
For STYLE analysis on this chunk:
1. Sentence flow and rhythm
2. Word choice and vocabulary
3. Clarity and readability
4. Tone consistency
5. Repetitive phrases or clichés

Provide specific examples from this chunk with suggestions for improvement.
`,
    character: `
For CHARACTER CONSISTENCY on this chunk:
1. Character voice consistency
2. Character behavior and motivation
3. Dialogue authenticity
4. Character development
5. Character relationships

Focus on how characters are portrayed in this section.
`,
    chapter: `
For CHAPTER STRUCTURE on this chunk:
1. Pacing (too fast, too slow, uneven)
2. Scene transitions
3. Chapter hooks and endings
4. Story momentum
5. Plot progression

Analyze the structure of this specific section.
`,
    creative: `
For CREATIVE ENHANCEMENT on this chunk:
1. Alternative phrasings for key passages
2. Creative suggestions for scene development
3. Ideas for enhancing imagery and description
4. Possibilities for deeper emotional resonance
5. Fresh angles on existing scenes

Provide specific, actionable suggestions for this section.
`,
  }

  const instructions = modeSpecificInstructions[editingMode as keyof typeof modeSpecificInstructions] || ''

  return `${chunkInfo}

${instructions}

MANUSCRIPT CHUNK:
${chunk.content}`
}

/**
 * Aggregate results from multiple chunk analyses
 * Combines findings into a cohesive report
 */
export function aggregateChunkResults(
  chunkResults: Array<{ chunkId: number; analysis: string }>,
  editingMode: string
): string {
  if (chunkResults.length === 0) {
    return 'No analysis results available.'
  }

  if (chunkResults.length === 1) {
    return chunkResults[0].analysis
  }

  const aggregationPrompt = `
You are combining analysis results from ${chunkResults.length} chunks of a large manuscript.

CHUNK ANALYSES:
${chunkResults
  .map(
    (result) => `
--- CHUNK ${result.chunkId + 1} ANALYSIS ---
${result.analysis}
`
  )
  .join('\n')}

Your task: Create a comprehensive, unified report that:
1. Consolidates findings across all chunks
2. Identifies patterns and recurring issues
3. Highlights cross-chunk inconsistencies (especially important for continuity analysis)
4. Prioritizes the most critical issues
5. Provides actionable recommendations

For ${editingMode} analysis, focus on:
${
  editingMode === 'continuity'
    ? `
- Timeline inconsistencies across the entire manuscript
- Character detail contradictions that span multiple chunks
- Plot logic problems that emerge across sections
- Forgotten plot threads
- World-building contradictions
- Provide a comprehensive continuity report that treats the manuscript as a whole
`
    : `
- Overall patterns and trends across all chunks
- Recurring issues that appear in multiple sections
- How issues compound or resolve across the manuscript
- General recommendations for improvement
`
}

Format your response as a professional, comprehensive report.`

  return aggregationPrompt
}

/**
 * Estimate total tokens in manuscript
 */
export function estimateManuscriptTokens(manuscript: string): number {
  return estimateTokens(manuscript)
}

/**
 * Get chunking statistics
 */
export function getChunkingStats(chunks: ManuscriptChunk[]) {
  const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.approximateTokens, 0)
  const avgTokensPerChunk = Math.round(totalTokens / chunks.length)
  const maxTokensInChunk = Math.max(...chunks.map((c) => c.approximateTokens))
  const minTokensInChunk = Math.min(...chunks.map((c) => c.approximateTokens))

  return {
    totalChunks: chunks.length,
    totalTokens,
    avgTokensPerChunk,
    maxTokensInChunk,
    minTokensInChunk,
    estimatedCost: '$0.00 (FREE!)',
  }
}
