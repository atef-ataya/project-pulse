const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@projectpulse.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', adminUser.name);

  const engineerUser = await prisma.user.create({
    data: {
      email: 'sarah@projectpulse.com',
      name: 'Sarah Engineer',
      role: 'DEPARTMENT',
      department: 'ENGINEERING',
    },
  });
  console.log('✅ Created engineer user:', engineerUser.name);

  // Create a few projects
  const project1 = await prisma.project.create({
    data: {
      projectName: 'Website Redesign',
      managerId: adminUser.id,
      department: 'MARKETING',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-30'),
      priority: 'HIGH',
      percentComplete: 75,
      status: 'IN_PROGRESS',
      stakeholders: {
        create: [
          { name: 'John Doe' },
          { name: 'Jane Smith' },
        ],
      },
      partners: {
        create: [
          { name: 'Design Agency X' },
        ],
      },
    },
  });
  console.log('✅ Created project:', project1.projectName);

  const project2 = await prisma.project.create({
    data: {
      projectName: 'Mobile App Development',
      managerId: engineerUser.id,
      department: 'ENGINEERING',
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-08-15'),
      priority: 'HIGH',
      percentComplete: 30,
      status: 'IN_PROGRESS',
      stakeholders: {
        create: [
          { name: 'Product Team' },
          { name: 'QA Team' },
        ],
      },
      partners: {
        create: [
          { name: 'AWS' },
          { name: 'Stripe' },
        ],
      },
    },
  });
  console.log('✅ Created project:', project2.projectName);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
