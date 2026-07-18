export const dynamic = "force-dynamic";

import Link from "next/link";

export default function ReportsPage() {
  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-600">
          Download inventory, assignment, student, and staff reports.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="Current Assignments"
          description="Devices currently issued to students or staff."
          href="/api/reports/current-assignments/xlsx"
        />

        <ReportCard
          title="All Devices"
          description="Full inventory list of all devices."
          href="/api/reports/all-devices/xlsx"
        />

        <ReportCard
          title="Available Devices"
          description="Devices ready to be issued."
          href="/api/reports/available-devices/xlsx"
        />

        <ReportCard
          title="Lost / Damaged Devices"
          description="Devices marked lost, damaged, stolen, or in repair."
          href="/api/reports/problem-devices/xlsx"
        />

        <ReportCard
          title="Students"
          description="Student records with ID numbers."
          href="/api/reports/students/xlsx"
        />

        <ReportCard
          title="Staff"
          description="Staff records with ID numbers."
          href="/api/reports/staff/xlsx"
        />
      </section>
    </main>
  );
}

function ReportCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <Link
        href={href}
        className="inline-block rounded-lg bg-black px-4 py-2 text-sm text-white"
      >
        Download XLSX
      </Link>
    </div>
  );
}