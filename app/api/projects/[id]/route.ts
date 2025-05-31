// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Transform the data to match the frontend interface
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
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        projectName: body.projectName,
        department: body.department?.toUpperCase(),
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        priority: body.priority?.toUpperCase(),
        percentComplete: body.percentComplete,
        status: body.status?.toUpperCase().replace('-', '_'),
        updatedAt: new Date(),
      },
      include: {
        projectManager: true,
        stakeholders: true,
        partners: true,
      },
    });

    // Transform the data to match the frontend interface
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
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
