export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deviceId = Number(id);

  if (!deviceId) {
    notFound();
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      assignments: {
        include: {
          person: true,
        },
        orderBy: {
          checkoutDate: "desc",
        },
      },
      deviceEvents: {
        include: {
          person: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!device) {
    notFound();
  }

  const activeAssignment = device.assignments.find(
    (assignment) => assignment.status === "ACTIVE"
  );

  return (
    <main className="p-8 space-y-6">
      <div>
        <Link href="/devices" className="text-sm text-gray-600 hover:underline">
          ← Back to Devices
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{device.assetTag}</h1>
            <p className="text-gray-600">
              {device.deviceType} {device.brand ? `• ${device.brand}` : ""}{" "}
              {device.model ? `• ${device.model}` : ""}
            </p>
          </div>

          <Link
            href={`/devices/${device.id}/edit`}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Edit Device
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard label="Status" value={device.status} />
        <InfoCard label="Condition" value={device.deviceCondition} />
        <InfoCard label="Serial Number" value={device.serialNumber || "-"} />
        <InfoCard label="Location" value={device.location || "-"} />
        <InfoCard label="Room" value={device.roomNumber || "-"} />
        <InfoCard label="Cart" value={device.cartName || "-"} />
      </section>

      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="text-xl font-semibold">Current Assignment</h2>

        {activeAssignment ? (
          <div className="rounded-lg border bg-green-50 p-4">
            <p className="font-semibold">
              {activeAssignment.person.firstName} {activeAssignment.person.lastName}
            </p>

            <p className="text-sm text-gray-700">
              {activeAssignment.person.personType} • ID:{" "}
              {activeAssignment.person.schoolIdNumber}
              {activeAssignment.person.grade
                ? ` • Grade ${activeAssignment.person.grade}`
                : ""}
              {activeAssignment.person.roomNumber
                ? ` • Room ${activeAssignment.person.roomNumber}`
                : ""}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Issued:{" "}
              {new Date(activeAssignment.checkoutDate).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">This device is not currently assigned.</p>
        )}
      </section>

      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="text-xl font-semibold">Assignment History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Person</th>
                <th className="p-3">ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Issued</th>
                <th className="p-3">Returned</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>

            <tbody>
              {device.assignments.length === 0 ? (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>
                    No assignment history.
                  </td>
                </tr>
              ) : (
                device.assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-t">
                    <td className="p-3">
                      {assignment.person.lastName}, {assignment.person.firstName}
                    </td>
                    <td className="p-3">{assignment.person.schoolIdNumber}</td>
                    <td className="p-3">{assignment.status}</td>
                    <td className="p-3">
                      {new Date(assignment.checkoutDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {assignment.returnDate
                        ? new Date(assignment.returnDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {assignment.checkoutNotes || assignment.returnNotes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="text-xl font-semibold">Device Events</h2>

        <div className="space-y-3">
          {device.deviceEvents.length === 0 ? (
            <p className="text-gray-500">No device events yet.</p>
          ) : (
            device.deviceEvents.map((event) => (
              <div key={event.id} className="rounded-lg border p-3">
                <p className="font-medium">{event.eventType}</p>
                <p className="text-sm text-gray-600">
                  {event.eventNote || "No note"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {event.createdAt
                    ? new Date(event.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}