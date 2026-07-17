import Link from "next/link";
import { createStaff } from "./actions";

export default function NewStaffPage() {
  return (
    <main className="p-8 max-w-4xl space-y-6">
      <div>
        <Link href="/staff" className="text-sm text-gray-600 hover:underline">
          ← Back to Staff
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Add Staff</h1>
        <p className="text-gray-600">
          Add a staff member who can be assigned a school device.
        </p>
      </div>

      <form action={createStaff} className="space-y-6 rounded-xl border bg-white p-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Staff ID Number" name="schoolIdNumber" required />

          <Field label="First Name" name="firstName" required />
          <Field label="Last Name" name="lastName" required />
          <Field label="Preferred Name" name="preferredName" />

          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />

          <Field label="Room Number" name="roomNumber" />
          <Field label="Department" name="department" placeholder="Math, English, IT..." />
          <Field label="Job Title" name="jobTitle" placeholder="Teacher, Counselor, Staff..." />
        </section>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="rounded-lg border px-3 py-2"
            placeholder="Optional notes"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
            Save Staff
          </button>

          <Link href="/staff" className="rounded-lg border px-4 py-2">
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
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-lg border px-3 py-2"
      />
    </div>
  );
}