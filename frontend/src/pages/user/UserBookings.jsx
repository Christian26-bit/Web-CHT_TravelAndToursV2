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
    fetchBookings();
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
      const [f, m, l] = parts;
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
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Bookings</h1>
          <p className="text-[14px] font-medium text-slate-400">View and manage all your client reservations and trip statuses</p>
        </div>
        <button onClick={() => navigate("/bookings/step/1")} className="cv-btn-primary h-14 px-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Booking
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Active Bookings", value: bookings.length, color: "#007BFF", bgColor: "#EBF3FF" },
          { label: "Confirmed Trips", value: bookings.filter(b => (b.Status || b.status)?.toLowerCase() === 'confirmed' || (b.Status || b.status)?.toLowerCase() === 'paid').length, color: "#10B981", bgColor: "#ECFDF5" },
          { label: "Pending Review", value: bookings.filter(b => (b.Status || b.status)?.toLowerCase() === 'pending').length, color: "#F97316", bgColor: "#FFF4ED" },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-8 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[12px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: m.bgColor, color: m.color }}>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {["all", "confirmed", "pending", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-12 px-8 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all border cursor-pointer flex items-center gap-4 ${
              statusFilter === s ? "bg-[#007BFF] border-[#007BFF] text-white shadow-lg shadow-[#007BFF]/20" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
            }`}
          >
            <span>{s}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] ${statusFilter === s ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"}`}>
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
              <tr>
                <th className="min-w-[180px]">Booking ID</th>
                <th className="min-w-[250px]">Customer Name</th>
                <th className="min-w-[250px]">Tour Package</th>
                <th className="min-w-[180px]">Trip Date</th>
                <th className="min-w-[150px]">Status</th>
                <th className="text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6" className="px-10 py-8"><div className="h-12 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-[10px]">No bookings found</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-10">
                      <span className="text-[14px] font-black text-[#007BFF] bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 whitespace-nowrap">BK-{String(b.BookingID).padStart(4, "0")}</span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 group-hover:text-[#007BFF] transition-colors truncate" title={formatName(b.Client?.Name || b.clientName)}>{formatName(b.Client?.Name || b.clientName)}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Passenger</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-bold text-slate-900 truncate" title={b.Package?.Name || b.packageName}>{b.Package?.Name || b.packageName || "Custom Tour"}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{b.PaxCount || b.pax} Person(s)</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <span className="text-[14px] font-bold text-slate-900 whitespace-nowrap">
                        {new Date(b.BookingDate || b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        (b.Status || b.status)?.toLowerCase() === "confirmed" || (b.Status || b.status)?.toLowerCase() === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : (b.Status || b.status)?.toLowerCase() === "pending" ? "bg-blue-50 text-[#007BFF] border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}>{b.Status || b.status}</span>
                    </td>
                    <td className="px-10 py-10 text-right pr-12">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => {
                          const token = localStorage.getItem('token');
                          window.open(`${api.defaults.baseURL}/bookings/${b.BookingID}/invoice?token=${token}`, '_blank');
                        }} className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007BFF] hover:shadow-lg transition-all cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(b.BookingID)} className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-lg transition-all cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
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
