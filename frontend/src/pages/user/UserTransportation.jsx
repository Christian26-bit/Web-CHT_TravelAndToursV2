import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserTransportation() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    /**
     * Fetches details of active vehicles, seat capacities, and fleet assets
     * from the backend server to populate the transportation catalog.
     */
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
    return () => {
      isMounted = false;
    };
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Transportation
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Transportation Fleet
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Browse and audit available fleet assets, seat capacities, and shuttle operators.
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
            placeholder="Search by plate number, provider, or vehicle type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex h-10 items-center gap-2 px-4 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b]">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
            Total:
          </span>
          <span className="text-[16px] font-bold text-slate-900">
            {vehicles.length}
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
        ) : filteredVehicles.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white border border-solid border-[#e2e8f0] rounded-[12px] w-full">
            <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">
              No vehicles found
            </span>
          </div>
        ) : (
          filteredVehicles.map((v, idx) => (
            <div
              key={v.VehicleID}
              className="group bg-white rounded-[12px] overflow-hidden border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col h-full hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={vehicleAssets[idx % vehicleAssets.length]}
                  alt={v.Type}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#007bff] animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                      Active Unit
                    </span>
                  </div>
                  <h3
                    className="font-['Arimo-Regular',Helvetica] font-medium text-white text-[18px] leading-[26px] tracking-tight line-clamp-1"
                    title={v.Type}
                  >
                    {v.Type}
                  </h3>
                </div>
              </div>

              <div className="p-[20px] flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[#f1f5f9]">
                  <div className="w-10 h-10 rounded-[8px] bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0 text-lg">
                    🚐
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Unit Model
                    </p>
                    <p
                      className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[14px] leading-[20px] truncate"
                      title={v.VehicleModel}
                    >
                      {v.VehicleModel || "Standard Package Unit"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#f8fafc] rounded-[8px] p-3 border border-[#cbd5e1]/30">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Capacity
                    </p>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[15px] leading-[20px]">
                      {v.Capacity} Pax
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-[8px] p-3 border border-[#cbd5e1]/30">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Bus Number
                    </p>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[14px] leading-[20px] truncate">
                      {v.PlateNumber || "T-0921"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div>
                    <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider block mb-0.5">
                      Operator
                    </span>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[13px] leading-[18px] truncate max-w-[140px]">
                      {v.ProviderName || "CHT Direct Fleet"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      Ready
                    </span>
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
