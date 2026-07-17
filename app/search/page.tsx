import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";

  const devices = q
    ? await prisma.device.findMany({
        where: {
          OR: [
            { assetTag: { contains: q } },
            { serialNumber: { contains: q } },
            { deviceType: { contains: q } },
            { brand: { contains: q } },
            { model: { contains: q } },
          ],
        },
        take: 25,
      })
    : [];

  const people = q
    ? await prisma.person.findMany({
        where: {
          OR: [
            { schoolIdNumber: { contains: q } },
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 25,
      })
    : [];

  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-gray-600">
          Search devices, students, staff, asset tags, serial numbers, and IDs.
        </p>
      </div>

      <form className="flex max-w-2xl gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search asset tag, serial, student ID, staff ID, name..."
          className="flex-1 rounded-lg border px-3 py-2"
        />

        <button className="rounded-lg bg-black px-4 py-2 text-white">
          Search
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Devices</h2>

        <div className="rounded-xl border bg-white">
          {devices.length === 0 ? (
            <p className="p-4 text-gray-500">No device results.</p>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="border-t first:border-t-0 p-4">
                <Link
                  href={`/devices/${device.id}`}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  {device.assetTag}
                </Link>
                <p className="text-sm text-gray-600">
                  {device.deviceType} • {device.brand || "-"}{" "}
                  {device.model || ""} • Serial: {device.serialNumber || "-"} •{" "}
                  Status: {device.status}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Students / Staff</h2>

        <div className="rounded-xl border bg-white">
          {people.length === 0 ? (
            <p className="p-4 text-gray-500">No student or staff results.</p>
          ) : (
            people.map((person) => (
              <div key={person.id} className="border-t first:border-t-0 p-4">
                <p className="font-semibold">
                  {person.lastName}, {person.firstName}
                </p>
                <p className="text-sm text-gray-600">
                  {person.personType} • ID: {person.schoolIdNumber}{" "}
                  {person.grade ? `• Grade ${person.grade}` : ""}
                  {person.roomNumber ? ` • Room ${person.roomNumber}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}