import ExcelJS from "exceljs";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const assignments = await prisma.assignment.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      device: true,
      person: true,
    },
    orderBy: {
      checkoutDate: "desc",
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Current Assignments");

  worksheet.columns = [
    { header: "Issued To", key: "issuedTo", width: 25 },
    { header: "Person Type", key: "personType", width: 15 },
    { header: "ID Number", key: "idNumber", width: 18 },
    { header: "Grade", key: "grade", width: 10 },
    { header: "Room", key: "room", width: 12 },
    { header: "Asset Tag", key: "assetTag", width: 20 },
    { header: "Serial Number", key: "serialNumber", width: 25 },
    { header: "Device Type", key: "deviceType", width: 18 },
    { header: "Brand", key: "brand", width: 15 },
    { header: "Model", key: "model", width: 20 },
    { header: "Issued Date", key: "issuedDate", width: 18 },
    { header: "Notes", key: "notes", width: 35 },
  ];

  assignments.forEach((assignment) => {
    worksheet.addRow({
      issuedTo: `${assignment.person.lastName}, ${assignment.person.firstName}`,
      personType: assignment.person.personType,
      idNumber: assignment.person.schoolIdNumber,
      grade: assignment.person.grade || "",
      room: assignment.person.roomNumber || "",
      assetTag: assignment.device.assetTag,
      serialNumber: assignment.device.serialNumber || "",
      deviceType: assignment.device.deviceType,
      brand: assignment.device.brand || "",
      model: assignment.device.model || "",
      issuedDate: assignment.checkoutDate.toLocaleDateString(),
      notes: assignment.checkoutNotes || "",
    });
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="current-assignments.xlsx"',
    },
  });
}