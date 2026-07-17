import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

type StudentImportRow = {
  "Student Name"?: string;
  "Student ID"?: string | number;
  StuEmail?: string;
  Grade?: string | number;
};

function cleanValue(value: unknown) {
  return String(value || "").trim();
}

function splitStudentName(fullName: string) {
  const cleaned = fullName.trim();

  if (!cleaned) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  if (cleaned.includes(",")) {
    const [lastNameRaw, ...firstNameParts] = cleaned.split(",");
    return {
      firstName: firstNameParts.join(",").trim(),
      lastName: lastNameRaw.trim(),
    };
  }

  const parts = cleaned.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "Unknown",
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No XLSX file was uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, {
      type: "array",
    });

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return NextResponse.json(
        { error: "The uploaded spreadsheet has no sheets." },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json<StudentImportRow>(sheet, {
      defval: "",
    });

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2;

      const fullName = cleanValue(row["Student Name"]);
      const schoolIdNumber = cleanValue(row["Student ID"]);
      const email = cleanValue(row.StuEmail);
      const grade = cleanValue(row.Grade);

      if (!fullName && !schoolIdNumber) {
        skipped++;
        continue;
      }

      if (!schoolIdNumber) {
        skipped++;
        errors.push(`Row ${rowNumber}: Missing Student ID.`);
        continue;
      }

      if (!fullName) {
        skipped++;
        errors.push(`Row ${rowNumber}: Missing Student Name.`);
        continue;
      }

      const { firstName, lastName } = splitStudentName(fullName);

      if (!firstName || !lastName) {
        skipped++;
        errors.push(`Row ${rowNumber}: Could not split student name.`);
        continue;
      }

      await prisma.person.upsert({
        where: {
          schoolIdNumber,
        },
        update: {
          personType: "STUDENT",
          firstName,
          lastName,
          email: email || null,
          grade: grade || null,
          status: "ACTIVE",
        },
        create: {
          schoolIdNumber,
          personType: "STUDENT",
          firstName,
          lastName,
          email: email || null,
          grade: grade || null,
          status: "ACTIVE",
        },
      });

      imported++;
    }

    return NextResponse.json({
      success: true,
      totalRows: rows.length,
      imported,
      skipped,
      errors,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while importing students." },
      { status: 500 }
    );
  }
}