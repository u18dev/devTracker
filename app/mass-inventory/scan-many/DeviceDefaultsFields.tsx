"use client";

import { useState } from "react";

export default function DeviceDefaultsFields() {
  const [typeValue, setTypeValue] = useState("");
  const [brandValue, setBrandValue] = useState("");

  const showCustomType = typeValue === "__custom__";
  const showCustomBrand = brandValue === "__custom__";

  return (
    <div className="form-grid">
      <div className="form-field">
        <label className="form-label" htmlFor="deviceType">
          Default Type
        </label>

        <select
          id="deviceType"
          name="deviceType"
          className="form-select"
          value={typeValue}
          onChange={(event) => setTypeValue(event.target.value)}
          required
        >
          <option value="" disabled>
            Select device type
          </option>
          <option value="iPad">iPad</option>
          <option value="Chromebook">Chromebook</option>
          <option value="HP Laptop">HP Laptop</option>
          <option value="Phone Case">Phone Case</option>
          <option value="__custom__">+ Add new type</option>
        </select>

        {showCustomType && (
          <input
            id="customDeviceType"
            name="customDeviceType"
            className="form-input"
            placeholder="Enter new device type"
            style={{ marginTop: 10 }}
            autoComplete="off"
            required
          />
        )}

        <p className="form-hint">
          This type will apply to every scanned device unless changed.
        </p>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="brand">
          Default Brand
        </label>

        <select
          id="brand"
          name="brand"
          className="form-select"
          value={brandValue}
          onChange={(event) => setBrandValue(event.target.value)}
          required
        >
          <option value="" disabled>
            Select brand
          </option>
          <option value="HP">HP</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Mission Darkness">Mission Darkness</option>
          <option value="__custom__">+ Add new brand</option>
        </select>

        {showCustomBrand && (
          <input
            id="customBrand"
            name="customBrand"
            className="form-input"
            placeholder="Enter new brand"
            style={{ marginTop: 10 }}
            autoComplete="off"
            required
          />
        )}

        <p className="form-hint">
          This brand will apply to every scanned device unless changed.
        </p>
      </div>
    </div>
  );
}