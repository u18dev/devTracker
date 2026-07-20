"use client";

import { useActionState } from "react";
import { returnAssignment, type AssignmentActionState } from "../actions";

type AssignmentWithRelations = {
  id: number;
  chargerIssued: boolean;
  person: {
    firstName: string;
    lastName: string;
    schoolIdNumber: string;
  };
  device: {
    assetTag: string;
    serialNumber: string | null;
    brand: string | null;
    model: string | null;
  };
};

export default function ReturnAssignmentForm({
  assignment,
}: {
  assignment: AssignmentWithRelations;
}) {
  const returnAssignmentWithId = returnAssignment.bind(null, assignment.id);
  const [state, formAction, pending] = useActionState<
    AssignmentActionState,
    FormData
  >(returnAssignmentWithId, {});

  return (
    <form action={formAction} className="form-card space-y-5">
      <div className="form-section-header">
        <div className="step-pill">
          <span className="step-number">R</span>
          Return
        </div>

        <div>
          <div className="form-section-kicker">Device Return</div>
          <h2 className="form-section-title">
            {assignment.device.assetTag} · {assignment.person.firstName}{" "}
            {assignment.person.lastName}
          </h2>
          <p className="form-section-description">
            Serial: {assignment.device.serialNumber || "-"} · ID:{" "}
            {assignment.person.schoolIdNumber}
          </p>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="returnCondition">
          Return Condition
        </label>
        <select
          id="returnCondition"
          name="returnCondition"
          className="form-select"
          defaultValue="GOOD"
          required
        >
          <option value="NEW">New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="DAMAGED">Damaged</option>
          <option value="MISSING_PARTS">Missing Parts</option>
          <option value="UNUSABLE">Unusable</option>
        </select>
        <p className="form-hint">
          Damaged or unusable returns will keep the device out of available
          inventory.
        </p>
      </div>

      {assignment.chargerIssued && (
        <label className="flex items-center gap-3 font-bold">
          <input type="checkbox" name="chargerReturned" defaultChecked />
          Charger returned
        </label>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="returnNotes">
          Return Notes
        </label>
        <textarea
          id="returnNotes"
          name="returnNotes"
          className="form-textarea"
          placeholder="Optional notes about condition, missing charger, damage, etc."
        />
      </div>

      {state.error && (
        <div className="form-alert form-alert-error">{state.error}</div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Returning..." : "Confirm Return"}
        </button>
      </div>
    </form>
  );
}