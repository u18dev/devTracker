export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { updateDevice } from "./actions";

export default async function EditDevicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deviceId = Number(id);

  if (!deviceId) {
    notFound();
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    notFound();
  }

  const updateDeviceWithId = updateDevice.bind(null, device.id);

  return (
    <main className="p-8 max-w-4xl space-y-6">
      <div>
        <Link
          href={`/devices/${device.id}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Device
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Edit Device</h1>
        <p className="text-gray-600">
          Update device inventory details for {device.assetTag}.
        </p>
      </div>

      <form
        action={updateDeviceWithId}
        className="space-y-6 rounded-xl border bg-white p-6"
      >
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Asset Tag"
            name="assetTag"
            defaultValue={device.assetTag}
            required
          />

          <Field
            label="Serial Number"
            name="serialNumber"
            defaultValue={device.serialNumber || ""}
          />

          <Field
            label="Device Type"
            name="deviceType"
            defaultValue={device.deviceType}
            required
          />

          <Field label="Brand" name="brand" defaultValue={device.brand || ""} />

          <Field label="Model" name="model" defaultValue={device.model || ""} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={device.status}
              className="rounded-lg border px-3 py-2"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="DAMAGED">Damaged</option>
              <option value="LOST">Lost</option>
              <option value="STOLEN">Stolen</option>
              <option value="IN_REPAIR">In Repair</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="deviceCondition">
              Condition
            </label>

            <select
              id="deviceCondition"
              name="deviceCondition"
              defaultValue={device.deviceCondition}
              className="rounded-lg border px-3 py-2"
            >
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="MISSING_PARTS">Missing Parts</option>
              <option value="UNUSABLE">Unusable</option>
            </select>
          </div>

          <Field
            label="Location"
            name="location"
            defaultValue={device.location || ""}
          />

          <Field
            label="Room Number"
            name="roomNumber"
            defaultValue={device.roomNumber || ""}
          />

          <Field
            label="Cart Name"
            name="cartName"
            defaultValue={device.cartName || ""}
          />

          <Field
            label="Charger Tag"
            name="chargerTag"
            defaultValue={device.chargerTag || ""}
          />
        </section>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="hasCharger"
            defaultChecked={device.hasCharger}
            className="h-4 w-4"
          />
          Device has charger
        </label>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="notes">
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={device.notes || ""}
            className="rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Save Changes
          </button>

          <Link
            href={`/devices/${device.id}`}
            className="rounded-lg border px-4 py-2"
          >
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
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-lg border px-3 py-2"
      />
    </div>
  );
}