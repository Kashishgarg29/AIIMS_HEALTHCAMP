"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEventDetails(eventId: string) {
    return await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            school: true,
            visitRequest: true,
            formTemplate: {
                include: {
                    sections: {
                        include: { fields: true },
                        orderBy: { order: 'asc' }
                    }
                }
            },
            eventUsers: {
                include: { user: true }
            },
            students: {
                include: {
                    record: {
                        include: {
                            responses: true
                        }
                    }
                },
                orderBy: { name: 'asc' }
            }
        }
    });
}

export async function addStudentToEvent(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    if (session.user?.role === "HOSPITAL_ADMIN") return { error: "Admins are not allowed to add students." };

    const eventId = formData.get("eventId") as string;
    const name = formData.get("name") as string;
    const studentClass = formData.get("class") as string;
    const age = parseInt(formData.get("age") as string);
    const gender = formData.get("gender") as string;
    const optionalId = formData.get("optionalId") as string;

    const dateOfBirth = formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null;
    const bloodGroup = formData.get("bloodGroup") as string || null;
    const fatherName = formData.get("fatherName") as string || null;
    const motherName = formData.get("motherName") as string || null;
    const fatherOccupation = formData.get("fatherOccupation") as string || null;
    const motherOccupation = formData.get("motherOccupation") as string || null;
    const address = formData.get("address") as string || null;
    const pincode = formData.get("pincode") as string || null;
    const mobileNumber = formData.get("mobileNumber") as string || null;

    const pastHistory = formData.get("pastHistory") as string || null;
    const pastHistoryHandler = formData.get("pastHistoryHandler") as string || null;
    const pastHistoryHandlerContact = formData.get("pastHistoryHandlerContact") as string || null;

    const hasDentalImplant = formData.get("hasDentalImplant") === "on";
    const hasBraces = formData.get("hasBraces") === "on";
    const hasRightEyeSpectacle = formData.get("hasRightEyeSpectacle") === "on";
    const hasLeftEyeSpectacle = formData.get("hasLeftEyeSpectacle") === "on";

    const presentComplaints = formData.get("presentComplaints") as string || null;
    const currentMedication = formData.get("currentMedication") as string || null;

    // Vaccinations
    const vaccHepatitisB1 = formData.get("vaccHepatitisB1") === "on";
    const vaccHepatitisB2 = formData.get("vaccHepatitisB2") === "on";
    const vaccHepatitisB3 = formData.get("vaccHepatitisB3") === "on";
    const vaccTyphoid1 = formData.get("vaccTyphoid1") === "on";
    const vaccTyphoid5 = formData.get("vaccTyphoid5") === "on";
    const vaccTyphoid8 = formData.get("vaccTyphoid8") === "on";
    const vaccTyphoid11 = formData.get("vaccTyphoid11") === "on";
    const vaccTyphoid14 = formData.get("vaccTyphoid14") === "on";
    const vaccDTPolio = formData.get("vaccDTPolio") === "on";
    const vaccTetanus6 = formData.get("vaccTetanus6") === "on";
    const vaccTetanus11 = formData.get("vaccTetanus11") === "on";

    // Conditions
    const condScratchesHead = formData.get("condScratchesHead") === "on";
    const condRubsEyes = formData.get("condRubsEyes") === "on";
    const condFrequentHeadache = formData.get("condFrequentHeadache") === "on";
    const condCannotSeeBoard = formData.get("condCannotSeeBoard") === "on";
    const condPokesEars = formData.get("condPokesEars") === "on";
    const condTeethBlackOrRotten = formData.get("condTeethBlackOrRotten") === "on";
    const condBadBreath = formData.get("condBadBreath") === "on";
    const condCracksAtMouthCorners = formData.get("condCracksAtMouthCorners") === "on";
    const condBreathesThroughMouth = formData.get("condBreathesThroughMouth") === "on";
    const condBitesNails = formData.get("condBitesNails") === "on";
    const condWhitePatches = formData.get("condWhitePatches") === "on";
    const condLimpingGait = formData.get("condLimpingGait") === "on";
    const condBreathlessness = formData.get("condBreathlessness") === "on";
    const condFrequentUrination = formData.get("condFrequentUrination") === "on";
    const condDiarrhoea = formData.get("condDiarrhoea") === "on";
    const condVomiting = formData.get("condVomiting") === "on";
    const condStammers = formData.get("condStammers") === "on";
    const condBloodInStools = formData.get("condBloodInStools") === "on";
    const condFaintingEpisodes = formData.get("condFaintingEpisodes") === "on";
    const condAnyOtherProblem = formData.get("condAnyOtherProblem") as string || null;

    try {
        const student = await prisma.student.create({
            data: {
                eventId,
                name,
                class: studentClass,
                age,
                gender,
                optionalId: optionalId || null,
                dateOfBirth, bloodGroup, fatherName, motherName, fatherOccupation, motherOccupation, address, pincode, mobileNumber,
                pastHistory, pastHistoryHandler, pastHistoryHandlerContact,
                hasDentalImplant, hasBraces, hasRightEyeSpectacle, hasLeftEyeSpectacle,
                presentComplaints, currentMedication,
                vaccHepatitisB1, vaccHepatitisB2, vaccHepatitisB3, vaccTyphoid1, vaccTyphoid5, vaccTyphoid8, vaccTyphoid11, vaccTyphoid14, vaccDTPolio, vaccTetanus6, vaccTetanus11,
                condScratchesHead, condRubsEyes, condFrequentHeadache, condCannotSeeBoard, condPokesEars, condTeethBlackOrRotten, condBadBreath, condCracksAtMouthCorners, condBreathesThroughMouth, condBitesNails, condWhitePatches, condLimpingGait, condBreathlessness, condFrequentUrination, condDiarrhoea, condVomiting, condStammers, condBloodInStools, condFaintingEpisodes, condAnyOtherProblem,
                record: {
                    create: {
                        status: "PENDING"
                    }
                }
            }
        });

        revalidatePath(`/dashboard/event/${eventId}`);
        return { success: true, studentId: student.id };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: "A student with this Name and Class already exists in this event." };
        }
        console.error("Failed to add student:", error);
        return { error: "Failed to add student" };
    }
}

