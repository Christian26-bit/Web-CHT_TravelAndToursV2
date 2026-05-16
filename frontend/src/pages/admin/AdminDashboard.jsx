import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    loadData();
    return () => { isMounted = false; };
  }, []);

  const formatName = (fullName) => {
    if (!fullName) return "—";
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
      value: stats?.totalClients ?? "248",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
      bgColor: "#EBF3FF",
      iconColor: "#007BFF"
    },
    {
      label: "Ongoing Trips",
      value: stats?.totalBookings ?? "12",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
      bgColor: "#ECFDF5",
      iconColor: "#10B981"
    },
    {
      label: "Monthly Revenue",
      value: stats?.totalRevenue ? `₱${(stats.totalRevenue/1000).toFixed(0)}k` : "₱28k",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>,
      bgColor: "#FFF4ED",
      iconColor: "#F97316"
    },
    {
      label: "Completed Trips",
      value: "156",
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
      bgColor: "#F5F3FF",
      iconColor: "#7C3AED"
    }
  ];

  return (
    <div className="cv-main-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
        <div>
          <h1 className="cv-title-display text-slate-900 mb-4">Dashboard Overview</h1>
          <p className="text-[16px] font-medium text-slate-500 tracking-tight">Welcome back! Here's what's happening with your travel agency today.</p>
        </div>
        <Card className="px-10 h-16 flex items-center gap-4 shadow-sm border-slate-100 rounded-[0.75rem]">
           <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
           <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">System Status:</span>
           <span className="text-[20px] font-black text-slate-900 tracking-tighter">Operational</span>
        </Card>
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
        <h3 className="text-[16px] font-black text-slate-900 mb-8">Management Links</h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate("/admin/clients")} className="h-14 px-10 rounded-[0.75rem] text-[13px] font-black">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             Customer Registry
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/bookings")} className="h-14 px-10 rounded-[0.75rem] border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm text-[13px] font-black">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             Booking Manager
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/employees")} className="h-14 px-10 rounded-[0.75rem] border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm text-[13px] font-black">
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 013 11c0-5.523 4.477-10 10-10s10 4.477 10 10a9.985 9.985 0 01-5.138 8.735" /></svg>
             Staff Records
          </Button>
        </div>
      </Card>

      {/* Recent Trips */}
      <Card className="shadow-sm border-slate-100 overflow-hidden rounded-[1.5rem]">
        <div className="px-10 py-10 flex justify-between items-center border-b border-slate-50">
          <h2 className="text-[20px] font-black text-slate-900">Recent Activity</h2>
          <Button variant="ghost" onClick={() => navigate("/admin/bookings")} className="text-[13px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">View All</Button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Trip ID</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Customer</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[250px]">Tour Package</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Start Date</th>
                <th className="bg-slate-50 px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest pr-12">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}><td colSpan="5" className="px-10 py-8 border-b border-slate-50"><div className="h-12 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>
                ))
              ) : !stats?.recentBookings?.length ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-[10px]">No active trips</td></tr>
              ) : (
                stats.recentBookings.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                    <td className="px-10 py-10">
                      <span className="text-[14px] font-black text-primary bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 whitespace-nowrap">TRP-{String(b.BookingID).padStart(3, "0")}</span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 group-hover:text-primary transition-colors truncate block" title={formatName(b.Client?.Name)}>{formatName(b.Client?.Name)}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">Passenger</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-bold text-slate-900 truncate block" title={b.Package?.Name || b.Package?.Destination}>{b.Package?.Name || "Custom Trip"}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">{b.Package?.Destination || "Various Locations"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-[14px] font-bold text-slate-900 whitespace-nowrap">{new Date(b.BookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-10 py-10 text-right pr-12">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        b.Status?.toLowerCase() === 'confirmed' || b.Status?.toLowerCase() === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : b.Status?.toLowerCase() === 'pending' ? "bg-blue-50 text-primary border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}>
                        {b.Status}
                      </span>
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
