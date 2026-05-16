import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserTransportation() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      try {
        const r = await api.get("/transportation");
        if (r.data.success && isMounted) setVehicles(r.data.data);
      } catch (err) {
        console.error("Failed to fetch transportation:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVehicles();
    return () => { isMounted = false; };
  }, []);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.PlateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ProviderName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const vehicleAssets = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop",
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Transport</h1>
          <p className="text-[14px] font-medium text-slate-400">View available transportation and vehicle options for your trip</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-full max-w-[420px] group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input
              type="text"
              placeholder="Search by plate or type..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 bg-white text-[14px] font-bold outline-none focus:border-[#007BFF] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl px-6 h-14 flex items-center gap-3 shadow-sm">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total:</span>
            <span className="text-[18px] font-black text-slate-900 tracking-tighter">{vehicles.length}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-[450px] bg-white rounded-[32px] animate-pulse border border-slate-50 shadow-sm"></div>
          ))
        ) : filteredVehicles.length === 0 ? (
          <div className="col-span-full py-32 text-center">
            <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">No vehicles found</span>
          </div>
        ) : (
          filteredVehicles.map((v, idx) => (
            <div key={v.VehicleID} className="group bg-white rounded-[40px] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
              {/* Image Section */}
              <div className="h-64 relative overflow-hidden">
                <img src={vehicleAssets[idx % vehicleAssets.length]} alt={v.Type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[2px]">Premium Fleet</span>
                  </div>
                  <h3 className="text-[24px] font-black text-white tracking-tight leading-tight line-clamp-2" title={v.Type}>{v.Type}</h3>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0 text-xl">🚐</div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Unit Model</p>
                    <p className="text-[15px] font-bold text-slate-600 truncate" title={v.VehicleModel}>{v.VehicleModel || "Standard Package Unit"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-[18px] font-black text-slate-900 tracking-tight">{v.Capacity} Pax</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Fleet ID</p>
                    <p className="text-[14px] font-bold text-slate-400 truncate">{v.PlateNumber || "T-0921"}</p>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Operator</span>
                    <p className="text-[14px] font-black text-slate-900 tracking-tight truncate max-w-[150px]">{v.ProviderName || "CHT Direct Fleet"}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">Ready</span>
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
