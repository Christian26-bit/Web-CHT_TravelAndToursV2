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
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHotels = hotels.filter(
    (h) =>
      h.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.Address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const parseAmenities = (amenitiesStr) => {
    if (!amenitiesStr) return [];
    return amenitiesStr.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  };

  const hotelAssets = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Hotels
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Hotel & Resort Partners
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Explore our partner hotels and premium resort properties available for your travel packages.
          </p>
        </div>
      </header>

      <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] flex items-center justify-between gap-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full mb-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-[16px] w-[16px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-400"
            placeholder="Search by hotel name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex h-10 items-center gap-2 px-4 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b]">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
            Total:
          </span>
          <span className="text-[16px] font-bold text-slate-900">
            {hotels.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {loading ? (
          [1, 2, 3].map((i) => (
             <div
               key={i}
               className="h-[400px] bg-white rounded-[12px] animate-pulse border border-[#e2e8f0] shadow-sm"
             ></div>
          ))
        ) : filteredHotels.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white border border-solid border-[#e2e8f0] rounded-[12px] w-full">
            <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">
              No hotels found
            </span>
          </div>
        ) : (
          filteredHotels.map((h, idx) => (
            <div
              key={h.accommodationId}
              className="group bg-white rounded-[12px] overflow-hidden border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col h-full hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={hotelAssets[idx % hotelAssets.length]}
                  alt={h.Name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                      Available Room
                    </span>
                  </div>
                  <h3
                    className="font-['Arimo-Regular',Helvetica] font-medium text-white text-[18px] leading-[26px] tracking-tight line-clamp-1"
                    title={h.Name}
                  >
                    {h.Name}
                  </h3>
                </div>
              </div>

              <div className="p-[20px] flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[#f1f5f9]">
                  <div className="w-10 h-10 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p
                      className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[14px] leading-[20px] truncate"
                      title={h.Address}
                    >
                      {h.Address}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-2">
                    Room Type Option
                  </h4>
                  <span className="inline-flex px-3 py-1 bg-[#f8fafc] border border-[#cbd5e1]/30 text-[#1e293b] rounded-[6px] text-[12px] font-medium">
                    {h.DefaultRoomType || "Executive Suite"}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-2">
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-[6px]">
                    {parseAmenities(h.Amenities).length > 0 ? (
                      parseAmenities(h.Amenities).map((amenity, idx) => (
                        <div key={idx} className="bg-[#eff6ff] px-[9px] py-[3px] rounded-[6px] border border-blue-100">
                          <span className="text-[12px] text-[#007bff] leading-[16px] font-medium">{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#64748b] italic">Full concierge service, high-speed Wi-Fi, and standard luxury amenities included.</span>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div>
                    <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider block mb-0.5">
                      Property Status
                    </span>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-emerald-500 text-[14px] leading-[20px]">
                      Available Now
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-[6px] bg-slate-50 flex items-center justify-center text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
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
