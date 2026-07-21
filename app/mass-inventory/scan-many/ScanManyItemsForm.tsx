"use client";

import { FormEvent, useRef, useState } from "react";

type AddedDevice = {
  id: number;
  assetTag: string;
  serialNumber?: string | null;
  deviceType: string;
  brand?: string | null;
  model?: string | null;
  status: string;
  deviceCondition: string;
};

export default function ScanManyItemsForm() {
  const assetTagRef = useRef<HTMLInputElement | null>(null);

  const [deviceType, setDeviceType] = useState("Chromebook");
  const [customDeviceType, setCustomDeviceType] = useState("");

  const [brand, setBrand] = useState("HP");
  const [customBrand, setCustomBrand] = useState("");

  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [deviceCondition, setDeviceCondition] = useState("GOOD");
  const [location, setLocation] = useState("Tech Office");
  const [roomNumber, setRoomNumber] = useState("");
  const [cartName, setCartName] = useState("");
  const [hasCharger, setHasCharger] = useState(true);
  const [notes, setNotes] = useState("");

  const [assetTag, setAssetTag] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [addedDevices, setAddedDevices] = useState<AddedDevice[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanAssetTag = assetTag.trim();
    const cleanSerialNumber = serialNumber.trim();

    const finalDeviceType =
      deviceType === "__custom__" ? customDeviceType.trim() : deviceType.trim();

    const finalBrand =
      brand === "__custom__" ? customBrand.trim() : brand.trim();

    const finalModel =
      model === "__custom__" ? customModel.trim() : model.trim();

    if (!cleanAssetTag) {
      setError("Scan or enter an asset tag first.");
      return;
    }

    if (!finalDeviceType) {
      setError("Device type is required.");
      return;
    }

    if (!finalBrand) {
      setError("Brand is required.");
      return;
    }

    if (!finalModel) {
      setError("Model is required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/devices/quick-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetTag: cleanAssetTag,
          serialNumber: cleanSerialNumber,
          deviceType: finalDeviceType,
          brand: finalBrand,
          model: finalModel,
          deviceCondition,
          location,
          roomNumber,
          cartName,
          hasCharger,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Device could not be added.");
        return;
      }

      setAddedDevices((current) => [data.device, ...current]);
      setSuccessMessage(`Added ${data.device.assetTag}`);

      setAssetTag("");
      setSerialNumber("");

      requestAnimationFrame(() => {
        assetTagRef.current?.focus();
      });
    } catch (error) {
      setError("Device could not be added. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function clearCurrentScan() {
    setAssetTag("");
    setSerialNumber("");
    setError("");
    setSuccessMessage("");
    assetTagRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      <section className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">1</span>
              Defaults
            </span>

            <h2 className="form-section-title mt-3">
              Shared Device Type Setup
            </h2>

            <p className="form-section-description">
              Set the details once. These values will carry over for every
              scanned device in this batch.
            </p>
          </div>

          <div className="badge badge-assigned">
            {addedDevices.length} Added
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-field">
            <label className="form-label" htmlFor="deviceType">
              Device Type
              </label>

              <select
                id="deviceType"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="form-select"
              >
                <option value="Chromebook">Chromebook</option>
                <option value="Laptop">Laptop</option>
                <option value="HP Laptop">HP Laptop</option>
                <option value="iPad">iPad</option>
                <option value="Desktop">Desktop</option>
                <option value="Hotspot">Hotspot</option>
                <option value="Charger">Charger</option>
                <option value="Monitor">Monitor</option>
                <option value="Phone Case">Phone Case</option>
                <option value="__custom__">+ Add new type</option>
              </select>

              {deviceType === "__custom__" && (
                <input
                  className="form-input"
                  value={customDeviceType}
                  onChange={(e) => setCustomDeviceType(e.target.value)}
                  placeholder="Enter new device type"
                  style={{ marginTop: 10 }}
                  autoComplete="off"
                />
              )}
            </div>

          <div className="form-field">
            <label className="form-label" htmlFor="brand">
              Brand
            </label>

            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="form-select"
            >
              <option value="HP">HP</option>
              <option value="Lenovo">Lenovo</option>
              <option value="Mission Darkness">Mission Darkness</option>
              <option value="Apple">Apple</option>
              <option value="Dell">Dell</option>
              <option value="Acer">Acer</option>
              <option value="__custom__">+ Add new brand</option>
            </select>

            {brand === "__custom__" && (
              <input
                className="form-input"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="Enter new brand"
                style={{ marginTop: 10 }}
                autoComplete="off"
              />
            )}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="model">
              Model
            </label>

            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="form-select"
            >
              <option value="">Select model</option>
              <option value="HP Chromebook 11 G8">HP Chromebook 11 G8</option>
              <option value="HP Chromebook 11 G9">HP Chromebook 11 G9</option>
              <option value="HP Chromebook 11 G10">HP Chromebook 11 G10</option>
              <option value="Lenovo 100e">Lenovo 100e</option>
              <option value="Lenovo 300e">Lenovo 300e</option>
              <option value="iPad 9th Gen">iPad 9th Gen</option>
              <option value="iPad 10th Gen">iPad 10th Gen</option>
              <option value="Mission Darkness Phone Case">Mission Darkness Phone Case</option>
              <option value="__custom__">+ Add new model</option>
            </select>

            {model === "__custom__" && (
              <input
                className="form-input"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Enter new model"
                style={{ marginTop: 10 }}
                autoComplete="off"
              />
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="deviceCondition">
              Condition
            </label>

            <select
              id="deviceCondition"
              value={deviceCondition}
              onChange={(e) => setDeviceCondition(e.target.value)}
              className="form-select"
            >
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="MISSING_PARTS">Missing Parts</option>
              <option value="UNUSABLE">Unusable</option>
            </select>
          </div>

          <ModernField label="Location" value={location} onChange={setLocation} />
          <ModernField
            label="Room Number"
            value={roomNumber}
            onChange={setRoomNumber}
          />
          <ModernField label="Cart Name" value={cartName} onChange={setCartName} />

          <label className="form-result-panel flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={hasCharger}
              onChange={(e) => setHasCharger(e.target.checked)}
              className="h-4 w-4"
            />

            <div>
              <p className="form-result-title">Has Charger</p>
              <p className="form-result-meta">
                Applies to every scanned item in this batch.
              </p>
            </div>
          </label>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="notes">
            Batch Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Optional notes that should apply to each scanned item..."
          />

          <p className="form-hint">
            Example: New cart, received from district, labels applied, etc.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">2</span>
              Scanner Mode
            </span>

            <h2 className="form-section-title mt-3">
              Scan / Add Item
            </h2>

            <p className="form-section-description">
              Scan or type the asset tag. Press Enter to save the current device
              and move instantly to the next one.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr_150px_120px] items-end">
          <div className="form-field">
            <label className="form-label" htmlFor="assetTag">
              Asset Tag / Barcode
            </label>

            <input
              ref={assetTagRef}
              id="assetTag"
              value={assetTag}
              onChange={(e) => setAssetTag(e.target.value)}
              className="form-input scanner-input"
              placeholder="Scan or type asset tag..."
              autoFocus
            />

            <p className="form-hint">
              Press Enter after scanning to add the item.
            </p>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="serialNumber">
              Serial Number
            </label>

            <input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="form-input"
              placeholder="Optional serial number..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Item"}
          </button>

          <button
            type="button"
            onClick={clearCurrentScan}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>

        {error && (
          <p className="form-alert form-alert-error">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="form-alert form-alert-success">
            {successMessage}
          </p>
        )}
      </form>

      <section className="card card-pad space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow">Live Batch</div>
            <h2 className="text-xl font-black">Recently Added</h2>
            <p className="text-sm text-gray-500">
              {addedDevices.length} item{addedDevices.length === 1 ? "" : "s"} added this session.
            </p>
          </div>

          <div className="badge badge-available">
            Active Session
          </div>
        </div>

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Serial</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {addedDevices.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    No items added yet in this session.
                  </td>
                </tr>
              ) : (
                addedDevices.map((device) => (
                  <tr key={device.id}>
                    <td className="font-black">{device.assetTag}</td>
                    <td>{device.serialNumber || "-"}</td>
                    <td>{device.deviceType}</td>
                    <td>{device.brand || "-"}</td>
                    <td>{device.model || "-"}</td>
                    <td>{device.deviceCondition}</td>
                    <td>
                      <span className="badge badge-available">
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ModernField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      />
    </div>
  );
}