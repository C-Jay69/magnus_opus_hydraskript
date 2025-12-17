// app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server'

const MOCK_PROJECTS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'THE MYSTERY OF GENERATIVE AI',
    description: 'An exploration of artificial intelligence and machine learning',
    genre: 'Non-Fiction',
    targetPages: 150,
    status: 'DRAFT',
    createdAt: new Date().toISOString()
  },
  '2': {
    id: '2',
    title: 'The Dragon\'s Quest',
    description: 'An epic fantasy adventure through magical realms',
    genre: 'Fantasy',
    targetPages: 300,
    status: 'DRAFT',
    createdAt: new Date().toISOString()
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const project = MOCK_PROJECTS[id]

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}
