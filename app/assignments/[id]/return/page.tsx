export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import ReturnAssignmentForm from "./ReturnAssignmentForm";

export default async function ReturnAssignmentPage({
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

  if (assignment.status !== "ACTIVE") {
    return (
      <main className="page space-y-6">
        <section className="page-header">
          <div>
            <div className="eyebrow">Return Assignment</div>
            <h1 className="page-title">Already Returned</h1>
            <p className="page-description">
              This assignment is no longer active.
            </p>
          </div>

          <Link
            href={`/assignments/${assignment.id}`}
            className="btn btn-outline"
            prefetch={false}
          >
            Back
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Return Assignment</div>
          <h1 className="page-title">Return Device</h1>
          <p className="page-description">
            Return {assignment.device.assetTag} from{" "}
            {assignment.person.firstName} {assignment.person.lastName}.
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

      <ReturnAssignmentForm assignment={assignment} />
    </main>
  );
}