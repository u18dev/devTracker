"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export type ReturnDeviceState = {
  error?: string;
};

export async function returnDevice(
  previousState: ReturnDeviceState,
  formData: FormData
): Promise<ReturnDeviceState> {
  const assignmentId = Number(formData.get("assignmentId"));
  const returnNotes = String(formData.get("returnNotes") || "").trim();

  if (!assignmentId) {
    return { error: "Search and select an active assignment first." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          device: true,
          person: true,
        },
      });

      if (!assignment) {
        throw new Error("Assignment not found.");
      }

      if (assignment.status !== "ACTIVE") {
        throw new Error("This assignment is already closed.");
      }

      await tx.assignment.update({
        where: { id: assignment.id },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
          returnCondition: assignment.device.deviceCondition,
          returnNotes: returnNotes || null,
          chargerReturned: true,
        },
      });

      await tx.device.update({
        where: { id: assignment.deviceId },
        data: {
          status: "AVAILABLE",
        },
      });

      await tx.deviceEvent.create({
        data: {
          deviceId: assignment.deviceId,
          personId: assignment.personId,
          eventType: "RETURNED",
          eventNote: `Device ${assignment.device.assetTag} returned from ${assignment.person.firstName} ${assignment.person.lastName}.`,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong while returning the device." };
  }

  redirect("/return-device/success");
}