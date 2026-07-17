import Link from "next/link";

export default function MassInventoryPage() {
  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mass Inventory Tools</h1>
        <p className="text-gray-600">
          Tools for adding and managing many devices at once.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <h2 className="text-xl font-semibold">Scan Many Items</h2>

          <p className="text-sm text-gray-600">
            Quickly add many devices of the same type by scanning or typing each
            asset tag. Shared device details stay filled in for each new item.
          </p>

          <Link
            href="/mass-inventory/scan-many"
            className="inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            Start Scanning
          </Link>
        </div>
      </section>
    </main>
  );
}