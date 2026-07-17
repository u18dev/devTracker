"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ImportResult = {
  success: boolean;
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
};

export default function StudentImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!file) {
      setError("Choose an XLSX file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    const res = await fetch("/api/students/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }

    setResult(data);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="form-card form-section">
        <div className="form-section-header">
          <div>
            <span className="step-pill">
              <span className="step-number">1</span>
              XLSX Upload
            </span>

            <h2 className="form-section-title mt-3">
              Upload Student Roster
            </h2>

            <p className="form-section-description">
              This importer expects columns named Student Name, Student ID,
              StuEmail, and Grade.
            </p>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="file">
            Student Roster XLSX
          </label>

          <input
            id="file"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="form-input"
          />

          <p className="form-hint">
            Existing students will be updated based on Student ID. New students
            will be created automatically.
          </p>
        </div>

        {error && (
          <p className="form-alert form-alert-error">
            {error}
          </p>
        )}

        {result && (
          <div className="form-result-panel active">
            <p className="form-result-title">
              Import Complete
            </p>

            <p className="form-result-meta">
              Total rows: {result.totalRows} • Imported/Updated:{" "}
              {result.imported} • Skipped: {result.skipped}
            </p>

            {result.errors.length > 0 && (
              <div className="mt-3 space-y-1 text-sm text-red-700">
                {result.errors.slice(0, 10).map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Import Students"}
          </button>

          <Link href="/students" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}