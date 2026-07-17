export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  let className = "badge badge-neutral";

  if (normalized === "available") className = "badge badge-available";
  if (normalized === "assigned") className = "badge badge-assigned";
  if (normalized === "damaged") className = "badge badge-damaged";
  if (normalized === "lost") className = "badge badge-lost";
  if (normalized === "stolen") className = "badge badge-stolen";

  return <span className={className}>{status.replaceAll("_", " ")}</span>;
}