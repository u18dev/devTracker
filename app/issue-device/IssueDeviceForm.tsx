"use client";

import { useActionState, useRef, useState } from "react";
import { issueDeviceByLookup, type IssueDeviceState } from "./actions";

type PersonResult = {
  id: number;
  schoolIdNumber: string;
  personType: "STUDENT" | "STAFF";
  firstName: string;
  lastName: string;
  grade?: string | null;
  roomNumber?: string | null;
  department?: string | null;
};

const initialState: IssueDeviceState = {
  error: "",
};

export default function IssueDeviceForm() {
  const [personSearch, setPersonSearch] = useState("");
  const [person, setPerson] = useState<PersonResult | null>(null);
  const [personError, setPersonError] = useState("");

  const tagInputRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    issueDeviceByLookup,
    initialState
  );

  async function lookupPerson() {
    setPerson(null);
    setPersonError("");

    const id = personSearch.trim();

    if (!id) {
      setPersonError("Enter a student or staff ID.");
      return;
    }

    const res = await fetch(`/api/person-lookup?id=${encodeURIComponent(id)}`);
    const data = await res.json();

    if (!res.ok) {
      setPersonError(data.error || "Student or staff member not found.");
      return;
    }

    setPerson(data.person);

    requestAnimationFrame(() => {
      tagInputRef.current?.focus();
    });
  }

  return (
    <div className="space-y-6">
      <section className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">1</span>
              ID Lookup
            </span>

            <h2 className="form-section-title mt-3">
              Search Student or Staff
            </h2>

            <p className="form-section-description">
              Enter the student or staff ID. When found, the device scanner field
              will unlock automatically.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr_140px] items-end">
          <div className="form-field">
            <label className="form-label" htmlFor="personSearch">
              Student / Staff ID
            </label>

            <input
              id="personSearch"
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  lookupPerson();
                }
              }}
              className="form-input"
              placeholder="Enter ID..."
              autoFocus
            />

            <p className="form-hint">
              Press Enter after typing the ID.
            </p>
          </div>

          <div className={person ? "form-result-panel active" : "form-result-panel"}>
            {person ? (
              <div>
                <p className="form-result-title">
                  {person.firstName} {person.lastName}
                </p>

                <p className="form-result-meta">
                  {person.personType} • ID: {person.schoolIdNumber}
                  {person.grade ? ` • Grade ${person.grade}` : ""}
                  {person.roomNumber ? ` • Room ${person.roomNumber}` : ""}
                  {person.department ? ` • ${person.department}` : ""}
                </p>
              </div>
            ) : (
              <p className="form-result-meta">
                Student or staff profile will appear here.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={lookupPerson}
            className="btn btn-dark"
          >
            Search
          </button>
        </div>

        {personError && (
          <p className="form-alert form-alert-error">
            {personError}
          </p>
        )}
      </section>

      <form action={formAction} className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">2</span>
              Device Scan
            </span>

            <h2 className="form-section-title mt-3">
              Issue Device
            </h2>

            <p className="form-section-description">
              Scan or type the asset tag or serial number. If the device exists
              and is available, it will be issued immediately.
            </p>
          </div>
        </div>

        <input type="hidden" name="personId" value={person?.id ?? ""} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px_1fr] items-end">
          <div className="form-field">
            <label className="form-label" htmlFor="tagOrSerial">
              Asset Tag / Serial Number
            </label>

            <input
              ref={tagInputRef}
              id="tagOrSerial"
              name="tagOrSerial"
              className="form-input scanner-input"
              placeholder={person ? "Scan or enter tag..." : "Search ID first"}
              disabled={!person || pending}
            />

            <p className="form-hint">
              Press Enter after scanning to issue the device.
            </p>
          </div>

          <div className={person ? "form-result-panel active" : "form-result-panel"}>
            {person ? (
              <div>
                <p className="form-result-title">
                  Ready to issue
                </p>

                <p className="form-result-meta">
                  Device will be assigned to{" "}
                  <span className="font-black text-slate-900">
                    {person.firstName} {person.lastName}
                  </span>{" "}
                  once the tag or serial is submitted.
                </p>
              </div>
            ) : (
              <p className="form-result-meta">
                Search a student or staff member before issuing a device.
              </p>
            )}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="checkoutNotes">
            Notes
          </label>

          <textarea
            id="checkoutNotes"
            name="checkoutNotes"
            rows={3}
            className="form-textarea"
            placeholder="Optional issuing notes..."
          />

          <p className="form-hint">
            Use notes for special cases only, like cracked screen, missing label,
            or temporary checkout.
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
            disabled={!person || pending}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Issuing..." : "Issue Device"}
          </button>

          <button
            type="reset"
            className="btn btn-outline"
            disabled={pending}
          >
            Clear Device Field
          </button>
        </div>
      </form>
    </div>
  );
}