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
              <Link className="sidebar-link primary" href="/issue-device">
                ⚡ Issue Device
              </Link>
              <Link className="sidebar-link" href="/return-device">
                ↩ Return Device
              </Link>
              <Link className="sidebar-link" href="/dashboard">
                📊 Dashboard
              </Link>
              <Link className="sidebar-link" href="/devices">
                💻 Devices
              </Link>
              <Link className="sidebar-link" href="/students">
                🎓 Students
              </Link>
              <Link className="sidebar-link" href="/staff">
                🧑‍💼 Staff
              </Link>
              <Link className="sidebar-link" href="/assignments">
                🔗 Assignments
              </Link>
              <Link className="sidebar-link" href="/mass-inventory">
                📦 Mass Inventory
              </Link>
              <Link className="sidebar-link" href="/reports">
                📁 Reports
              </Link>
              <Link className="sidebar-link" href="/logout" prefetch={false}>
                🚪 Logout
              </Link>
              <Link className="sidebar-link" href="/search">
                🔎 Search
              </Link>
            </nav>
          </aside>

          <section className="main-area">
            <header className="topbar">
              <div>
                <div className="topbar-title">Campus Device Operations</div>
              </div>

              <form action="/search">
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