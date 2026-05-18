import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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

  const metrics = [
    { label: "Total Customers", value: stats?.totalCustomers ?? "0", bgColor: "bg-[#eff6ff]", iconColor: "text-blue-500" },
    { label: "Ongoing Trips", value: stats?.ongoingTrips ?? "0", bgColor: "bg-[#f0fdf4]", iconColor: "text-green-500" },
    { label: "Upcoming Trips", value: stats?.upcomingTrips ?? "0", bgColor: "bg-[#fff7ed]", iconColor: "text-orange-500" },
    { label: "Completed Trips", value: stats?.completedTrips ?? "0", bgColor: "bg-[#faf5ff]", iconColor: "text-purple-500" },
  ];

  return (
    <section className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc]">
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Dashboard
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px]">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Dashboard Overview
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Welcome back! Here's what's happening with your clients today.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-[24px] min-h-[98px]">
        {metrics.map((stat, index) => (
          <article
            key={`${stat.label}-${index}`}
            className="flex flex-row items-center justify-between w-full p-[24px_24px_24px_24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]"
          >
            <div className="flex flex-col items-start gap-[4px] flex-1">
              <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                {stat.label}
              </div>
              <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[16px] leading-[24px] whitespace-nowrap">
                {stat.value}
              </div>
            </div>
            <div className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center ${stat.bgColor} ${stat.iconColor}`}>
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 6v6l4 2"/></svg>
            </div>
          </article>
        ))}
      </div>

      <section className="flex flex-col w-full items-start gap-[30px] p-[24px_24px_24px_24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
        <h2 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[16px] leading-[16px] whitespace-nowrap">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-[12px] w-full">
          <button
            type="button"
            onClick={() => navigate("/user/clients")}
            className="h-[36px] w-[180px] flex items-center justify-center gap-[8px] bg-white border border-solid border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] rounded-[6px] transition-colors cursor-pointer"
          >
            <svg className="w-[16px] h-[16px] text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-slate-700 text-[14px] leading-[20px] whitespace-nowrap">
              Add New Customer
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/bookings/step/1")}
            className="h-[36px] w-[180px] flex items-center justify-center gap-[8px] bg-[#007bff] hover:bg-[#0069d9] text-white rounded-[6px] transition-colors cursor-pointer"
          >
            <svg className="w-[16px] h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-white text-[14px] leading-[20px] whitespace-nowrap">
              Create New Booking
            </span>
          </button>
        </div>
      </section>

      <div className="cv-table-card mt-6">
        <div className="flex w-full items-center justify-between h-[36px] mb-6">
          <h2 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[16px] leading-[16px] whitespace-nowrap">
            Recent Trips
          </h2>
          <button
            type="button"
            onClick={() => navigate("/user/bookings")}
            className="flex h-[36px] w-[84.66px] items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[6px] hover:bg-slate-50 transition-colors"
          >
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
              View All
            </span>
          </button>
        </div>
        
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Trip ID</div>
                </th>
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Customer</div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Destination</div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Package</div>
                </th>
                <th className="font-normal w-[12%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Start Date</div>
                </th>
                <th className="font-normal w-[8%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Status</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                   <tr key={i} className="border-b border-solid border-[#e2e8f0] h-[39px]"><td colSpan="6" className="px-[8px]"><div className="h-6 bg-slate-100 animate-pulse rounded w-full"/></td></tr>
                ))
              ) : bookings.length === 0 ? (
                 <tr><td colSpan="6" className="py-8 text-center text-slate-500 text-[14px]">No recent trips found</td></tr>
              ) : (
                bookings.slice(0, 5).map((trip, index) => {
                  const isLast = index === bookings.length - 1 || index === 4;
                  return (
                    <tr
                      key={trip.BookingID || index}
                      className={`hover:bg-slate-50 transition-colors h-[39px] ${isLast ? "" : "border-b border-solid border-[#e2e8f0]"}`}
                    >
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                          TRP-{String(trip.BookingID).padStart(3, "0")}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[200px]">
                          {formatName(trip.Client?.Name || trip.clientName)}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[160px]">
                          {trip.Package?.Destination || trip.destination || "Various"}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[230px]">
                          {trip.Package?.Name || trip.packageName || "Custom Tour"}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                          {new Date(trip.BookingDate || trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center ml-[8px]">
                          <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border border-solid ${getStatusClasses(trip.Status || trip.status)}`}>
                            {trip.Status || trip.status || "Pending"}
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
      </div>
    </section>
  );
}
