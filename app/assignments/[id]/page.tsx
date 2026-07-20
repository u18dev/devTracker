export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignmentId = Number(id);

  if (!assignmentId) {
    notFound();
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      person: true,
      device: true,
    },
  });

  if (!assignment) {
    notFound();
  }

  const events = await prisma.deviceEvent.findMany({
    where: {
      OR: [
        { deviceId: assignment.deviceId },
        { personId: assignment.personId },
      ],
    },
    orderBy: {
      eventDate: "desc",
    },
    take: 25,
  });

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Assignment Detail</div>
          <h1 className="page-title">Assignment #{assignment.id}</h1>
          <p className="page-description">
            Checkout record for {assignment.person.firstName}{" "}
            {assignment.person.lastName} and device {assignment.device.assetTag}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/assignments" className="btn btn-outline" prefetch={false}>
            Back
          </Link>

          <Link
            href={`/assignments/${assignment.id}/edit`}
            className="btn btn-outline"
            prefetch={false}
          >
            Edit
          </Link>

          {assignment.status === "ACTIVE" && (
            <Link
              href={`/assignments/${assignment.id}/return`}
              className="btn btn-primary"
              prefetch={false}
            >
              Return Device
            </Link>
          )}
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Status</p>
          <p className="stat-value">{assignment.status}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Device</p>
          <p className="stat-value">{assignment.device.assetTag}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Person ID</p>
          <p className="stat-value">{assignment.person.schoolIdNumber}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Charger</p>
          <p className="stat-value">
            {assignment.chargerIssued ? "Issued" : "No"}
          </p>
        </div>
      </section>

      <section className="form-grid">
        <div className="card card-pad space-y-4">
          <div>
            <div className="eyebrow">Person</div>
            <h2 className="text-xl font-black">
              {assignment.person.firstName} {assignment.person.lastName}
            </h2>
          </div>

          <Info label="Type" value={assignment.person.personType} />
          <Info label="ID" value={assignment.person.schoolIdNumber} />
          <Info label="Email" value={assignment.person.email || "-"} />
          <Info label="Grade" value={assignment.person.grade || "-"} />
          <Info label="Room" value={assignment.person.roomNumber || "-"} />
          <Info label="Department" value={assignment.person.department || "-"} />
        </div>

        <div className="card card-pad space-y-4">
          <div>
            <div className="eyebrow">Device</div>
            <h2 className="text-xl font-black">{assignment.device.assetTag}</h2>
          </div>

          <Info label="Serial" value={assignment.device.serialNumber || "-"} />
          <Info label="Type" value={assignment.device.deviceType} />
          <Info label="Brand" value={assignment.device.brand || "-"} />
          <Info label="Model" value={assignment.device.model || "-"} />
          <Info label="Status" value={assignment.device.status} />
          <Info
            label="Condition"
            value={assignment.device.deviceCondition || "-"}
          />
        </div>
      </section>

      <section className="card card-pad space-y-4">
        <div>
          <div className="eyebrow">Checkout Details</div>
          <h2 className="text-xl font-black">Assignment Information</h2>
        </div>

        <div className="form-grid">
          <Info label="Checkout Date" value={formatDateTime(assignment.checkoutDate)} />
          <Info label="Due Date" value={assignment.dueDate ? formatDateTime(assignment.dueDate) : "-"} />
          <Info label="Return Date" value={assignment.returnDate ? formatDateTime(assignment.returnDate) : "-"} />
          <Info label="Checkout Condition" value={assignment.checkoutCondition || "-"} />
          <Info label="Return Condition" value={assignment.returnCondition || "-"} />
          <Info label="Charger Issued" value={assignment.chargerIssued ? "Yes" : "No"} />
          <Info label="Charger Returned" value={assignment.chargerReturned ? "Yes" : "No"} />
        </div>

        <div className="form-grid">
          <Info label="Checkout Notes" value={assignment.checkoutNotes || "-"} />
          <Info label="Return Notes" value={assignment.returnNotes || "-"} />
        </div>
      </section>

      <section className="card card-pad space-y-4">
        <div>
          <div className="eyebrow">Recent Activity</div>
          <h2 className="text-xl font-black">Related Events</h2>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={3}>No related events found.</td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.eventDate)}</td>
                    <td>{event.eventType}</td>
                    <td>{event.eventNote || "-"}</td>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="form-label">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}