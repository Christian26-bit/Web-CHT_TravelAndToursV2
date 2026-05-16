import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/user_dashboard_summary");
        if (res.data.success && isMounted) {
          setStats(res.data.data);
          setBookings(res.data.data.recentBookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const formatName = (fullName) => {
    if (!fullName) return "Unknown";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, m, l] = parts;
      return `${f} ${l}`;
    }
    return fullName;
  };

  const metrics = [
    {
      label: "Total Customers",
      value: stats?.totalCustomers ?? "0",
      bgColor: "#EBF3FF",
      iconColor: "#007BFF",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
    },
    {
      label: "Ongoing Trips",
      value: stats?.ongoingTrips ?? "0",
      bgColor: "#ECFDF5",
      iconColor: "#10B981",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
    },
    {
      label: "Upcoming Trips",
      value: stats?.upcomingTrips ?? "0",
      bgColor: "#FFF4ED",
      iconColor: "#F97316",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z"/></svg>,
    },
    {
      label: "Completed Trips",
      value: stats?.completedTrips ?? "0",
      bgColor: "#F5F3FF",
      iconColor: "#7C3AED",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
    },
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
        <div>
          <h1 className="cv-title-display text-slate-900 mb-4">Dashboard Overview</h1>
          <p className="text-[16px] font-medium text-slate-500 tracking-tight">Welcome back! Here's what's happening with your clients today.</p>
        </div>
        <Button onClick={() => navigate("/bookings/step/1")} className="h-16 px-10 rounded-[0.75rem] text-[13px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Create New Booking
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {metrics.map((m, i) => (
          <Card key={i} className="p-8 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 rounded-[1.5rem]">
            <div>
              <p className="text-[13px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform" style={{ background: m.bgColor, color: m.iconColor }}>
              {m.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-10 mb-12 shadow-sm border-slate-100 rounded-[1.5rem]">
        <h3 className="text-[16px] font-black text-slate-900 mb-8">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate("/user/clients")} className="h-14 px-8 rounded-[0.75rem] text-[13px] font-black">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
             Add New Customer
          </Button>
          <Button variant="outline" onClick={() => navigate("/bookings/step/1")} className="h-14 px-8 rounded-[0.75rem] border-slate-200 text-[13px] font-black text-slate-700 hover:bg-slate-50 shadow-sm">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
             New Trip
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm border-slate-100 overflow-hidden rounded-[1.5rem]">
        <div className="px-10 py-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20 rounded-t-[1.5rem]">
          <div>
            <h2 className="text-[20px] font-black text-slate-900">Recent Bookings</h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[2px] mt-2">Latest engagement from your assigned clients</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/user/bookings")} className="h-12 px-6 rounded-[0.75rem] border-slate-200 text-[12px] font-black text-slate-500 hover:text-primary transition-all shadow-sm">
            View All
            <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Booking ID</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[250px]">Customer</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[300px]">Destination</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="4" className="px-10 py-8 border-b border-slate-50"><div className="h-14 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>)
              ) : bookings.length === 0 ? (
                <tr><td colSpan="4" className="px-10 py-24 text-center"><span className="text-[13px] font-black text-slate-200 uppercase tracking-[10px]">No active records discovered</span></td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.BookingID} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="px-10 py-8">
                      <span className="text-[14px] font-black text-primary bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 whitespace-nowrap">BK-{String(b.BookingID).padStart(4, "0")}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors truncate block" title={formatName(b.Client?.Name || b.clientName)}>{formatName(b.Client?.Name || b.clientName)}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">{new Date(b.BookingDate || b.startDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-black text-slate-900 tracking-tight truncate block" title={b.Package?.Destination || b.destination || "Custom"}>{b.Package?.Destination || b.destination || "Custom"}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate block" title={b.Package?.Name || b.packageName || "Custom Tour"}>{b.Package?.Name || b.packageName || "Custom Tour"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        (b.Status || b.status)?.toLowerCase() === "paid" || (b.Status || b.status)?.toLowerCase() === "confirmed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : (b.Status || b.status)?.toLowerCase() === "cancelled"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-blue-50 text-primary border-blue-100"
                      }`}>{b.Status || b.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
