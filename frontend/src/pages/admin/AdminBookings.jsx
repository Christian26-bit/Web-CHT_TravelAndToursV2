import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    /**
     * Fetches all registered booking transactions from backend endpoints.
     * Evaluates local mount state to prevent memory leaks on component unmount.
     */
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

  /**
   * Reformats the standard pipe-separated database client name into a natural,
   * human-readable presentation format (First Last).
   */
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start p-8 gap-8 bg-[#f8fafc] animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-[14px] text-[#1e293b] font-normal leading-[20px]">
            <span className="text-[#64748b]">Admin</span>
            <span className="text-[#cbd5e1] font-light">/</span>
            <span>Bookings</span>
          </div>
          <h1 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[32px] tracking-[-0.02em] leading-[40px] mt-1">
            Bookings
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px]">
            Review and manage all travel reservations
          </p>
        </div>
        <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[12px_24px] flex items-center gap-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <div className="w-2 h-2 rounded-full bg-[#007bff] animate-pulse"></div>
          <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[12px] uppercase tracking-wider">
            Total Travelers:
          </span>
          <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[18px]">
            {bookings.reduce((a, b) => a + (b.PaxCount || 0), 0)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Bookings
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {bookings.length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#eff6ff] text-[#007bff]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Pending Review
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {bookings.filter(b => b.Status?.toLowerCase() === 'pending').length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#fff7ed] text-[#f97316]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Confirmed
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {bookings.filter(b => b.Status?.toLowerCase() === 'confirmed').length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#f0fdf4] text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </article>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar w-full">
        {["all", "confirmed", "pending", "cancelled"].map((s) => {
          const count = s === "all" ? bookings.length : bookings.filter((b) => b.Status?.toLowerCase() === s).length;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-9 px-4 rounded-[6px] text-[13px] font-medium tracking-wide transition-all border cursor-pointer flex items-center gap-2 ${
                active
                  ? "bg-[#007bff] border-[#007bff] text-white shadow-sm"
                  : "bg-white text-[#64748b] border-[#cbd5e1] hover:border-[#94a3b8] hover:text-[#1e293b]"
              }`}
            >
              <span className="capitalize">{s}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Booking ID
                  </div>
                </th>
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Customer
                  </div>
                </th>
                <th className="font-normal w-[30%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Tour Package
                  </div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Agent
                  </div>
                </th>
                <th className="font-normal w-[10%] text-right pr-2">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider text-right">
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-solid border-[#e2e8f0] h-[39px]">
                    <td colSpan="5" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 text-[14px]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50 transition-colors h-[48px]">
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] ml-[8px]">
                        BK-{String(b.BookingID).padStart(4, "0")}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] ml-[8px] truncate max-w-[220px]" title={formatName(b.Client?.Name)}>
                        {formatName(b.Client?.Name)}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] ml-[8px] truncate max-w-[260px]" title={b.Package?.Name}>
                        {b.Package?.Name || "Custom Tour"} <span className="text-[#cbd5e1] mx-1.5">•</span> <span className="text-slate-500">{b.PaxCount} Pax</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5 ml-[8px]">
                        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-[10px] font-black text-[#007BFF] border border-blue-100 shrink-0">
                          AG
                        </div>
                        <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] truncate" title={formatName(b.Employee?.Name)}>
                          {formatName(b.Employee?.Name)}
                        </span>
                      </div>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex justify-end items-center">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium uppercase tracking-wider border whitespace-nowrap ${
                          b.Status?.toLowerCase() === 'confirmed' || b.Status?.toLowerCase() === 'paid' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : b.Status?.toLowerCase() === 'pending' 
                              ? "bg-amber-50 text-amber-600 border-amber-100" 
                              : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                          {b.Status || "Pending"}
                        </span>
                      </div>
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
