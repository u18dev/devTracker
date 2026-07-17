"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export async function createStudent(formData: FormData) {
  const schoolIdNumber = String(formData.get("schoolIdNumber") || "").trim();
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const preferredName = String(formData.get("preferredName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const grade = String(formData.get("grade") || "").trim();
  const roomNumber = String(formData.get("roomNumber") || "").trim();
  const graduationYearRaw = String(formData.get("graduationYear") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!schoolIdNumber) throw new Error("Student ID number is required.");
  if (!firstName) throw new Error("First name is required.");
  if (!lastName) throw new Error("Last name is required.");

  await prisma.person.create({
    data: {
      schoolIdNumber,
      personType: "STUDENT",
      firstName,
      lastName,
      preferredName: preferredName || null,
      email: email || null,
      phone: phone || null,
      grade: grade || null,
      roomNumber: roomNumber || null,
      graduationYear: graduationYearRaw ? Number(graduationYearRaw) : null,
      status: "ACTIVE",
      notes: notes || null,
    },
  });

  redirect("/students");
}