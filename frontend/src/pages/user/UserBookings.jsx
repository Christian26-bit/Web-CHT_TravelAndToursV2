import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get("/bookings_list");
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleDelete = async (id) => {
    try {
      await api.post("/bookings_delete", { id });
      setDeleteConfirm(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete.");
      setDeleteConfirm(null);
    }
  };

  const formatName = (fullName) => {
    if (!fullName) return "Unknown";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, , l] = parts;
      return `${f} ${l}`;
    }
    return fullName;
  };

  const filtered = bookings.filter(
    (b) =>
      statusFilter === "all" ||
      (b.Status || b.status)?.toLowerCase() === statusFilter,
  );

  return (
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      
      {/* Top Breadcrumb & Title Area */}
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Bookings
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Bookings Directory
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Audit reservations, monitor live tour status tracking, and manage client itineraries.
          </p>
        </div>
        <button
          onClick={() => navigate("/bookings/step/1")}
          className="flex h-[36px] items-center justify-center gap-[8px] px-[16px] py-[8px] bg-[#007bff] hover:bg-[#0069d9] text-white rounded-[6px] transition-colors cursor-pointer shadow-sm"
        >
          <svg className="w-[16px] h-[16px] text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] leading-[20px] whitespace-nowrap">
            New Booking
          </span>
        </button>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
        {[
          {
            label: "Active Bookings",
            value: bookings.length,
            change: "Total",
            label2: "registered",
            isPositive: true,
            bgColor: "bg-blue-500/10",
            color: "text-blue-500",
            icon: (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            )
          },
          {
            label: "Confirmed Trips",
            value: bookings.filter(b => (b.Status || b.status)?.toLowerCase() === 'confirmed' || (b.Status || b.status)?.toLowerCase() === 'paid').length,
            change: "Active",
            label2: "confirmed",
            isPositive: true,
            bgColor: "bg-emerald-500/10",
            color: "text-emerald-500",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          {
            label: "Pending Review",
            value: bookings.filter(b => (b.Status || b.status)?.toLowerCase() === 'pending').length,
            change: "Review",
            label2: "pending",
            isPositive: false,
            bgColor: "bg-amber-500/10",
            color: "text-amber-500",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        ].map((stat, idx) => (
          <article
            key={idx}
            className="flex w-full min-w-[240px] items-center justify-between p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col items-start gap-[8px] min-w-0 flex-1">
              <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap font-medium">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-[8px] w-full min-w-0">
                <span className="font-['Arimo-Regular',Helvetica] text-[#1e293b] text-[20px] font-bold leading-[28px] truncate">
                  {stat.value}
                </span>
                <div className="flex items-center gap-[2px] shrink-0 ml-2">
                  <span className={`font-['Arimo-Regular',Helvetica] font-normal text-[12px] leading-[16px] whitespace-nowrap ${stat.isPositive ? 'text-[#00c950]' : 'text-amber-500'}`}>
                    {stat.change}
                  </span>
                  <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#cbd5e1] text-[12px] leading-[16px] whitespace-nowrap">
                    {stat.label2}
                  </span>
                </div>
              </div>
            </div>
            <div className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shrink-0 ml-4 ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
          </article>
        ))}
      </div>

      {/* Status Filter Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar w-full">
        {["all", "confirmed", "pending", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-[32px] px-[12px] rounded-[6px] text-[13px] font-normal transition-all border cursor-pointer flex items-center gap-2 ${
              statusFilter === s
                ? "bg-[#007bff] border-[#007bff] text-white shadow-sm font-medium"
                : "bg-white text-slate-500 border-[#e2e8f0] hover:bg-slate-50"
            }`}
          >
            <span className="capitalize">{s}</span>
            <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] ${statusFilter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {s === "all" ? bookings.length : bookings.filter((b) => (b.Status || b.status)?.toLowerCase() === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="cv-table-card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Booking ID</div>
                </th>
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Customer Name</div>
                </th>
                <th className="font-normal w-[30%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Tour Package</div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Trip Date</div>
                </th>
                <th className="font-normal w-[10%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Status</div>
                </th>
                <th className="font-normal w-[5%] text-right pr-2">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px]">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-solid border-[#e2e8f0] h-[39px]">
                    <td colSpan="6" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-[14px]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                        BK-{String(b.BookingID).padStart(4, "0")}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[220px]" title={formatName(b.Client?.Name || b.clientName)}>
                        {formatName(b.Client?.Name || b.clientName)}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[220px]" title={b.Package?.Name || b.packageName}>
                        {b.Package?.Name || b.packageName || "Custom Tour"} <span className="text-[#cbd5e1] mx-1">•</span> {b.PaxCount || b.pax} Pax
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                        {new Date(b.BookingDate || b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border ${
                          (b.Status || b.status)?.toLowerCase() === "confirmed" || (b.Status || b.status)?.toLowerCase() === "paid" 
                            ? "bg-blue-50 text-[#007bff] border-blue-100" 
                            : (b.Status || b.status)?.toLowerCase() === "pending" 
                              ? "bg-amber-50 text-amber-600 border-amber-100" 
                              : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>{b.Status || b.status || "Pending"}</span>
                      </div>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => {
                          const token = localStorage.getItem('token');
                          window.open(`${api.defaults.baseURL}/bookings/${b.BookingID}/invoice?token=${token}`, '_blank');
                        }} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007BFF] transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(b.BookingID)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[32px] p-12 shadow-2xl max-w-md w-full mx-4 border border-slate-200">
            <h3 className="text-[24px] font-black text-slate-900 mb-4 tracking-tighter">Delete Booking?</h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Are you sure you want to remove this booking from the system?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-900 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all">Discard</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-14 rounded-2xl bg-red-600 text-white text-[13px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 cursor-pointer transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
