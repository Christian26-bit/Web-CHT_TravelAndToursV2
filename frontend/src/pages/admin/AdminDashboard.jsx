import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const getStatusClasses = (status) => {
    if (!status) return "bg-slate-50 text-slate-500 border-slate-100";
    const s = status.toLowerCase();
    if (s === "ongoing" || s === "confirmed" || s === "paid" || s === "confirm") {
      return "bg-blue-50 text-[#007bff] border-blue-100";
    }
    if (s === "upcoming" || s === "pending") {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const dashboardStats = [
    { title: "Total Customers", value: stats?.totalClients ?? "...", bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "Ongoing Trips", value: stats?.totalBookings ?? "...", bgColor: "bg-green-50", iconColor: "text-green-500" },
    { title: "Monthly Revenue", value: stats?.totalRevenue ? `₱${(stats.totalRevenue/1000).toFixed(0)}k` : "...", bgColor: "bg-orange-50", iconColor: "text-orange-500" },
    { title: "Completed Trips", value: "156", bgColor: "bg-purple-50", iconColor: "text-purple-500" },
  ];

  return (
    <section
      className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-white"
      aria-labelledby="dashboard-overview-title"
    >
      <div className="w-full [font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">
        Dashboard
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1
            id="dashboard-overview-title"
            className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-2xl tracking-[0] leading-9 whitespace-nowrap"
          >
            Dashboard Overview
          </h1>
          <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-500 text-base tracking-[0] leading-6 whitespace-nowrap">
            Welcome back! Here&apos;s what&apos;s happening with your travel agency today.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-6">
        {dashboardStats.map((stat, index) => (
          <article
            key={`${stat.title}-${index}`}
            className="flex flex-row items-center w-full px-6 py-6 bg-white rounded-xl border border-solid border-slate-200 shadow-sm"
          >
            <div className="flex flex-col items-start gap-1 flex-1">
              <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                {stat.title}
              </div>
              <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-base tracking-[0] leading-6 whitespace-nowrap">
                {stat.value}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.iconColor}`}>
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 6v6l4 2"/></svg>
            </div>
          </article>
        ))}
      </div>

      <section
        className="flex flex-col w-full items-start gap-[30px] px-6 py-6 bg-white rounded-xl border border-solid border-slate-200 shadow-sm"
        aria-labelledby="quick-actions-title"
      >
        <h2
          id="quick-actions-title"
          className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-base tracking-[0] leading-4 whitespace-nowrap"
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4 w-full">
          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="h-9 px-4 flex items-center justify-center gap-2 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-md transition-colors cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
              Add New Customer
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="flex h-9 items-center justify-center gap-2 px-4 bg-white rounded-md border border-solid border-slate-200 text-slate-700 focus-visible:outline-none hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-700 text-sm tracking-[0] leading-5 whitespace-nowrap">
              View Reports
            </span>
          </button>
        </div>
      </section>

      <section
        className="flex flex-col w-full items-start gap-[30px] px-6 py-6 bg-white rounded-xl border border-solid border-slate-200 shadow-sm overflow-hidden"
        aria-labelledby="recent-trips-title"
      >
        <div className="flex w-full items-center justify-between">
          <h2
            id="recent-trips-title"
            className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-base tracking-[0] leading-4 whitespace-nowrap"
          >
            Recent Trips
          </h2>
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="flex h-9 items-center justify-center gap-2 px-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 hover:bg-slate-50 transition-colors"
          >
            <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">
              View All
            </span>
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-solid border-slate-200">
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Trip ID</div>
                </th>
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Customer</div>
                </th>
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Destination</div>
                </th>
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Package</div>
                </th>
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Start Date</div>
                </th>
                <th className="py-3 px-2 font-normal">
                  <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">Status</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                   <tr key={i} className="border-b border-solid border-slate-200 last:border-0"><td colSpan="6" className="py-4 px-2"><div className="h-6 bg-slate-100 animate-pulse rounded w-full"/></td></tr>
                ))
              ) : !stats?.recentBookings?.length ? (
                 <tr><td colSpan="6" className="py-8 text-center text-slate-500 text-sm">No recent trips found</td></tr>
              ) : (
                stats.recentBookings.slice(0, 5).map((trip, index) => {
                  const isLast = index === stats.recentBookings.length - 1 || index === 4;
                  return (
                    <tr
                      key={trip.BookingID || index}
                      className={`hover:bg-slate-50 transition-colors ${isLast ? "" : "border-b border-solid border-slate-200"}`}
                    >
                      <td className="py-3 px-2">
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">
                          TRP-{String(trip.BookingID).padStart(3, "0")}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap truncate max-w-[180px]">
                          {formatName(trip.Client?.Name)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap truncate max-w-[150px]">
                          {trip.Package?.Destination || "Various"}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap truncate max-w-[200px]">
                          {trip.Package?.Name || "Custom Package"}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 text-sm tracking-[0] leading-5 whitespace-nowrap">
                          {new Date(trip.BookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border border-solid ${getStatusClasses(trip.Status)}`}>
                            {trip.Status || "Pending"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
