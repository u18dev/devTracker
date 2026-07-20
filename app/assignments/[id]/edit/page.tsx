export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import EditAssignmentForm from "./EditAssignmentForm";

export default async function EditAssignmentPage({
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

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Edit Assignment</div>
          <h1 className="page-title">Assignment #{assignment.id}</h1>
          <p className="page-description">
            Update checkout notes, charger status, condition, and due date.
          </p>
        </div>

        <Link
          href={`/assignments/${assignment.id}`}
          className="btn btn-outline"
          prefetch={false}
        >
          Cancel
        </Link>
      </section>

      <EditAssignmentForm assignment={assignment} />
    </main>
  );
}