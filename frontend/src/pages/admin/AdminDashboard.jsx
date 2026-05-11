import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await api.get("/admin/dashboard-summary");
        if (res.data.success && isMounted) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    Promise.resolve().then(() => loadData());
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = [
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? "--",
      iconBg: "bg-blue-100",
      iconColor: "fill-blue-500",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z" />
        </svg>
      ),
    },
    {
      label: "Active Tours",
      value: stats?.totalPackages ?? "--",
      iconBg: "bg-teal-100",
      iconColor: "fill-teal-600",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 002 2v1.93zm6.9-2.54A1.99 1.99 0 0016 16h-1v-3a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7h2a2 2 0 002-2v-.41A7.99 7.99 0 0120 12c0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
    {
      label: "Monthly Revenue",
      value: stats?.totalRevenue
        ? `₱${stats.totalRevenue.toLocaleString("en-PH")}`
        : "--",
      iconBg: "bg-amber-100",
      iconColor: "fill-amber-600",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
    },
    {
      label: "New Customers",
      value: stats?.totalClients ?? "--",
      iconBg: "bg-violet-100",
      iconColor: "fill-violet-600",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Topbar />
      <div className="cv-main-container animate-fade-in">
        {/* HEADER*/}
        <div className="cv-section-header">
          <h1 className="cv-page-title">Dashboard Overview</h1>
          <p className="cv-page-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* METRIC CARDS*/}
        <div className="grid grid-cols-4 gap-[24px] mb-12">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="cv-metric-card flex justify-between items-center group cursor-default"
            >
              <div>
                <p className="cv-metric-label">{m.label}</p>
                <p className="cv-metric-value">{m.value}</p>
              </div>
              <div
                className={`cv-icon-box ${m.iconBg.replace("bg-", "").replace("-100", "")}`}
              >
                {m.icon}
              </div>
            </div>
          ))}
        </div>

        {/* UPCOMING TOURS*/}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
                Upcoming Tours
              </h2>
              <p className="text-[13px] text-slate-400 mt-1">
                Popular destinations with available bookings
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/tour-packages")}
              className="cv-btn cv-btn-outline cv-btn-sm"
            >
              View All Tours
            </button>
          </div>
        </div>

        {/* RECENT BOOKINGS*/}
        <div className="cv-table-wrapper">
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/30">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
                Recent Bookings
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Latest booking activities
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="text-[13px] text-blue-600 font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead>
                <tr>
                  {[
                    "Booking ID",
                    "Customer",
                    "Destination",
                    "Package",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : !stats?.recentBookings?.length ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-slate-400"
                    >
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  stats.recentBookings.map((b) => (
                    <tr key={b.BookingID}>
                      <td className="font-bold text-blue-600">
                        BK-{String(b.BookingID).padStart(4, "0")}
                      </td>
                      <td className="font-bold text-slate-900">
                        {b.Client?.Name || "—"}
                      </td>
                      <td>{b.Package?.Destination || "—"}</td>
                      <td>{b.Package?.Name || "—"}</td>
                      <td className="text-slate-400 font-medium">
                        {b.BookingDate}
                      </td>
                      <td>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            b.Status === "confirmed"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : b.Status === "pending"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : b.Status === "cancelled"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {b.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
