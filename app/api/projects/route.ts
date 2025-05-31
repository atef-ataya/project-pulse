// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        stakeholders: true,
        partners: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform the data to match the frontend interface
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      projectName: project.projectName,
      projectManager: project.projectManager.name,
      department: project.department.toLowerCase(),
      stakeholders: project.stakeholders.map((s) => s.name),
      startDate: project.startDate.toISOString(),
      endDate: project.endDate.toISOString(),
      priority: project.priority.toLowerCase(),
      partners: project.partners.map((p) => p.name),
      percentComplete: project.percentComplete,
      status: project.status.toLowerCase().replace('_', '-'),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // First, get or create a user for the project manager
    let user = await prisma.user.findFirst({
      where: { name: body.projectManager },
    });

    if (!user) {
      // Create a new user if doesn't exist
      user = await prisma.user.create({
        data: {
          name: body.projectManager,
          email: `${body.projectManager
            .toLowerCase()
            .replace(/\s+/g, '.')}@projectpulse.com`,
          role: 'PROJECT',
        },
      });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        projectName: body.projectName,
        managerId: user.id,
        department: body.department.toUpperCase(),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        priority: body.priority.toUpperCase(),
        percentComplete: body.percentComplete || 0,
        status: body.status?.toUpperCase().replace('-', '_') || 'UPCOMING',
        stakeholders: {
          create:
            body.stakeholders
              ?.split(',')
              .map((name: string) => name.trim())
              .filter(Boolean)
              .map((name: string) => ({ name })) || [],
        },
        partners: {
          create:
            body.partners
              ?.split(',')
              .map((name: string) => name.trim())
              .filter(Boolean)
              .map((name: string) => ({ name })) || [],
        },
      },
      include: {
        projectManager: true,
        stakeholders: true,
        partners: true,
      },
    });

    // Transform the response to match frontend format
    const transformedProject = {
      id: project.id,
      projectName: project.projectName,
      projectManager: project.projectManager.name,
      department: project.department.toLowerCase(),
      stakeholders: project.stakeholders.map((s) => s.name),
      startDate: project.startDate.toISOString(),
      endDate: project.endDate.toISOString(),
      priority: project.priority.toLowerCase(),
      partners: project.partners.map((p) => p.name),
      percentComplete: project.percentComplete,
      status: project.status.toLowerCase().replace('_', '-'),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