export async function completeEvent(eventId: string) {
    const session = await getSession();
    // Allow HOSPITAL_ADMIN and EVENT_USER to complete it 
    // Usually Doctors (EVENT_USER) or Admins click this.
    if (!session) return { error: "Unauthorized" };

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                status: "COMPLETED",
                isLocked: true
            }
        });

        // Revalidate everywhere events are shown
        revalidatePath(`/dashboard/event/${eventId}`);
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to complete event:", error);
        return { error: "Failed to mark event as completed." };
    }
}

export async function bulkAddStudents(eventId: string, studentsData: any[]) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    if (session.user?.role === "HOSPITAL_ADMIN") return { error: "Admins are not allowed to add students." };

    try {
        // Prepare the data array
        const dataToInsert = studentsData.map((std) => ({
            eventId,
            name: std.name || "Unknown",
            class: std.class || "Unknown",
            age: std.age ? parseInt(std.age, 10) : 0,
            gender: std.gender || "U",
            optionalId: std.optionalId || null,
        }));

        // Use Prisma transaction to create students and their pending records
        await prisma.$transaction(
            dataToInsert.map(data =>
                prisma.student.create({
                    data: {
                        ...data,
                        record: {
                            create: {
                                status: "PENDING"
                            }
                        }
                    }
                })
            )
        );

        revalidatePath(`/dashboard/event/${eventId}`);
        return { success: true, count: dataToInsert.length };
    } catch (error: any) {
        console.error("Failed to bulk add students:", error);
        return { error: "Failed to bulk add students. Please check your CSV format and try again." };
    }
}

