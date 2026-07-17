"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export async function createStaff(formData: FormData) {
  const schoolIdNumber = String(formData.get("schoolIdNumber") || "").trim();
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const preferredName = String(formData.get("preferredName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const roomNumber = String(formData.get("roomNumber") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const jobTitle = String(formData.get("jobTitle") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!schoolIdNumber) throw new Error("Staff ID number is required.");
  if (!firstName) throw new Error("First name is required.");
  if (!lastName) throw new Error("Last name is required.");

  await prisma.person.create({
    data: {
      schoolIdNumber,
      personType: "STAFF",
      firstName,
      lastName,
      preferredName: preferredName || null,
      email: email || null,
      phone: phone || null,
      roomNumber: roomNumber || null,
      department: department || null,
      jobTitle: jobTitle || null,
      status: "ACTIVE",
      notes: notes || null,
    },
  });

  redirect("/staff");
}