const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const schools = await prisma.school.findMany({ select: { id: true, name: true, email: true, phone: true } });
    const requests = await prisma.visitRequest.findMany({ select: { id: true, schoolName: true, status: true } });
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true } });
    console.log("SCHOOLS:", JSON.stringify(schools, null, 2));
    console.log("USERS:", JSON.stringify(users, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
