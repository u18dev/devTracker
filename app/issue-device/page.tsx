import IssueDeviceForm from "./IssueDeviceForm";

export default function IssueDevicePage() {
  return (
    <main className="p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issue Device</h1>
        <p className="text-gray-600">
          Search a student or staff member by ID, then assign a device by asset tag or serial number.
        </p>
      </div>

      <IssueDeviceForm />
    </main>
  );
}