import Link from "next/link";

export default function IssueDeviceSuccessPage() {
  return (
    <main className="p-8 max-w-3xl space-y-6">
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h1 className="text-3xl font-bold text-green-700">Device Issued</h1>

        <p className="text-gray-600">
          The device was successfully issued and the inventory record has been updated.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/issue-device" className="rounded-lg bg-black px-4 py-2 text-white">
            Issue Another Device
          </Link>

          <Link href="/devices" className="rounded-lg border px-4 py-2">
            View Devices
          </Link>

          <Link href="/dashboard" className="rounded-lg border px-4 py-2">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}