export async function updateStudentPreRegistration(studentId: string, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    // Only SCHOOL_REP and EVENT_USER can edit pre-registration data
    if (session.user?.role === "HOSPITAL_ADMIN") return { error: "Admins are not allowed to edit registration data." };

    const name = formData.get("name") as string;
    const studentClass = formData.get("class") as string;
    const age = parseInt(formData.get("age") as string);
    const gender = formData.get("gender") as string;
    const optionalId = formData.get("optionalId") as string;
    const precaution = formData.get("precaution") as string;

    const dateOfBirth = formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null;
    const bloodGroup = formData.get("bloodGroup") as string || null;
    const fatherName = formData.get("fatherName") as string || null;
    const motherName = formData.get("motherName") as string || null;
    const fatherOccupation = formData.get("fatherOccupation") as string || null;
    const motherOccupation = formData.get("motherOccupation") as string || null;
    const address = formData.get("address") as string || null;
    const pincode = formData.get("pincode") as string || null;
    const mobileNumber = formData.get("mobileNumber") as string || null;

    const pastHistory = formData.get("pastHistory") as string || null;
    const pastHistoryHandler = formData.get("pastHistoryHandler") as string || null;
    const pastHistoryHandlerContact = formData.get("pastHistoryHandlerContact") as string || null;

    const hasDentalImplant = formData.get("hasDentalImplant") === "on";
    const hasBraces = formData.get("hasBraces") === "on";
    const hasRightEyeSpectacle = formData.get("hasRightEyeSpectacle") === "on";
    const hasLeftEyeSpectacle = formData.get("hasLeftEyeSpectacle") === "on";

    const presentComplaints = formData.get("presentComplaints") as string || null;
    const currentMedication = formData.get("currentMedication") as string || null;

    // Vaccinations
    const vaccHepatitisB1 = formData.get("vaccHepatitisB1") === "on";
    const vaccHepatitisB2 = formData.get("vaccHepatitisB2") === "on";
    const vaccHepatitisB3 = formData.get("vaccHepatitisB3") === "on";
    const vaccTyphoid1 = formData.get("vaccTyphoid1") === "on";
    const vaccTyphoid5 = formData.get("vaccTyphoid5") === "on";
    const vaccTyphoid8 = formData.get("vaccTyphoid8") === "on";
    const vaccTyphoid11 = formData.get("vaccTyphoid11") === "on";
    const vaccTyphoid14 = formData.get("vaccTyphoid14") === "on";
    const vaccDTPolio = formData.get("vaccDTPolio") === "on";
    const vaccTetanus6 = formData.get("vaccTetanus6") === "on";
    const vaccTetanus11 = formData.get("vaccTetanus11") === "on";

    // Conditions
    const condScratchesHead = formData.get("condScratchesHead") === "on";
    const condRubsEyes = formData.get("condRubsEyes") === "on";
    const condFrequentHeadache = formData.get("condFrequentHeadache") === "on";
    const condCannotSeeBoard = formData.get("condCannotSeeBoard") === "on";
    const condPokesEars = formData.get("condPokesEars") === "on";
    const condTeethBlackOrRotten = formData.get("condTeethBlackOrRotten") === "on";
    const condBadBreath = formData.get("condBadBreath") === "on";
    const condCracksAtMouthCorners = formData.get("condCracksAtMouthCorners") === "on";
    const condBreathesThroughMouth = formData.get("condBreathesThroughMouth") === "on";
    const condBitesNails = formData.get("condBitesNails") === "on";
    const condWhitePatches = formData.get("condWhitePatches") === "on";
    const condLimpingGait = formData.get("condLimpingGait") === "on";
    const condBreathlessness = formData.get("condBreathlessness") === "on";
    const condFrequentUrination = formData.get("condFrequentUrination") === "on";
    const condDiarrhoea = formData.get("condDiarrhoea") === "on";
    const condVomiting = formData.get("condVomiting") === "on";
    const condStammers = formData.get("condStammers") === "on";
    const condBloodInStools = formData.get("condBloodInStools") === "on";
    const condFaintingEpisodes = formData.get("condFaintingEpisodes") === "on";
    const condAnyOtherProblem = formData.get("condAnyOtherProblem") as string || null;

    try {
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                name,
                class: studentClass,
                age,
                gender,
                optionalId: optionalId || null,
                precaution: precaution || null,
                dateOfBirth, bloodGroup, fatherName, motherName, fatherOccupation, motherOccupation, address, pincode, mobileNumber,
                pastHistory, pastHistoryHandler, pastHistoryHandlerContact,
                hasDentalImplant, hasBraces, hasRightEyeSpectacle, hasLeftEyeSpectacle,
                presentComplaints, currentMedication,
                vaccHepatitisB1, vaccHepatitisB2, vaccHepatitisB3, vaccTyphoid1, vaccTyphoid5, vaccTyphoid8, vaccTyphoid11, vaccTyphoid14, vaccDTPolio, vaccTetanus6, vaccTetanus11,
                condScratchesHead, condRubsEyes, condFrequentHeadache, condCannotSeeBoard, condPokesEars, condTeethBlackOrRotten, condBadBreath, condCracksAtMouthCorners, condBreathesThroughMouth, condBitesNails, condWhitePatches, condLimpingGait, condBreathlessness, condFrequentUrination, condDiarrhoea, condVomiting, condStammers, condBloodInStools, condFaintingEpisodes, condAnyOtherProblem,
            }
        });

        revalidatePath(`/dashboard/event/${student.eventId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update student registration:", error);
        return { error: "Failed to update registration data." };
    }
}
