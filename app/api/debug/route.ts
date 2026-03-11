import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const users = await prisma.user.findMany();
    const requests = await prisma.visitRequest.findMany();
    const schools = await prisma.school.findMany();

    return NextResponse.json({ users, requests, schools });
}
