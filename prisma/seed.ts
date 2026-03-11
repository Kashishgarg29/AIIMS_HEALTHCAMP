import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // 1. Create Default Hospital Admin
    const hospitalAdminMain = await prisma.user.upsert({
        where: { email: 'admin@healthcamp.local' },
        update: { role: 'HOSPITAL_ADMIN' },
        create: {
            email: 'admin@healthcamp.local',
            phone: '9999999999',
            name: 'Hospital System Administrator',
            role: 'HOSPITAL_ADMIN',
        },
    })
    console.log('Created hospital admin main:', hospitalAdminMain.email)

    // 2. Create Standard Doctor
    const hospitalAdmin = await prisma.user.upsert({
        where: { email: 'staff@healthcamp.local' },
        update: {},
        create: {
            email: 'staff@healthcamp.local',
            name: 'Event Doctor Jane',
            role: 'EVENT_USER',
            phone: '9876543212',
        },
    })

    // 3. Create a Demo School
    let demoSchool = await prisma.school.findFirst({
        where: { email: 'school@healthcamp.local' }
    });

    if (!demoSchool) {
        demoSchool = await prisma.school.create({
            data: {
                name: 'Demo International School',
                address: '123 Education Lane, NY',
                contactPerson: 'Principal Smith',
                email: 'school@healthcamp.local',
                phone: '1234567890'
            }
        });
    }

    // 3.5 Create School Representative User
    const schoolRep = await prisma.user.upsert({
        where: { email: 'school@healthcamp.local' },
        update: {},
        create: {
            email: 'school@healthcamp.local',
            phone: '1234567890',
            name: 'Demo School Rep',
            role: 'SCHOOL_REP',
        }
    });

    // 4. Create a Default Basic Health Template
    let template = await prisma.formTemplate.findUnique({
        where: { name: "Standard Medical Checkup v1" }
    });

    if (!template) {
        template = await prisma.formTemplate.create({
            data: {
                name: "Standard Medical Checkup v1",
                description: "Routine vitals, dental, and vision screening.",
                sections: {
                    create: [
                        {
                            name: "Vitals",
                            order: 0,
                            fields: {
                                create: [
                                    { name: 'height', label: 'Height (cm)', type: 'NUMBER', isRequired: true, order: 0 },
                                    { name: 'weight', label: 'Weight (kg)', type: 'NUMBER', isRequired: true, order: 1 },
                                    { name: 'bloodPressure', label: 'Blood Pressure', type: 'TEXT', isRequired: false, order: 2 },
                                ]
                            }
                        },
                        {
                            name: "Dental",
                            order: 1,
                            fields: {
                                create: [
                                    { name: 'cavities', label: 'Observed Cavities?', type: 'RADIO', options: JSON.stringify(["Yes", "No"]), isRequired: true, order: 0 },
                                    { name: 'dentalNotes', label: 'Dentist Remarks', type: 'TEXT', isRequired: false, order: 1 },
                                ]
                            }
                        }
                    ]
                }
            }
        });
    }

    // 5. Create a Live Active Event automatically
    const event = await prisma.event.create({
        data: {
            date: new Date(),
            schoolId: demoSchool.id,
            formTemplateId: template.id,
        }
    });

    // Assign staff to event
    await prisma.eventUser.create({
        data: { eventId: event.id, userId: hospitalAdmin.id }
    });

    console.log(`
  ✅ Database Seeded Successfully!
  
  Test Accounts (Use with OTP login: any 6 digit code in dev):
  - Hospital Admin: admin@healthcamp.local
  - Event Staff: staff@healthcamp.local
  - School Rep: school@healthcamp.local (or 1234567890)
  
  Active Demo Event Created for: ${demoSchool.name}
  `);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
