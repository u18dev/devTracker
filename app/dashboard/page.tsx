import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function DashboardPage() {
  const totalDevices = await prisma.device.count();
  const assignedDevices = await prisma.device.count({
    where: { status: "ASSIGNED" },
  });
  const availableDevices = await prisma.device.count({
    where: { status: "AVAILABLE" },
  });
  const damagedDevices = await prisma.device.count({
    where: { status: "DAMAGED" },
  });
  const lostDevices = await prisma.device.count({
    where: { status: "LOST" },
  });
  const students = await prisma.person.count({
    where: { personType: "STUDENT" },
  });
  const staff = await prisma.person.count({
    where: { personType: "STAFF" },
  });
  const activeAssignments = await prisma.assignment.count({
    where: { status: "ACTIVE" },
  });

  const recentAssignments = await prisma.assignment.findMany({
    where: { status: "ACTIVE" },
    include: {
      device: true,
      person: true,
    },
    orderBy: {
      checkoutDate: "desc",
    },
    take: 6,
  });

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Command Center</div>
          <h1 className="page-title">Device Dashboard</h1>
          <p className="page-description">
            Track inventory, current assignments, students, staff, and device movement in one place.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/issue-device" className="btn btn-primary">
            Issue Device
          </Link>
          <Link href="/return-device" className="btn btn-outline">
            Return Device
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Total Devices" value={totalDevices} />
        <StatCard label="Available" value={availableDevices} />
        <StatCard label="Assigned" value={assignedDevices} />
        <StatCard label="Active Assignments" value={activeAssignments} />
        <StatCard label="Damaged" value={damagedDevices} />
        <StatCard label="Lost" value={lostDevices} />
        <StatCard label="Students" value={students} />
        <StatCard label="Staff" value={staff} />
      </section>

      <section className="quick-grid">
        <Link href="/issue-device" className="quick-card blue">
          <div>
            <p className="text-sm opacity-80">Fast Action</p>
            <h2 className="text-2xl font-black">Issue Device</h2>
          </div>
          <p className="text-sm opacity-80">Search ID → scan tag → assign.</p>
        </Link>

        <Link href="/mass-inventory/scan-many" className="quick-card purple">
          <div>
            <p className="text-sm opacity-80">Inventory Mode</p>
            <h2 className="text-2xl font-black">Scan Many</h2>
          </div>
          <p className="text-sm opacity-80">Add devices rapidly by type.</p>
        </Link>

        <Link href="/reports" className="quick-card green">
          <div>
            <p className="text-sm opacity-80">Exports</p>
            <h2 className="text-2xl font-black">Reports</h2>
          </div>
          <p className="text-sm opacity-80">Download assignment and inventory files.</p>
        </Link>
      </section>

      <section className="card card-pad space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Recent Active Assignments</h2>
            <p className="text-sm text-gray-500">
              Latest devices currently issued.
            </p>
          </div>

          <Link href="/assignments" className="btn btn-outline">
            View All
          </Link>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Issued To</th>
                <th>ID</th>
                <th>Asset Tag</th>
                <th>Device</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5}>No active assignments yet.</td>
                </tr>
              ) : (
                recentAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      {assignment.person.lastName}, {assignment.person.firstName}
                    </td>
                    <td>{assignment.person.schoolIdNumber}</td>
                    <td>{assignment.device.assetTag}</td>
                    <td>
                      {assignment.device.deviceType}{" "}
                      {assignment.device.model || ""}
                    </td>
                    <td>
                      {new Date(assignment.checkoutDate).toLocaleDateString()}
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}