export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function StaffPage() {
  const staff = await prisma.person.findMany({
    where: {
      personType: "STAFF",
    },
    orderBy: [
      { lastName: "asc" },
      { firstName: "asc" },
    ],
  });

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-gray-600">
            Track staff members who can be assigned school devices.
          </p>
        </div>

        <Link
          href="/staff/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Staff
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Staff ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Room</th>
              <th className="p-3">Department</th>
              <th className="p-3">Job Title</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={7}>
                  No staff added yet.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="border-t">
                  <td className="p-3 font-medium">{member.schoolIdNumber}</td>
                  <td className="p-3">
                    {member.lastName}, {member.firstName}
                  </td>
                  <td className="p-3">{member.email || "-"}</td>
                  <td className="p-3">{member.roomNumber || "-"}</td>
                  <td className="p-3">{member.department || "-"}</td>
                  <td className="p-3">{member.jobTitle || "-"}</td>
                  <td className="p-3">{member.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}