import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeviceTrack",
  description: "School device inventory and issuing system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="app-shell">
          <aside className="sidebar">
            <Link href="/" className="sidebar-logo">
              <div className="logo-mark">DT</div>
              <div>
                <div className="sidebar-title">DeviceTrack</div>
                <div className="sidebar-subtitle">Inventory Command</div>
              </div>
            </Link>

            <nav className="sidebar-nav">
              <Link className="sidebar-link primary" href="/issue-device" prefetch={false}>
                ⚡ Issue Device
              </Link>

              <Link className="sidebar-link" href="/return-device" prefetch={false}>
                ↩ Return Device
              </Link>

              <Link className="sidebar-link" href="/dashboard" prefetch={false}>
                📊 Dashboard
              </Link>

              <Link className="sidebar-link" href="/devices" prefetch={false}>
                💻 Devices
              </Link>

              <Link className="sidebar-link" href="/students" prefetch={false}>
                🎓 Students
              </Link>

              <Link className="sidebar-link" href="/staff" prefetch={false}>
                🧑‍💼 Staff
              </Link>

              <Link className="sidebar-link" href="/assignments" prefetch={false}>
                🔗 Assignments
              </Link>

              <Link className="sidebar-link" href="/mass-inventory" prefetch={false}>
                📦 Mass Inventory
              </Link>

              <Link className="sidebar-link" href="/reports" prefetch={false}>
                📁 Reports
              </Link>

              <Link className="sidebar-link" href="/search" prefetch={false}>
                🔎 Search
              </Link>
            </nav>
          </aside>

          <section className="main-area">
            <header className="topbar">
              <div>
                <div className="topbar-title">Campus Device Operations</div>
              </div>

              <form action="/search" method="get">
                <input
                  name="q"
                  className="topbar-search"
                  placeholder="Search asset tag, serial, student ID..."
                  autoComplete="off"
                  spellCheck={false}
                  suppressHydrationWarning
                />
              </form>
            </header>

            {children}
          </section>
        </div>
      </body>
    </html>
  );
}