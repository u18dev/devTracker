export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { AssignmentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;

  const selectedStatus = params.status || "ACTIVE";
  const q = String(params.q || "").trim();

  const validStatuses: AssignmentStatus[] = [
    "ACTIVE",
    "RETURNED",
    "LOST",
    "DAMAGED",
  ];

  const statusFilter =
    selectedStatus !== "ALL" && validStatuses.includes(selectedStatus as AssignmentStatus)
      ? (selectedStatus as AssignmentStatus)
      : undefined;

  const where: Prisma.AssignmentWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(q
      ? {
          OR: [
            {
              person: {
                schoolIdNumber: {
                  contains: q,
                },
              },
            },
            {
              person: {
                firstName: {
                  contains: q,
                },
              },
            },
            {
              person: {
                lastName: {
                  contains: q,
                },
              },
            },
            {
              device: {
                assetTag: {
                  contains: q,
                },
              },
            },
            {
              device: {
                serialNumber: {
                  contains: q,
                },
              },
            },
          ],
        }
      : {}),
  };

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      person: true,
      device: true,
    },
    orderBy: {
      checkoutDate: "desc",
    },
    take: 200,
  });

  const activeCount = await prisma.assignment.count({
    where: { status: "ACTIVE" },
  });

  const returnedCount = await prisma.assignment.count({
    where: { status: "RETURNED" },
  });

  const overdueCount = 0;

  const totalCount = await prisma.assignment.count();

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Device Checkout Records</div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-description">
            View active checkouts, returned devices, overdue assignments, and
            assignment history.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/issue-device" className="btn btn-primary" prefetch={false}>
            Issue Device
          </Link>

          <Link href="/return-device" className="btn btn-outline" prefetch={false}>
            Return Device
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Active</p>
          <p className="stat-value">{activeCount}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Returned</p>
          <p className="stat-value">{returnedCount}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total Records</p>
          <p className="stat-value">{totalCount}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Showing</p>
          <p className="stat-value">{assignments.length}</p>
        </div>
      </section>

      <section className="card card-pad space-y-4">
        <form action="/assignments" method="get" className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              name="q"
              className="form-input scanner-input"
              placeholder="Student ID, staff ID, name, asset tag, serial..."
              defaultValue={q}
              autoComplete="off"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              defaultValue={selectedStatus}
            >
              <option value="ACTIVE">Active</option>
              <option value="RETURNED">Returned</option>
              <option value="LOST">Lost</option>
              <option value="DAMAGED">Damaged</option>
              <option value="ALL">All</option>
            </select>
          </div>

          <div className="form-field" style={{ justifyContent: "end" }}>
            <label className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="card card-pad space-y-4">
        <div>
          <div className="eyebrow">Assignment Records</div>
          <h2 className="text-xl font-black">Checkout List</h2>
          <p className="text-sm text-gray-500">
            Click an assignment to view details, edit notes, or process a return.
          </p>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Person</th>
                <th>Device</th>
                <th>Checkout</th>
                <th>Status</th>
                <th>Charger</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={8}>No assignments found.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="font-black">#{assignment.id}</td>

                    <td>
                      <div className="font-bold">
                        {assignment.person.lastName}, {assignment.person.firstName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.person.personType} ·{" "}
                        {assignment.person.schoolIdNumber}
                      </div>
                    </td>

                    <td>
                      <div className="font-bold">{assignment.device.assetTag}</div>
                      <div className="text-xs text-gray-500">
                        {assignment.device.brand || "-"} {assignment.device.model || ""}
                      </div>
                    </td>

                    <td>{formatDate(assignment.checkoutDate)}</td>

                    <td>
                      <AssignmentBadge status={assignment.status} />
                    </td>

                    <td>{assignment.chargerIssued ? "Issued" : "No"}</td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/assignments/${assignment.id}`}
                          className="btn btn-outline"
                          prefetch={false}
                        >
                          View
                        </Link>

                        {assignment.status === "ACTIVE" && (
                          <Link
                            href={`/assignments/${assignment.id}/return`}
                            className="btn btn-primary"
                            prefetch={false}
                          >
                            Return
                          </Link>
                        )}
                      </div>
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

function AssignmentBadge({ status }: { status: string }) {
  let className = "badge badge-neutral";

  if (status === "ACTIVE") className = "badge badge-assigned";
  if (status === "RETURNED") className = "badge badge-available";
  if (status === "LOST") className = "badge badge-lost";
  if (status === "DAMAGED") className = "badge badge-damaged";

  return <span className={className}>{status.replaceAll("_", " ")}</span>;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}