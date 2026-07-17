import Link from "next/link";
import { createStudent } from "./actions";

export default function NewStudentPage() {
  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Student Records</div>
          <h1 className="page-title">Add Student</h1>
          <p className="page-description">
            Create a student profile so devices can be issued, tracked, and
            returned through the inventory system.
          </p>
        </div>

        <Link href="/students" className="btn btn-outline">
          Back to Students
        </Link>
      </section>

      <form action={createStudent} className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">1</span>
              Student Setup
            </span>

            <h2 className="form-section-title mt-3">
              Student Information
            </h2>

            <p className="form-section-description">
              Student ID, first name, and last name are required. Everything
              else can be updated later.
            </p>
          </div>
        </div>

        <section className="form-grid">
          <Field
            label="Student ID Number"
            name="schoolIdNumber"
            required
            placeholder="Example: 123456"
            hint="This is used when issuing or returning devices."
          />

          <Field
            label="Grade"
            name="grade"
            placeholder="9, 10, 11, 12"
          />

          <Field
            label="First Name"
            name="firstName"
            required
          />

          <Field
            label="Last Name"
            name="lastName"
            required
          />

          <Field
            label="Preferred Name"
            name="preferredName"
          />

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="student@example.org"
          />

          <Field
            label="Phone"
            name="phone"
          />

          <Field
            label="Room Number"
            name="roomNumber"
            placeholder="Example: 305"
          />

          <Field
            label="Graduation Year"
            name="graduationYear"
            type="number"
            placeholder="2028"
          />
        </section>

        <div className="form-field">
          <label className="form-label" htmlFor="notes">
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="form-textarea"
            placeholder="Optional student notes..."
          />

          <p className="form-hint">
            Use this for device restrictions, special checkout notes, or internal reminders.
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Student
          </button>

          <Link href="/students" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  required = false,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="form-input"
      />

      {hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}