import ExcelJS from "exceljs";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const devices = await prisma.device.findMany({
    orderBy: {
      assetTag: "asc",
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("All Devices");

  worksheet.columns = [
    { header: "Asset Tag", key: "assetTag", width: 20 },
    { header: "Serial Number", key: "serialNumber", width: 25 },
    { header: "Device Type", key: "deviceType", width: 18 },
    { header: "Brand", key: "brand", width: 15 },
    { header: "Model", key: "model", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Condition", key: "condition", width: 15 },
    { header: "Location", key: "location", width: 20 },
    { header: "Room", key: "room", width: 12 },
    { header: "Cart", key: "cart", width: 15 },
    { header: "Charger", key: "charger", width: 12 },
    { header: "Notes", key: "notes", width: 35 },
  ];

  devices.forEach((device) => {
    worksheet.addRow({
      assetTag: device.assetTag,
      serialNumber: device.serialNumber || "",
      deviceType: device.deviceType,
      brand: device.brand || "",
      model: device.model || "",
      status: device.status,
      condition: device.deviceCondition,
      location: device.location || "",
      room: device.roomNumber || "",
      cart: device.cartName || "",
      charger: device.hasCharger ? "Yes" : "No",
      notes: device.notes || "",
    });
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="all-devices.xlsx"',
    },
  });
}