@echo off
echo Creating API folder structure...

REM Create the folder structure
mkdir "app\api\projects\[id]\generate" 2>nul

echo Folders created!
echo.
echo Now creating API files...

REM Create app/api/projects/route.ts
(
echo // app/api/projects/route.ts
echo import { NextResponse } from 'next/server'
echo.
echo // This is temporary mock data - will be replaced with real database queries
echo const MOCK_PROJECTS = [
echo   {
echo     id: '1',
echo     title: 'THE MYSTERY OF GENERATIVE AI',
echo     description: 'An exploration of artificial intelligence and machine learning',
echo     genre: 'Non-Fiction',
echo     targetPages: 150,
echo     status: 'DRAFT',
echo     createdAt: new Date^(^).toISOString^(^)
echo   },
echo   {
echo     id: '2',
echo     title: 'The Dragon\'s Quest',
echo     description: 'An epic fantasy adventure through magical realms',
echo     genre: 'Fantasy',
echo     targetPages: 300,
echo     status: 'DRAFT',
echo     createdAt: new Date^(^).toISOString^(^)
echo   }
echo ]
echo.
echo // GET /api/projects - Fetch all projects
echo export async function GET^(^) {
echo   try {
echo     return NextResponse.json^(MOCK_PROJECTS^)
echo   } catch ^(error^) {
echo     console.error^('Error fetching projects:', error^)
echo     return NextResponse.json^({ error: 'Failed to fetch projects' }, { status: 500 }^)
echo   }
echo }
echo.
echo // POST /api/projects - Create new project
echo export async function POST^(request: Request^) {
echo   try {
echo     const body = await request.json^(^)
echo     const { title, description, genre, targetPages } = body
echo.
echo     const newProject = {
echo       id: String^(MOCK_PROJECTS.length + 1^),
echo       title,
echo       description,
echo       genre,
echo       targetPages,
echo       status: 'DRAFT',
echo       createdAt: new Date^(^).toISOString^(^)
echo     }
echo.
echo     MOCK_PROJECTS.unshift^(newProject^)
echo     return NextResponse.json^(newProject^)
echo   } catch ^(error^) {
echo     console.error^('Error creating project:', error^)
echo     return NextResponse.json^({ error: 'Failed to create project' }, { status: 500 }^)
echo   }
echo }
) > "app\api\projects\route.ts"

echo Created: app\api\projects\route.ts

REM Create app/api/projects/[id]/route.ts
(
echo // app/api/projects/[id]/route.ts
echo import { NextResponse } from 'next/server'
echo.
echo const MOCK_PROJECTS: Record^<string, any^> = {
echo   '1': {
echo     id: '1',
echo     title: 'THE MYSTERY OF GENERATIVE AI',
echo     description: 'An exploration of artificial intelligence and machine learning',
echo     genre: 'Non-Fiction',
echo     targetPages: 150,
echo     status: 'DRAFT',
echo     createdAt: new Date^(^).toISOString^(^)
echo   },
echo   '2': {
echo     id: '2',
echo     title: 'The Dragon\'s Quest',
echo     description: 'An epic fantasy adventure through magical realms',
echo     genre: 'Fantasy',
echo     targetPages: 300,
echo     status: 'DRAFT',
echo     createdAt: new Date^(^).toISOString^(^)
echo   }
echo }
echo.
echo export async function GET^(
echo   request: Request,
echo   { params }: { params: { id: string } }
echo ^) {
echo   try {
echo     const { id } = params
echo     const project = MOCK_PROJECTS[id]
echo.
echo     if ^(!project^) {
echo       return NextResponse.json^({ error: 'Project not found' }, { status: 404 }^)
echo     }
echo.
echo     return NextResponse.json^(project^)
echo   } catch ^(error^) {
echo     console.error^('Error fetching project:', error^)
echo     return NextResponse.json^({ error: 'Failed to fetch project' }, { status: 500 }^)
echo   }
echo }
) > "app\api\projects\[id]\route.ts"

echo Created: app\api\projects\[id]\route.ts

REM Create app/api/projects/[id]/generate/route.ts
(
echo // app/api/projects/[id]/generate/route.ts
echo import { NextResponse } from 'next/server'
echo.
echo export async function POST^(
echo   request: Request,
echo   { params }: { params: { id: string } }
echo ^) {
echo   try {
echo     const { id } = params
echo     const body = await request.json^(^)
echo     const { templateId, config, projectTitle, projectDescription } = body
echo.
echo     console.log^('Generating content for project:', id^)
echo     console.log^('Template:', templateId^)
echo     console.log^('Config:', config^)
echo.
echo     const mockChapters = generateMockChapters^(templateId, config, projectTitle, projectDescription^)
echo     return NextResponse.json^({ chapters: mockChapters }^)
echo   } catch ^(error^) {
echo     console.error^('Error generating content:', error^)
echo     return NextResponse.json^({ error: 'Failed to generate content' }, { status: 500 }^)
echo   }
echo }
echo.
echo function generateMockChapters^(
echo   templateId: string,
echo   config: any,
echo   projectTitle: string,
echo   projectDescription: string
echo ^) {
echo   const chapters = []
echo   const numChapters = Math.ceil^(config.targetPages / 20^)
echo.
echo   for ^(let i = 1; i ^<= numChapters; i++^) {
echo     chapters.push^({
echo       chapterNumber: i,
echo       title: `Chapter ${i}`,
echo       content: `This is the content for chapter ${i} of "${projectTitle}".\n\nGenre: ${config.genre}\nTone: ${config.tone}\nAudience: ${config.audience}\n\n${projectDescription}\n\nThis will be replaced with AI-generated content soon.\n\nTemplate: ${templateId}\nAdditional Instructions: ${config.additionalInstructions ^|^| 'None'}\n\n[AI will generate rich, engaging content here based on your template and configuration.]`,
echo       status: 'completed'
echo     }^)
echo   }
echo.
echo   return chapters
echo }
) > "app\api\projects\[id]\generate\route.ts"

echo Created: app\api\projects\[id]\generate\route.ts
echo.
echo ========================================
echo All API files created successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your dev server (Ctrl+C then npm run dev)
echo 2. Refresh your browser
echo 3. Try generating content again
echo.
pause
