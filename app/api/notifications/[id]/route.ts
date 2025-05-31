// // app/api/notifications/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const { action, read } = body;

//     const updateData: any = {};

//     if (typeof read === 'boolean') {
//       updateData.read = read;
//     }

//     if (action === 'approve' || action === 'reject') {
//       updateData.actionTaken = action;
//       updateData.read = true;
//       updateData.actionRequired = false;
//     }

//     const updatedNotification = await prisma.notification.update({
//       where: { id: params.id },
//       data: updateData,
//     });

//     return NextResponse.json(updatedNotification);
//   } catch (error) {
//     console.error('Failed to update notification:', error);
//     return NextResponse.json(
//       { error: 'Failed to update notification' },
//       { status: 500 }
//     );
//   }
// }
