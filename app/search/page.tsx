export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "../../lib/prisma";
import StatusBadge from "../../components/StatusBadge";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = String(params.q || "").trim();

  const devices = q
    ? await prisma.device.findMany({
        where: {
          OR: [
            { assetTag: { contains: q } },
            { serialNumber: { contains: q } },
            { deviceType: { contains: q } },
            { brand: { contains: q } },
            { model: { contains: q } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: 50,
      })
    : [];

  const people = q
    ? await prisma.person.findMany({
        where: {
          OR: [
            { schoolIdNumber: { contains: q } },
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { roomNumber: { contains: q } },
            { department: { contains: q } },
          ],
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        take: 50,
      })
    : [];

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Search</div>
          <h1 className="page-title">Search Inventory</h1>
          <p className="page-description">
            Search devices, students, staff, tags, serial numbers, names, rooms,
            and departments.
          </p>
        </div>
      </section>

      <section className="card card-pad">
        <form action="/search" method="get" className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              name="q"
              className="form-input scanner-input"
              placeholder="Asset tag, serial, name, student ID..."
              defaultValue={q}
              autoComplete="off"
            />
          </div>

          <div className="form-field" style={{ justifyContent: "end" }}>
            <label className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </section>

      {!q && (
        <section className="form-alert">
          Enter a search term to find matching devices, students, or staff.
        </section>
      )}

      {q && (
        <>
          <section className="card card-pad space-y-4">
            <div>
              <div className="eyebrow">Results</div>
              <h2 className="text-xl font-black">People</h2>
              <p className="text-sm text-gray-500">
                {people.length} result{people.length === 1 ? "" : "s"} found.
              </p>
            </div>

            <div className="table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Email</th>
                    <th>Grade</th>
                    <th>Room</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {people.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No people found.</td>
                    </tr>
                  ) : (
                    people.map((person) => (
                      <tr key={person.id}>
                        <td className="font-black">{person.schoolIdNumber}</td>
                        <td>
                          {person.lastName}, {person.firstName}
                        </td>
                        <td>{person.personType}</td>
                        <td>{person.email || "-"}</td>
                        <td>{person.grade || "-"}</td>
                        <td>{person.roomNumber || "-"}</td>
                        <td>{person.department || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card card-pad space-y-4">
            <div>
              <div className="eyebrow">Results</div>
              <h2 className="text-xl font-black">Devices</h2>
              <p className="text-sm text-gray-500">
                {devices.length} result{devices.length === 1 ? "" : "s"} found.
              </p>
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No devices found.</td>
                    </tr>
                  ) : (
                    devices.map((device) => (
                      <tr key={device.id}>
                        <td className="font-black">
                          <Link href={`/devices/${device.id}`}>
                            {device.assetTag}
                          </Link>
                        </td>
                        <td>{device.serialNumber || "-"}</td>
                        <td>{device.deviceType}</td>
                        <td>{device.brand || "-"}</td>
                        <td>{device.model || "-"}</td>
                        <td>
                          <StatusBadge status={device.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}