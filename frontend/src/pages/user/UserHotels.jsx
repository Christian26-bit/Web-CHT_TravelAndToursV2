import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchHotels = async () => {
      try {
        const r = await api.get("/hotels");
        if (r.data.success && isMounted) setHotels(r.data.data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => { isMounted = false; };
  }, []);

  const filteredHotels = hotels.filter(
    (h) =>
      h.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.Address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hotelAssets = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Hotels</h1>
          <p className="text-[14px] font-medium text-slate-400">Explore our partner hotels and resorts available for your trip</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-full max-w-[420px] group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 bg-white text-[14px] font-bold outline-none focus:border-[#007BFF] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl px-6 h-14 flex items-center gap-3 shadow-sm">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total:</span>
            <span className="text-[18px] font-black text-slate-900 tracking-tighter">{hotels.length}</span>
          </div>
        </div>
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-[500px] bg-white rounded-[32px] animate-pulse border border-slate-50 shadow-sm"></div>
          ))
        ) : filteredHotels.length === 0 ? (
          <div className="col-span-full py-32 text-center">
            <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">No hotels found</span>
          </div>
        ) : (
          filteredHotels.map((h, idx) => (
            <div key={h.accommodationId} className="group bg-white rounded-[40px] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
              {/* Image Section */}
              <div className="h-64 relative overflow-hidden">
                <img src={hotelAssets[idx % hotelAssets.length]} alt={h.Name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[2px]">Premium Partner</span>
                  </div>
                  <h3 className="text-[24px] font-black text-white tracking-tight leading-tight line-clamp-2" title={h.Name}>{h.Name}</h3>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-[15px] font-bold text-slate-600 truncate" title={h.Address}>{h.Address}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Room Selection</h4>
                  <span className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-blue-50 group-hover:text-[#007BFF] group-hover:border-blue-100 transition-all">
                    {h.DefaultRoomType || "Executive Suite"}
                  </span>
                </div>

                <p className="text-[15px] text-slate-400 font-medium leading-relaxed italic mb-10 line-clamp-3">
                  "{h.Amenities || "Full concierge service, high-speed Wi-Fi, and standard luxury amenities included for all our esteemed guests."}"
                </p>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Property Status</span>
                    <p className="text-[18px] font-black text-emerald-500 tracking-tight">Available Now</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#007BFF] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#007BFF]/20 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
