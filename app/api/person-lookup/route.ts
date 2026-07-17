import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json(
      { error: "Student or staff ID is required." },
      { status: 400 }
    );
  }

  const person = await prisma.person.findUnique({
    where: {
      schoolIdNumber: id,
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
      { error: "No student or staff member found with that ID." },
      { status: 404 }
    );
  }

  return NextResponse.json({ person });
}