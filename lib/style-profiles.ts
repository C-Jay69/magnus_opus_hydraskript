// lib/style-profiles.ts

export interface StyleProfile {
  id: string
  name: string
  description: string
  authorReference?: string // e.g., "Tom Clancy", "Stephen King"
  
  characteristics: {
    sentenceLength: 'very-short' | 'short' | 'medium' | 'long' | 'varied'
    vocabulary: string // e.g., "technical, military jargon"
    pacing: string // e.g., "fast-paced", "methodical"
    perspective: string // e.g., "first-person", "third-person omniscient"
    tone: string // e.g., "dark", "humorous", "authoritative"
  }
  
  guidelines: string // Detailed writing instructions
  
  doThis: string[] // List of do's
  dontDoThis: string[] // List of don'ts
  
  sampleText?: string // Optional sample text for reference
  
  createdAt: string
  updatedAt: string
}

export interface TestScenario {
  id: string
  name: string
  icon: string
  description: string
  prompt: string
}

export const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'romantic',
    name: 'Romantic Scene',
    icon: '❤️',
    description: 'Two characters share an intimate, emotional moment',
    prompt: 'Write a romantic scene between two characters who have been dancing around their feelings. They finally have a moment alone. Show the tension, vulnerability, and connection between them. Include dialogue and internal thoughts.'
  },
  {
    id: 'action',
    name: 'Action Scene',
    icon: '⚡',
    description: 'High-stakes action sequence with tension and danger',
    prompt: 'Write an intense action scene where the protagonist is in immediate danger. They must fight, flee, or outsmart their opponent. Show the physical sensations, split-second decisions, and rising stakes. Make it visceral and fast-paced.'
  },
  {
    id: 'reveal',
    name: 'Reveal Scene',
    icon: '🎭',
    description: 'A shocking truth is revealed that changes everything',
    prompt: 'Write a scene where a major secret is revealed - a betrayal, a hidden identity, or a truth that shatters assumptions. Show the moment of realization and its immediate emotional impact. Build to the reveal, then show the aftermath.'
  },
  {
    id: 'emotional',
    name: 'Emotional Scene',
    icon: '😢',
    description: 'A deeply moving moment that brings tears',
    prompt: 'Write an emotionally devastating scene - a loss, a sacrifice, a goodbye, or a moment of profound realization. Make the reader feel the weight of the moment. Show vulnerability, grief, or bittersweet beauty. This should hit hard.'
  }
]

// Default/example profiles
export const DEFAULT_PROFILES: StyleProfile[] = [
  {
    id: 'default',
    name: 'Default Style',
    description: 'Balanced, professional writing suitable for most genres',
    characteristics: {
      sentenceLength: 'varied',
      vocabulary: 'clear and accessible',
      pacing: 'balanced',
      perspective: 'third-person limited',
      tone: 'professional and engaging'
    },
    guidelines: 'Write in a clear, engaging style. Vary sentence length. Show don\'t tell. Use vivid descriptions and natural dialogue.',
    doThis: [
      'Use active voice',
      'Show emotions through actions',
      'Vary sentence structure',
      'Use sensory details'
    ],
    dontDoThis: [
      'Avoid purple prose',
      'Don\'t over-explain',
      'Avoid clichés',
      'Don\'t tell what you can show'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'techno-thriller',
    name: 'Techno-Thriller (Clancy-Style)',
    description: 'Military precision, technical detail, geopolitical intrigue',
    authorReference: 'Tom Clancy',
    characteristics: {
      sentenceLength: 'medium',
      vocabulary: 'technical, military terminology',
      pacing: 'methodical with action bursts',
      perspective: 'third-person omniscient',
      tone: 'authoritative, detailed, realistic'
    },
    guidelines: `Write with military precision and technical accuracy. Use proper terminology for weapons, tactics, and technology. Build tension through strategic thinking and geopolitical stakes. Characters are professionals who speak in clipped, efficient dialogue. Action scenes are tactical and strategic, not just explosive. Include multiple perspectives across different locations.`,
    doThis: [
      'Use military acronyms and technical specifications',
      'Show strategic thinking and planning',
      'Ground action in realistic tactics',
      'Include geopolitical context',
      'Use professional, efficient dialogue'
    ],
    dontDoThis: [
      'Avoid flowery or poetic language',
      'Don\'t skip technical details',
      'Avoid first-person introspection',
      'Don\'t make action scenes unrealistic',
      'Avoid emotional melodrama'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'literary-horror',
    name: 'Literary Horror (King-Style)',
    description: 'Psychological depth, everyday horror, character-driven dread',
    authorReference: 'Stephen King',
    characteristics: {
      sentenceLength: 'varied',
      vocabulary: 'accessible with vivid imagery',
      pacing: 'slow-burn with explosive moments',
      perspective: 'third-person limited or first-person',
      tone: 'conversational yet unsettling'
    },
    guidelines: `Write horror that feels real and grounded in everyday life. Focus on character psychology and internal fears. Build dread slowly through atmosphere and small details. Use conversational, accessible language but don't shy away from visceral imagery. Make readers care about characters before terrible things happen to them.`,
    doThis: [
      'Ground horror in realistic settings',
      'Develop deep character psychology',
      'Build atmosphere through details',
      'Use conversational narrative voice',
      'Make violence feel consequential'
    ],
    dontDoThis: [
      'Avoid relying only on jump scares',
      'Don\'t make characters stupid',
      'Avoid purple prose',
      'Don\'t explain everything',
      'Avoid gratuitous gore without purpose'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Save custom profile to localStorage
export function saveCustomProfile(profile: StyleProfile): void {
  if (typeof window === 'undefined') return
  
  const customProfiles = getCustomProfiles()
  const existingIndex = customProfiles.findIndex(p => p.id === profile.id)
  
  if (existingIndex >= 0) {
    customProfiles[existingIndex] = profile
  } else {
    customProfiles.push(profile)
  }
  
  localStorage.setItem('customStyleProfiles', JSON.stringify(customProfiles))
}

// Get custom profiles from localStorage
export function getCustomProfiles(): StyleProfile[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('customStyleProfiles')
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Get all profiles (default + custom)
export function getAllStyleProfiles(): StyleProfile[] {
  return [...DEFAULT_PROFILES, ...getCustomProfiles()]
}

// Get profile by ID (check both default and custom)
export function getStyleProfileById(id: string): StyleProfile | undefined {
  return getAllStyleProfiles().find(p => p.id === id)
}
