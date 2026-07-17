import Link from "next/link";
import { createDevice } from "./actions";

export default function NewDevicePage() {
  return (
    <main className="p-8 max-w-4xl space-y-6">
      <div>
        <Link href="/devices" className="text-sm text-gray-600 hover:underline">
          ← Back to Devices
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Add Device</h1>
        <p className="text-gray-600">
          Add a Chromebook, laptop, iPad, hotspot, charger, or other school device.
        </p>
      </div>

      <form action={createDevice} className="space-y-6 rounded-xl border p-6 bg-white">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Asset Tag" name="assetTag" required />
          <Field label="Serial Number" name="serialNumber" />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="deviceType">
              Device Type <span className="text-red-600">*</span>
            </label>
            <select
              id="deviceType"
              name="deviceType"
              required
              className="rounded-lg border px-3 py-2"
              defaultValue="Chromebook"
            >
              <option value="Chromebook">Chromebook</option>
              <option value="Laptop">Laptop</option>
              <option value="iPad">iPad</option>
              <option value="Desktop">Desktop</option>
              <option value="Hotspot">Hotspot</option>
              <option value="Charger">Charger</option>
              <option value="Monitor">Monitor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Field label="Brand" name="brand" />
          <Field label="Model" name="model" />
          <Field label="Location" name="location" placeholder="Tech Office, Library, Cart A..." />
          <Field label="Room Number" name="roomNumber" />
          <Field label="Cart Name" name="cartName" />
          <Field label="Charger Tag" name="chargerTag" />
        </section>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="hasCharger" className="h-4 w-4" />
          This device includes a charger
        </label>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="rounded-lg border px-3 py-2"
            placeholder="Optional notes about condition, missing parts, labels, etc."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Save Device
          </button>

          <Link href="/devices" className="rounded-lg border px-4 py-2">
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
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        className="rounded-lg border px-3 py-2"
      />
    </div>
  );
}