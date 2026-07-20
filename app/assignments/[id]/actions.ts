"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export type AssignmentActionState = {
  error?: string;
};

export async function updateAssignment(
  assignmentId: number,
  previousState: AssignmentActionState,
  formData: FormData
): Promise<AssignmentActionState> {
  const checkoutNotes = String(formData.get("checkoutNotes") || "").trim();
  const checkoutCondition = String(formData.get("checkoutCondition") || "").trim();
  const chargerIssued = formData.get("chargerIssued") === "on";
  const dueDateValue = String(formData.get("dueDate") || "").trim();

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { device: true, person: true },
    });

    if (!assignment) {
      return { error: "Assignment not found." };
    }

    await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        checkoutNotes: checkoutNotes || null,
        checkoutCondition: checkoutCondition || assignment.checkoutCondition,
        chargerIssued,
        dueDate: dueDateValue ? new Date(dueDateValue) : null,
      },
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId: assignment.deviceId,
        personId: assignment.personId,
        eventType: "UPDATED",
        eventNote: `Assignment #${assignmentId} was updated.`,
      },
    });
  } catch (error) {
    console.error("UPDATE ASSIGNMENT ERROR:", error);
    return { error: "Unable to update assignment." };
  }

  redirect(`/assignments/${assignmentId}`);
}

export async function returnAssignment(
  assignmentId: number,
  previousState: AssignmentActionState,
  formData: FormData
): Promise<AssignmentActionState> {
  const returnCondition = String(formData.get("returnCondition") || "").trim();
  const returnNotes = String(formData.get("returnNotes") || "").trim();
  const chargerReturned = formData.get("chargerReturned") === "on";

  if (!returnCondition) {
    return { error: "Return condition is required." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.findUnique({
        where: { id: assignmentId },
        include: { device: true, person: true },
      });

      if (!assignment) {
        throw new Error("Assignment not found.");
      }

      if (assignment.status !== "ACTIVE") {
        throw new Error("Only active assignments can be returned.");
      }

      const newDeviceStatus =
        returnCondition === "DAMAGED" || returnCondition === "UNUSABLE"
          ? "DAMAGED"
          : "AVAILABLE";

      await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
          returnCondition,
          returnNotes: returnNotes || null,
          chargerReturned,
        },
      });

      await tx.device.update({
        where: { id: assignment.deviceId },
        data: {
          status: newDeviceStatus,
          deviceCondition: returnCondition,
        },
      });

      await tx.deviceEvent.create({
        data: {
          deviceId: assignment.deviceId,
          personId: assignment.personId,
          eventType: "RETURNED",
          eventNote: `Device ${assignment.device.assetTag} returned by ${assignment.person.firstName} ${assignment.person.lastName}. Assignment ID: ${assignmentId}`,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unable to return assignment." };
  }

  redirect(`/assignments/${assignmentId}`);
}