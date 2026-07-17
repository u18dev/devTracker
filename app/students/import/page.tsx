import Link from "next/link";
import StudentImportForm from "./StudentImportForm";

export default function ImportStudentsPage() {
  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Student Records</div>
          <h1 className="page-title">Mass Upload Students</h1>
          <p className="page-description">
            Upload a student roster XLSX file to add or update student records in bulk.
          </p>
        </div>

        <Link href="/students" className="btn btn-outline">
          Back to Students
        </Link>
      </section>

      <StudentImportForm />
    </main>
  );
}