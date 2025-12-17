// lib/templates.ts
export interface BookTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  features: {
    aiGeneration: boolean
    imageGeneration: boolean
    audioGeneration: boolean
  }
  defaultConfig: {
    targetPages: number
    genre: string
    tone: string
    audience: string
  }
  structureContext: string
  pageRange: {
    min: number
    max: number
  }
}

export const BOOK_TEMPLATES: BookTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Slate',
    description: 'Start from scratch with complete creative freedom',
    icon: '📝',
    color: '#FFFFFF',
    features: {
      aiGeneration: true,
      imageGeneration: false,
      audioGeneration: false
    },
    defaultConfig: {
      targetPages: 100,
      genre: 'Fiction',
      tone: 'Professional',
      audience: 'General'
    },
    structureContext: 'Create a well-structured book with clear chapters and sections.',
    pageRange: { min: 10, max: 500 }
  },
  {
    id: 'authority',
    name: 'Authority Book',
    description: 'Non-fiction book to establish expertise in your field',
    icon: '👔',
    color: '#0000FF',
    features: {
      aiGeneration: true,
      imageGeneration: false,
      audioGeneration: false
    },
    defaultConfig: {
      targetPages: 150,
      genre: 'Non-Fiction',
      tone: 'Professional',
      audience: 'Business Professionals'
    },
    structureContext: 'Create an authority-building book with: Introduction establishing credibility, 5-7 core chapters with actionable insights, case studies and examples, conclusion with call-to-action.',
    pageRange: { min: 80, max: 300 }
  },
  {
    id: 'fantasy',
    name: 'Fantasy Novel',
    description: 'Epic fantasy story with world-building and adventure',
    icon: '🐉',
    color: '#FF00FF',
    features: {
      aiGeneration: true,
      imageGeneration: false,
      audioGeneration: false
    },
    defaultConfig: {
      targetPages: 250,
      genre: 'Fantasy',
      tone: 'Epic',
      audience: 'Young Adult & Adult'
    },
    structureContext: 'Create an epic fantasy novel with: World-building introduction, character development arcs, rising action with challenges, climactic confrontation, resolution and epilogue.',
    pageRange: { min: 150, max: 600 }
  },
  {
    id: 'kids',
    name: 'Children\'s Book',
    description: 'Illustrated story for kids with AI-generated images',
    icon: '🎨',
    color: '#BEF754',
    features: {
      aiGeneration: true,
      imageGeneration: true,
      audioGeneration: false
    },
    defaultConfig: {
      targetPages: 24,
      genre: 'Children\'s Fiction',
      tone: 'Playful',
      audience: 'Ages 4-8'
    },
    structureContext: 'Create a children\'s book with: Simple, engaging narrative, 1-2 sentences per page, clear moral or lesson, colorful descriptions for illustrations, happy ending.',
    pageRange: { min: 12, max: 48 }
  },
  {
    id: 'audiobook',
    name: 'Audio Drama',
    description: 'Story optimized for audio with voice narration',
    icon: '🎙️',
    color: '#00FFFF',
    features: {
      aiGeneration: true,
      imageGeneration: false,
      audioGeneration: true
    },
    defaultConfig: {
      targetPages: 50,
      genre: 'Audio Drama',
      tone: 'Dramatic',
      audience: 'Audio Listeners'
    },
    structureContext: 'Create an audio-optimized story with: Strong dialogue and character voices, sound-rich descriptions, clear scene transitions, engaging pacing for listening, dramatic moments.',
    pageRange: { min: 20, max: 150 }
  },
  {
    id: 'coloring',
    name: 'Coloring Book',
    description: 'Generate line art illustrations perfect for coloring',
    icon: '🖍️',
    color: '#FFBF00',
    features: {
      aiGeneration: true,
      imageGeneration: true,
      audioGeneration: false
    },
    defaultConfig: {
      targetPages: 30,
      genre: 'Activity Book',
      tone: 'Fun',
      audience: 'All Ages'
    },
    structureContext: 'Create a coloring book with: Simple line art descriptions, clear outlines and shapes, varied complexity levels, themed illustrations, minimal text.',
    pageRange: { min: 15, max: 100 }
  }
]

export function getTemplateById(id: string): BookTemplate | undefined {
  return BOOK_TEMPLATES.find(t => t.id === id)
}

