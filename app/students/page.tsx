export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function StudentsPage() {
  const students = await prisma.person.findMany({
    where: {
      personType: "STUDENT",
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const activeStudents = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">People Records</div>
          <h1 className="page-title">Students</h1>
          <p className="page-description">
            Track student records, ID numbers, grade levels, rooms, and device
            eligibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/search" className="btn btn-outline">
            Search
          </Link>

          <Link href="/students/import" className="btn btn-outline">
            Import XLSX
          </Link>

          <Link href="/students/new" className="btn btn-primary">
            Add Student
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Total Students</p>
          <p className="stat-value">{students.length}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Active Students</p>
          <p className="stat-value">{activeStudents}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Inactive</p>
          <p className="stat-value">{students.length - activeStudents}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Device Eligible</p>
          <p className="stat-value">{activeStudents}</p>
        </div>
      </section>

      <section className="card card-pad space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow">Directory</div>
            <h2 className="text-xl font-black">Student List</h2>
            <p className="text-sm text-gray-500">
              Students who can be issued devices through the inventory system.
            </p>
          </div>

          <Link href="/reports" className="btn btn-outline">
            Export Reports
          </Link>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Room</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6}>No students added yet.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-black">{student.schoolIdNumber}</td>

                    <td>
                      <div className="font-bold">
                        {student.lastName}, {student.firstName}
                      </div>

                      {student.preferredName && (
                        <div className="text-xs text-gray-500">
                          Preferred: {student.preferredName}
                        </div>
                      )}
                    </td>

                    <td>{student.email || "-"}</td>
                    <td>{student.grade || "-"}</td>
                    <td>{student.roomNumber || "-"}</td>

                    <td>
                      <StatusPill status={student.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  let className = "badge badge-neutral";

  if (normalized === "active") {
    className = "badge badge-available";
  }

  if (normalized === "inactive") {
    className = "badge badge-neutral";
  }

  if (normalized === "suspended") {
    className = "badge badge-damaged";
  }

  return <span className={className}>{status.replaceAll("_", " ")}</span>;
}