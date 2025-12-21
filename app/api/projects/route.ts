// app/api/projects/route.ts
import { NextResponse } from 'next/server'

// This is temporary mock data - will be replaced with real database queries
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'THE MYSTERY OF GENERATIVE AI',
    description: 'An exploration of artificial intelligence and machine learning',
    genre: 'Non-Fiction',
    targetPages: 150,
    status: 'DRAFT',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'The Dragon\'s Quest',
    description: 'An epic fantasy adventure through magical realms',
    genre: 'Fantasy',
    targetPages: 300,
    status: 'DRAFT',
    createdAt: new Date().toISOString()
  }
]

// GET /api/projects - Fetch all projects
export async function GET() {
  try {
    return NextResponse.json({ projects: MOCK_PROJECTS })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, genre, targetPages } = body

    const newProject = {
      id: String(MOCK_PROJECTS.length + 1),
      title,
      description,
      genre,
      targetPages,
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    }

    MOCK_PROJECTS.unshift(newProject)
    return NextResponse.json({ project: newProject })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
