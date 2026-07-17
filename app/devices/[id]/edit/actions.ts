"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";

export async function updateDevice(deviceId: number, formData: FormData) {
  const assetTag = String(formData.get("assetTag") || "").trim();
  const serialNumber = String(formData.get("serialNumber") || "").trim();
  const deviceType = String(formData.get("deviceType") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const deviceCondition = String(formData.get("deviceCondition") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const roomNumber = String(formData.get("roomNumber") || "").trim();
  const cartName = String(formData.get("cartName") || "").trim();
  const hasCharger = formData.get("hasCharger") === "on";
  const chargerTag = String(formData.get("chargerTag") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!assetTag) throw new Error("Asset tag is required.");
  if (!deviceType) throw new Error("Device type is required.");

  const oldDevice = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!oldDevice) {
    throw new Error("Device not found.");
  }

  await prisma.device.update({
    where: { id: deviceId },
    data: {
      assetTag,
      serialNumber: serialNumber || null,
      deviceType,
      brand: brand || null,
      model: model || null,
      status: status as any,
      deviceCondition: deviceCondition as any,
      location: location || null,
      roomNumber: roomNumber || null,
      cartName: cartName || null,
      hasCharger,
      chargerTag: chargerTag || null,
      notes: notes || null,
    },
  });

  await prisma.deviceEvent.create({
    data: {
      deviceId,
      eventType: "UPDATED",
      eventNote: `Device ${assetTag} was updated.`,
      oldValue: JSON.stringify({
        assetTag: oldDevice.assetTag,
        status: oldDevice.status,
        condition: oldDevice.deviceCondition,
      }),
      newValue: JSON.stringify({
        assetTag,
        status,
        condition: deviceCondition,
      }),
    },
  });

  redirect(`/devices/${deviceId}`);
}