"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSchoolEvents() {
    const session = await getSession();
    if (!session || session.user.role !== "SCHOOL_REP") {
        return [];
    }

    // The JWT session only holds `id` and `role`. We must fetch the User context from the DB first.
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    console.log("[DEBUG] getSchoolEvents - Current User:", { id: session.user.id, phone: user?.phone, email: user?.email });

    if (!user) return [];

    // Identify the school(s) by matching the user's phone or email
    const orConditions: any[] = [];
    if (user.phone) orConditions.push({ phone: user.phone });
    if (user.email) orConditions.push({ email: user.email });

    const schools = await prisma.school.findMany({
        where: { OR: orConditions }
    });

    console.log("[DEBUG] getSchoolEvents - Schools Found:", schools.length);

    if (!schools || schools.length === 0) return [];

    const schoolIds = schools.map((s: any) => s.id);

    const events = await prisma.event.findMany({
        where: { schoolId: { in: schoolIds } },
        include: {
            formTemplate: true,
            _count: {
                select: { students: true }
            }
        },
        orderBy: { date: 'asc' }
    });

    console.log("[DEBUG] getSchoolEvents - Events Fetched:", events.length);
    return events;
}

export async function preRegisterStudent(eventId: string, formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== "SCHOOL_REP") {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const studentClass = formData.get("class") as string;
    const age = parseInt(formData.get("age") as string);
    const gender = formData.get("gender") as string;
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

    if (!name || !studentClass || isNaN(age) || !gender) {
        return { error: "Missing required fields: Name, Class, Age, Gender" };
    }

    try {
        await prisma.student.create({
            data: {
                eventId,
                name,
                class: studentClass,
                age,
                gender,
                precaution: precaution || null,
                dateOfBirth, bloodGroup, fatherName, motherName, fatherOccupation, motherOccupation, address, pincode, mobileNumber,
                pastHistory, pastHistoryHandler, pastHistoryHandlerContact,
                hasDentalImplant, hasBraces, hasRightEyeSpectacle, hasLeftEyeSpectacle,
                presentComplaints, currentMedication,
                vaccHepatitisB1, vaccHepatitisB2, vaccHepatitisB3, vaccTyphoid1, vaccTyphoid5, vaccTyphoid8, vaccTyphoid11, vaccTyphoid14, vaccDTPolio, vaccTetanus6, vaccTetanus11,
                condScratchesHead, condRubsEyes, condFrequentHeadache, condCannotSeeBoard, condPokesEars, condTeethBlackOrRotten, condBadBreath, condCracksAtMouthCorners, condBreathesThroughMouth, condBitesNails, condWhitePatches, condLimpingGait, condBreathlessness, condFrequentUrination, condDiarrhoea, condVomiting, condStammers, condBloodInStools, condFaintingEpisodes, condAnyOtherProblem,
                record: {
                    create: { status: "PENDING" }
                }
            }
        });

        revalidatePath("/dashboard/school");
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: "This student is already registered for this event." };
        }
        console.error("Failed to pre-register student:", error);
        return { error: "Failed to register student." };
    }
}
