import Link from "next/link";
import ScanManyItemsForm from "./ScanManyItemsForm";

export default function ScanManyItemsPage() {
  return (
    <main className="p-8 max-w-6xl space-y-6">
      <div>
        <Link
          href="/mass-inventory"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Mass Inventory Tools
        </Link>

        <h1 className="mt-3 text-3xl font-bold">Scan Many Items</h1>

        <p className="text-gray-600">
          Add many devices of the same type. Set the shared details once, then
          scan or type each asset tag. Press Enter to save and move to the next
          record.
        </p>
      </div>

      <ScanManyItemsForm />
    </main>
  );
}