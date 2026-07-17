"use client";

import { useActionState, useState } from "react";
import { returnDevice, type ReturnDeviceState } from "./actions";

type AssignmentResult = {
  id: number;
  checkoutDate: string;
  device: {
    id: number;
    assetTag: string;
    serialNumber?: string | null;
    deviceType: string;
    brand?: string | null;
    model?: string | null;
    status: string;
    deviceCondition: string;
  };
  person: {
    id: number;
    schoolIdNumber: string;
    personType: "STUDENT" | "STAFF";
    firstName: string;
    lastName: string;
    grade?: string | null;
    roomNumber?: string | null;
    department?: string | null;
  };
};

const initialState: ReturnDeviceState = {
  error: "",
};

export default function ReturnDeviceForm() {
  const [tagOrSerial, setTagOrSerial] = useState("");
  const [assignment, setAssignment] = useState<AssignmentResult | null>(null);
  const [lookupError, setLookupError] = useState("");

  const [state, formAction, pending] = useActionState(
    returnDevice,
    initialState
  );

  async function lookupAssignment() {
    setAssignment(null);
    setLookupError("");

    const query = tagOrSerial.trim();

    if (!query) {
      setLookupError("Enter or scan an asset tag / serial number.");
      return;
    }

    const res = await fetch(
      `/api/active-assignment-lookup?q=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if (!res.ok) {
      setLookupError(data.error || "No active assignment found.");
      return;
    }

    setAssignment(data.assignment);
  }

  return (
    <div className="space-y-6">
      <section className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">1</span>
              Device Lookup
            </span>

            <h2 className="form-section-title mt-3">
              Find Assigned Device
            </h2>

            <p className="form-section-description">
              Scan or type the asset tag / serial number to find the active
              assignment before returning the device.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px_140px_1fr] items-end">
          <div className="form-field">
            <label className="form-label" htmlFor="tagOrSerial">
              Asset Tag / Serial Number
            </label>

            <input
              id="tagOrSerial"
              value={tagOrSerial}
              onChange={(e) => setTagOrSerial(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  lookupAssignment();
                }
              }}
              className="form-input scanner-input"
              placeholder="Scan or enter tag..."
              autoFocus
            />

            <p className="form-hint">
              Press Enter after scanning to search the active assignment.
            </p>
          </div>

          <button
            type="button"
            onClick={lookupAssignment}
            className="btn btn-dark"
          >
            Search
          </button>

          <div
            className={
              assignment ? "form-result-panel active" : "form-result-panel"
            }
          >
            {assignment ? (
              <div>
                <p className="form-result-title">
                  {assignment.device.assetTag} — {assignment.device.deviceType}
                </p>

                <p className="form-result-meta">
                  {assignment.device.brand || "-"}{" "}
                  {assignment.device.model || ""} • Serial:{" "}
                  {assignment.device.serialNumber || "-"} • Status:{" "}
                  {assignment.device.status}
                </p>
              </div>
            ) : (
              <p className="form-result-meta">
                Active assignment will appear here.
              </p>
            )}
          </div>
        </div>

        {lookupError && (
          <p className="form-alert form-alert-error">
            {lookupError}
          </p>
        )}
      </section>

      <form action={formAction} className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">2</span>
              Return Check-In
            </span>

            <h2 className="form-section-title mt-3">
              Return Device
            </h2>

            <p className="form-section-description">
              Confirm the current holder, add optional notes, then return the
              device back to available inventory.
            </p>
          </div>

          {assignment && (
            <span className="badge badge-assigned">
              Active Assignment
            </span>
          )}
        </div>

        <input type="hidden" name="assignmentId" value={assignment?.id ?? ""} />

        {assignment ? (
          <div className="form-result-panel active">
            <p className="form-result-title">
              Currently assigned to: {assignment.person.firstName}{" "}
              {assignment.person.lastName}
            </p>

            <p className="form-result-meta">
              {assignment.person.personType} • ID:{" "}
              {assignment.person.schoolIdNumber}
              {assignment.person.grade
                ? ` • Grade ${assignment.person.grade}`
                : ""}
              {assignment.person.roomNumber
                ? ` • Room ${assignment.person.roomNumber}`
                : ""}
              {assignment.person.department
                ? ` • ${assignment.person.department}`
                : ""}
            </p>

            <p className="form-result-meta">
              Checked out:{" "}
              {new Date(assignment.checkoutDate).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="form-result-panel">
            <p className="form-result-meta">
              Search a device first to see who it is assigned to.
            </p>
          </div>
        )}

        <div className="form-field">
          <label className="form-label" htmlFor="returnNotes">
            Return Notes
          </label>

          <textarea
            id="returnNotes"
            name="returnNotes"
            rows={3}
            className="form-textarea"
            placeholder="Optional return notes..."
          />

          <p className="form-hint">
            Use this for damaged devices, missing labels, student comments, or
            special return notes.
          </p>
        </div>

        {state?.error && (
          <p className="form-alert form-alert-error">
            {state.error}
          </p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={!assignment || pending}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Returning..." : "Return Device"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTagOrSerial("");
              setAssignment(null);
              setLookupError("");
            }}
            disabled={pending}
            className="btn btn-outline"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}