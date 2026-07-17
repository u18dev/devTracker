import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const validConditions = [
  "NEW",
  "GOOD",
  "FAIR",
  "DAMAGED",
  "MISSING_PARTS",
  "UNUSABLE",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const assetTag = String(body.assetTag || "").trim();
    const serialNumber = String(body.serialNumber || "").trim();
    const deviceType = String(body.deviceType || "").trim();
    const brand = String(body.brand || "").trim();
    const model = String(body.model || "").trim();
    const deviceCondition = String(body.deviceCondition || "GOOD").trim();
    const location = String(body.location || "").trim();
    const roomNumber = String(body.roomNumber || "").trim();
    const cartName = String(body.cartName || "").trim();
    const hasCharger = Boolean(body.hasCharger);
    const notes = String(body.notes || "").trim();

    if (!assetTag) {
      return NextResponse.json(
        { error: "Asset tag / barcode is required." },
        { status: 400 }
      );
    }

    if (!deviceType) {
      return NextResponse.json(
        { error: "Device type is required." },
        { status: 400 }
      );
    }

    if (!validConditions.includes(deviceCondition)) {
      return NextResponse.json(
        { error: "Invalid device condition." },
        { status: 400 }
      );
    }

    const existingAssetTag = await prisma.device.findUnique({
      where: {
        assetTag,
      },
    });

    if (existingAssetTag) {
      return NextResponse.json(
        { error: `Asset tag ${assetTag} already exists.` },
        { status: 409 }
      );
    }

    if (serialNumber) {
      const existingSerial = await prisma.device.findUnique({
        where: {
          serialNumber,
        },
      });

      if (existingSerial) {
        return NextResponse.json(
          { error: `Serial number ${serialNumber} already exists.` },
          { status: 409 }
        );
      }
    }

    const device = await prisma.device.create({
      data: {
        assetTag,
        serialNumber: serialNumber || null,
        deviceType,
        brand: brand || null,
        model: model || null,
        deviceCondition: deviceCondition as any,
        status: "AVAILABLE",
        location: location || null,
        roomNumber: roomNumber || null,
        cartName: cartName || null,
        hasCharger,
        notes: notes || null,
      },
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId: device.id,
        eventType: "CREATED",
        eventNote: `Device ${device.assetTag} was added through Scan Many Items.`,
      },
    });

    return NextResponse.json({
      success: true,
      device: {
        id: device.id,
        assetTag: device.assetTag,
        serialNumber: device.serialNumber,
        deviceType: device.deviceType,
        brand: device.brand,
        model: device.model,
        status: device.status,
        deviceCondition: device.deviceCondition,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while adding the device." },
      { status: 500 }
    );
  }
}