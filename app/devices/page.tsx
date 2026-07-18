export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "../../lib/prisma";
import StatusBadge from "../../components/StatusBadge";

export default async function DevicesPage() {
  const devices = await prisma.device.findMany({
    orderBy: {
      assetTag: "asc",
    },
  });

  return (
    <main className="page space-y-6">
      <section className="page-header">
        <div>
          <div className="eyebrow">Inventory</div>
          <h1 className="page-title">Devices</h1>
          <p className="page-description">
            Track Chromebooks, laptops, chargers, carts, and school technology assets.
          </p>
        </div>

        <Link href="/devices/new" className="btn btn-primary">
          Add Device
        </Link>
      </section>

      <div className="table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>Asset Tag</th>
              <th>Serial Number</th>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Location</th>
              <th>Room</th>
            </tr>
          </thead>

          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={9}>No devices added yet.</td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <Link href={`/devices/${device.id}`} className="text-blue-700 hover:underline">
                      {device.assetTag}
                    </Link>
                  </td>
                  <td>{device.serialNumber || "-"}</td>
                  <td>{device.deviceType}</td>
                  <td>{device.brand || "-"}</td>
                  <td>{device.model || "-"}</td>
                  <td>{device.status}</td>
                  <td>{device.deviceCondition}</td>
                  <td>{device.location || "-"}</td>
                  <td>{device.roomNumber || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}