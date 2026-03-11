const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRaw`DELETE FROM "User" WHERE role::text = 'AIMS_ADMIN'`;
    console.log('Deleted legacy AIMS_ADMIN users from Postgres.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
