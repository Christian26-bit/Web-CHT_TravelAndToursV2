import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserJourneys() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const formatName = (fullName) => {
    if (!fullName) return "—";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, m, l] = parts;
      const mI = m ? `${m.charAt(0).toUpperCase()}.` : "";
      return `${l.toUpperCase()}, ${f} ${mI}`.trim();
    }
    return fullName;
  };

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await api.get("/journeys");
        if (res.data.success) {
          setBookings(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedBooking(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch journeys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneys();
  }, []);

  const filteredBookings = bookings.filter((b) =>
    formatName(b.Client?.Name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    b.Package?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
        <div>
          <h1 className="cv-title-display text-slate-900 mb-4">Client Lifecycle</h1>
          <p className="text-[16px] font-medium text-slate-500 tracking-tight max-w-2xl leading-relaxed">
            Operational oversight of the end-to-end service roadmap for every active reservation in the CHT network.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-8 h-14 flex items-center gap-4 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF] animate-pulse"></div>
            <span className="text-[12px] font-black uppercase tracking-[3px] text-slate-400">Total Lifecycles:</span>
            <span className="text-[20px] font-black text-slate-900 tracking-tighter">{bookings.length} Tracked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" placeholder="Query active roadmap..." className="cv-input pl-14" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white rounded-[32px] border border-slate-100 animate-pulse" />)
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-[40px] border-dashed">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">No active lifecycles</span>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <button
                  key={b.BookingID}
                  onClick={() => setSelectedBooking(b)}
                  className={`w-full text-left p-6 rounded-[32px] border transition-all duration-500 flex items-center gap-5 group relative overflow-hidden ${
                    selectedBooking?.BookingID === b.BookingID ? "bg-white border-[#007BFF] shadow-2xl shadow-[#007BFF]/10 scale-[1.02]" : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-[18px] font-black transition-all duration-500 ${
                    selectedBooking?.BookingID === b.BookingID ? "bg-[#007BFF] text-white shadow-xl shadow-[#007BFF]/30" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                  }`}>
                    {b.Client?.Name?.split('|').filter(Boolean).map(n => n[0]).join('') || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[16px] font-black text-slate-900 truncate tracking-tighter mb-1">{formatName(b.Client?.Name)}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{b.Package?.Name || "Custom"}</p>
                  </div>
                  {b.ClientJourneys?.some((j) => j.Status === "CURRENT") && <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF] animate-pulse" />}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedBooking ? (
            <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl shadow-slate-200/40 p-12 min-h-[700px] animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#007BFF]" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10 relative z-10">
                <div className="flex gap-8 items-center">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center text-3xl font-black text-[#007BFF] shadow-inner border border-slate-100">
                    {selectedBooking.Client?.Name?.split('|').filter(Boolean).map(n => n[0]).join('') || "C"}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[11px] font-black text-[#007BFF] uppercase tracking-[4px]">Operational Roadmap</span>
                      <div className="h-px w-12 bg-blue-100" />
                    </div>
                    <h2 className="text-[40px] font-black text-slate-900 tracking-tighter leading-none mb-4">{formatName(selectedBooking.Client?.Name)}</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{selectedBooking.Package?.Name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Authorized BK-{selectedBooking.BookingID}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="px-6 py-3 bg-[#007BFF] text-white rounded-2xl shadow-xl shadow-[#007BFF]/20 text-[11px] font-black uppercase tracking-[2px] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Status: Active Phase</span>
                  </div>
                </div>
              </div>

              <div className="relative pl-20 space-y-24 pb-12">
                <div className="absolute left-[39px] top-10 bottom-24 w-px bg-slate-100" />
                {selectedBooking.ClientJourneys?.length > 0 ? (
                  selectedBooking.ClientJourneys.map((m, idx) => (
                    <div key={idx} className="relative group/milestone animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className={`absolute -left-[68px] top-0 w-20 h-20 rounded-[28px] border-[8px] border-white z-10 flex items-center justify-center shadow-xl transition-all duration-500 group-hover/milestone:scale-110 ${
                        m.Status === 'COMPLETED' ? 'bg-[#007BFF] text-white shadow-blue-200' : m.Status === 'CURRENT' ? 'bg-white border-[#007BFF] text-[#007BFF] shadow-blue-100' : 'bg-slate-50 text-slate-200 shadow-none'
                      }`}>
                        {m.Status === 'COMPLETED' ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        ) : (
                          <span className="text-[20px] font-black">{idx + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
                        <div className="max-w-[75%] space-y-4">
                          <div className="flex items-center gap-4">
                            <h4 className={`text-[28px] font-black tracking-tighter transition-colors duration-500 ${m.Status === 'PENDING' ? 'text-slate-200' : 'text-slate-900'}`}>{m.Title}</h4>
                            {m.Status === 'CURRENT' && <span className="px-3 py-1 rounded-lg bg-blue-50 text-[#007BFF] text-[10px] font-black uppercase tracking-widest animate-pulse border border-blue-100">Active Stage</span>}
                          </div>
                          <p className="text-[17px] font-medium text-slate-500 leading-relaxed max-w-2xl">{m.Description}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1 pt-2 shrink-0">
                          <span className={`text-[14px] font-black tracking-tighter px-4 py-1.5 rounded-xl transition-colors ${m.Status === 'PENDING' ? 'bg-slate-50 text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
                            {m.Timestamp ? new Date(m.Timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'PROTOCOL PENDING'}
                          </span>
                          {m.Timestamp && <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">{new Date(m.Timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-40 bg-slate-50/50 rounded-[40px] border border-slate-100 border-dashed">
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-[6px]">Roadmap authorization pending for this entity.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[700px] flex flex-col items-center justify-center bg-white rounded-[48px] border-2 border-dashed border-slate-200 group relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-28 h-28 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 text-slate-200 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-[24px] font-black text-slate-900 mb-2 tracking-tighter">Lifecycle Intelligence</h3>
              <p className="text-[11px] font-black text-slate-400 max-w-[320px] mx-auto uppercase tracking-[4px] leading-relaxed text-center">Authorize a client identity from the sidebar to initialize lifecycle oversight.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
