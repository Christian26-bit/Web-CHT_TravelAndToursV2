import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        if (res.data.success && isMounted) setBookings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBookings();
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

  const filtered = bookings.filter(
    (b) => statusFilter === "all" || b.Status?.toLowerCase() === statusFilter,
  );

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Bookings</h1>
          <p className="text-[14px] font-medium text-slate-400">Review and manage all travel reservations</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-8 h-14 flex items-center gap-4 shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF] animate-pulse"></div>
           <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total Travelers:</span>
           <span className="text-[20px] font-black text-slate-900 tracking-tighter">
             {bookings.reduce((a, b) => a + (b.PaxCount || 0), 0)}
           </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Total Bookings", value: bookings.length, color: "#007BFF", bgColor: "#EBF3FF" },
          { label: "Pending Review", value: bookings.filter(b => b.Status?.toLowerCase() === 'pending').length, color: "#F97316", bgColor: "#FFF4ED" },
          { label: "Confirmed", value: bookings.filter(b => b.Status?.toLowerCase() === 'confirmed').length, color: "#10B981", bgColor: "#ECFDF5" },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-8 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[12px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: m.bgColor, color: m.color }}>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
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
              {s === "all" ? bookings.length : bookings.filter((b) => b.Status?.toLowerCase() === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="cv-table-card">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr>
                <th className="min-w-[150px]">Booking ID</th>
                <th className="min-w-[250px]">Customer</th>
                <th className="min-w-[300px]">Tour Package</th>
                <th className="min-w-[200px]">Agent</th>
                <th className="text-right pr-12">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5" className="px-10 py-8"><div className="h-12 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-[10px]">Registry Clear</td></tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-10">
                      <span className="text-[14px] font-black text-[#007BFF] bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 whitespace-nowrap">BK-{String(b.BookingID).padStart(4, "0")}</span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 group-hover:text-[#007BFF] transition-colors truncate block" title={formatName(b.Client?.Name)}>{formatName(b.Client?.Name)}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">Verified Member</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-bold text-slate-900 truncate block" title={b.Package?.Name}>{b.Package?.Name || "Custom Tour"}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">{b.Package?.Destination} • {b.PaxCount} Pax</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 flex-shrink-0">AG</div>
                        <span className="text-[14px] font-bold text-slate-900 truncate" title={formatName(b.Employee?.Name)}>{formatName(b.Employee?.Name)}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right pr-12">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        b.Status?.toLowerCase() === 'confirmed' || b.Status?.toLowerCase() === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : b.Status?.toLowerCase() === 'pending' ? "bg-blue-50 text-[#007BFF] border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}>{b.Status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
