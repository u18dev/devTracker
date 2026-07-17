import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Asset tag or serial number is required." },
      { status: 400 }
    );
  }

  const device = await prisma.device.findFirst({
    where: {
      OR: [{ assetTag: query }, { serialNumber: query }],
    },
    include: {
      assignments: {
        where: {
          status: "ACTIVE",
        },
        include: {
          person: true,
        },
        orderBy: {
          checkoutDate: "desc",
        },
        take: 1,
      },
    },
  });

  if (!device) {
    return NextResponse.json(
      { error: "No device found with that tag or serial number." },
      { status: 404 }
    );
  }

  const activeAssignment = device.assignments[0];

  if (!activeAssignment) {
    return NextResponse.json(
      {
        error: `Device ${device.assetTag} was found, but it does not have an active assignment.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    assignment: {
      id: activeAssignment.id,
      checkoutDate: activeAssignment.checkoutDate,
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
      person: {
        id: activeAssignment.person.id,
        schoolIdNumber: activeAssignment.person.schoolIdNumber,
        personType: activeAssignment.person.personType,
        firstName: activeAssignment.person.firstName,
        lastName: activeAssignment.person.lastName,
        grade: activeAssignment.person.grade,
        roomNumber: activeAssignment.person.roomNumber,
        department: activeAssignment.person.department,
      },
    },
  });
}