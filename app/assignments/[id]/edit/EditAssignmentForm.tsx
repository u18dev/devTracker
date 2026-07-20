"use client";

import { useActionState } from "react";
import { updateAssignment, type AssignmentActionState } from "../actions";

type AssignmentWithRelations = {
  id: number;
  checkoutNotes: string | null;
  checkoutCondition: string;
  chargerIssued: boolean;
  dueDate: Date | null;
  person: {
    firstName: string;
    lastName: string;
    schoolIdNumber: string;
  };
  device: {
    assetTag: string;
  };
};

export default function EditAssignmentForm({
  assignment,
}: {
  assignment: AssignmentWithRelations;
}) {
  const updateAssignmentWithId = updateAssignment.bind(null, assignment.id);
  const [state, formAction, pending] = useActionState<
    AssignmentActionState,
    FormData
  >(updateAssignmentWithId, {});

  return (
    <form action={formAction} className="form-card space-y-5">
      <div className="form-section-header">
        <div className="step-pill">
          <span className="step-number">A</span>
          Edit Record
        </div>

        <div>
          <div className="form-section-kicker">Assignment Info</div>
          <h2 className="form-section-title">
            {assignment.person.firstName} {assignment.person.lastName} ·{" "}
            {assignment.device.assetTag}
          </h2>
          <p className="form-section-description">
            ID: {assignment.person.schoolIdNumber}
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="checkoutCondition">
            Checkout Condition
          </label>
          <select
            id="checkoutCondition"
            name="checkoutCondition"
            className="form-select"
            defaultValue={assignment.checkoutCondition}
          >
            <option value="NEW">New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="DAMAGED">Damaged</option>
            <option value="MISSING_PARTS">Missing Parts</option>
            <option value="UNUSABLE">Unusable</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="form-input"
            defaultValue={
              assignment.dueDate
                ? new Date(assignment.dueDate).toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
      </div>

      <label className="flex items-center gap-3 font-bold">
        <input
          type="checkbox"
          name="chargerIssued"
          defaultChecked={assignment.chargerIssued}
        />
        Charger issued
      </label>

      <div className="form-field">
        <label className="form-label" htmlFor="checkoutNotes">
          Checkout Notes
        </label>
        <textarea
          id="checkoutNotes"
          name="checkoutNotes"
          className="form-textarea"
          defaultValue={assignment.checkoutNotes || ""}
        />
      </div>

      {state.error && (
        <div className="form-alert form-alert-error">{state.error}</div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving..." : "Save Assignment"}
        </button>
      </div>
    </form>
  );
}