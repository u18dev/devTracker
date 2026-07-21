export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import DeviceTypeBrandFields from "./DeviceTypeBrandFields";

import { createDevice } from "./actions";

export default function NewDevicePage() {
  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Inventory Intake</div>
          <h1 className="page-title">Add Device</h1>
          <p className="page-description">
            Add a new device to inventory with type, brand, model, tag, serial,
            condition, and status.
          </p>
        </div>
      </section>

      <form action={createDevice} className="form-card space-y-5">
        <div className="form-section-header">
          <div className="step-pill">
            <span className="step-number">1</span>
            Device Info
          </div>

          <div>
            <div className="form-section-kicker">Core Details</div>
            <h2 className="form-section-title">Device Identity</h2>
            <p className="form-section-description">
              Enter the device asset tag, serial number, type, brand, and model.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="assetTag">
              Asset Tag
            </label>
            <input
              id="assetTag"
              name="assetTag"
              className="form-input scanner-input"
              required
              autoComplete="off"
              placeholder="Scan or enter asset tag"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="serialNumber">
              Serial Number
            </label>
            <input
              id="serialNumber"
              name="serialNumber"
              className="form-input"
              autoComplete="off"
              placeholder="Serial number"
            />
          </div>
        </div>

        <DeviceTypeBrandFields />

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="model">
              Model
            </label>
            <input
              id="model"
              name="model"
              className="form-input"
              autoComplete="off"
              placeholder="Example: 11 G9, 300e, Mission Darkness case"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="deviceCondition">
              Condition
            </label>
            <select
              id="deviceCondition"
              name="deviceCondition"
              className="form-select"
              defaultValue="GOOD"
            >
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="MISSING_PARTS">Missing Parts</option>
              <option value="UNUSABLE">Unusable</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              defaultValue="AVAILABLE"
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

          <div className="form-field">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              className="form-input"
              autoComplete="off"
              placeholder="Example: Computer Lab, Storage, Room 101"
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="form-textarea"
            placeholder="Optional notes"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Device
          </button>
        </div>
      </form>
    </main>
  );
}