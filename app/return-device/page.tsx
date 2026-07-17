import ReturnDeviceForm from "./ReturnDeviceForm";

export default function ReturnDevicePage() {
  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Return Workflow</div>
          <h1 className="page-title">Return Device</h1>
          <p className="page-description">
            Scan a device tag or serial number, verify who has it, then check it
            back into available inventory.
          </p>
        </div>
      </section>

      <ReturnDeviceForm />
    </main>
  );
}