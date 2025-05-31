// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'john@company.com',
      name: 'John Admin',
      role: 'ADMIN',
    },
  });

  const engineerUser = await prisma.user.create({
    data: {
      email: 'sarah@company.com',
      name: 'Sarah Engineer',
      role: 'DEPARTMENT',
      department: 'ENGINEERING',
    },
  });

  const projectUser = await prisma.user.create({
    data: {
      email: 'mike@company.com',
      name: 'Mike Manager',
      role: 'PROJECT',
    },
  });

  // Create projects
  const websiteProject = await prisma.project.create({
    data: {
      projectName: 'Website Redesign',
      managerId: engineerUser.id,
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
          { name: 'Marketing Team' },
        ],
      },
      partners: {
        create: [{ name: 'Design Agency X' }, { name: 'Content Team' }],
      },
    },
  });

  const mobileProject = await prisma.project.create({
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
          { name: 'Design Team' },
        ],
      },
      partners: {
        create: [{ name: 'AWS' }, { name: 'Stripe' }],
      },
    },
  });

  console.log('✅ Seed data created successfully!');
  console.log(
    `Created ${adminUser.name}, ${engineerUser.name}, ${projectUser.name}`
  );
  console.log(
    `Created projects: ${websiteProject.projectName}, ${mobileProject.projectName}`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
