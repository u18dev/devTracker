"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export type IssueDeviceState = {
  error?: string;
};

export async function issueDeviceByLookup(
  previousState: IssueDeviceState,
  formData: FormData
): Promise<IssueDeviceState> {
  const personId = Number(formData.get("personId"));
  const tagOrSerial = String(formData.get("tagOrSerial") || "").trim();
  const checkoutNotes = String(formData.get("checkoutNotes") || "").trim();

  if (!personId) {
    return { error: "Search and select a student or staff member first." };
  }

  if (!tagOrSerial) {
    return { error: "Enter or scan an asset tag / serial number." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const person = await tx.person.findUnique({
        where: { id: personId },
      });

      if (!person) {
        throw new Error("Student or staff member not found.");
      }

      const device = await tx.device.findFirst({
        where: {
          OR: [{ assetTag: tagOrSerial }, { serialNumber: tagOrSerial }],
        },
      });

      if (!device) {
        throw new Error("No device found with that asset tag or serial number.");
      }

      if (device.status !== "AVAILABLE") {
        throw new Error(
          `Device ${device.assetTag} was found, but it is currently ${device.status}.`
        );
      }

      const activeAssignment = await tx.assignment.findFirst({
        where: {
          deviceId: device.id,
          status: "ACTIVE",
        },
      });

      if (activeAssignment) {
        throw new Error("This device already has an active assignment.");
      }

      const assignment = await tx.assignment.create({
        data: {
          personId,
          deviceId: device.id,
          checkoutCondition: device.deviceCondition || "GOOD",
          chargerIssued: true,
          checkoutNotes: checkoutNotes || null,
          status: "ACTIVE",
        },
      });

      await tx.device.update({
        where: { id: device.id },
        data: {
          status: "ASSIGNED",
        },
      });

      await tx.deviceEvent.create({
        data: {
          deviceId: device.id,
          personId,
          eventType: "ASSIGNED",
          eventNote: `Device ${device.assetTag} issued to ${person.firstName} ${person.lastName}. Assignment ID: ${assignment.id}`,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Something went wrong while issuing the device." };
  }

  redirect("/issue-device/success");
}