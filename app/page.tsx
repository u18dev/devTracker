import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-6">
      <h1 className="text-4xl font-bold">DeviceTrack</h1>

      <p className="text-gray-600 max-w-2xl">
        Internal school device inventory system for tracking devices, students,
        staff, checkouts, returns, repairs, and accountability.
      </p>

      <div className="flex flex-wrap gap-3">
      <Link className="rounded-lg bg-black px-4 py-2 text-white" href="/dashboard">
        Dashboard
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/devices">
        Devices
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/students">
        Students
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/staff">
        Staff
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/issue-device">
        Issue Device
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/return-device">
        Return Device
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/mass-inventory">
        Mass Inventory Tools
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/search">
        Search
      </Link>

      <Link className="rounded-lg border px-4 py-2" href="/reports">
        Reports
      </Link>
    </div>
    </main>
  );
}