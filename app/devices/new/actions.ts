"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export async function createDevice(formData: FormData) {
  const assetTag = String(formData.get("assetTag") || "").trim();
  const serialNumber = String(formData.get("serialNumber") || "").trim();
  const selectedDeviceType = String(formData.get("deviceType") || "").trim();
  const customDeviceType = String(formData.get("customDeviceType") || "").trim();

  const selectedBrand = String(formData.get("brand") || "").trim();
  const customBrand = String(formData.get("customBrand") || "").trim();

  const deviceType =
    selectedDeviceType === "__custom__" ? customDeviceType : selectedDeviceType;

  const brand = selectedBrand === "__custom__" ? customBrand : selectedBrand;
  const model = String(formData.get("model") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const roomNumber = String(formData.get("roomNumber") || "").trim();
  const cartName = String(formData.get("cartName") || "").trim();
  const hasCharger = formData.get("hasCharger") === "on";
  const chargerTag = String(formData.get("chargerTag") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

    if (!deviceType) {
    throw new Error("Device type is required.");
  }

  if (!brand) {
    throw new Error("Brand is required.");
  }

  if (!assetTag) {
    throw new Error("Asset tag is required.");
  }

  if (!deviceType) {
    throw new Error("Device type is required.");
  }

  const device = await prisma.device.create({
    data: {
      assetTag,
      serialNumber: serialNumber || null,
      deviceType,
      brand: brand || null,
      model: model || null,
      location: location || null,
      roomNumber: roomNumber || null,
      cartName: cartName || null,
      hasCharger,
      chargerTag: chargerTag || null,
      notes: notes || null,
      status: "AVAILABLE",
      deviceCondition: "GOOD",
    },
  });

  await prisma.deviceEvent.create({
    data: {
      deviceId: device.id,
      eventType: "CREATED",
      eventNote: `Device ${assetTag} was added to inventory.`,
    },
  });

  redirect("/devices");
}