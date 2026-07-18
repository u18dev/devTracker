import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Student or staff ID is required." },
        { status: 400 }
      );
    }

    const person = await prisma.person.findFirst({
      where: {
        OR: [
          { schoolIdNumber: id },
          { email: id },
          { firstName: { contains: id } },
          { lastName: { contains: id } },
        ],
      },
      select: {
        id: true,
        schoolIdNumber: true,
        personType: true,
        firstName: true,
        lastName: true,
        grade: true,
        roomNumber: true,
        department: true,
      },
    });

    if (!person) {
      return NextResponse.json(
        { error: "No student or staff member found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ person });
  } catch (error) {
    console.error("PERSON LOOKUP ERROR:", error);

    return NextResponse.json(
      { error: "Lookup failed on the server." },
      { status: 500 }
    );
  }
}