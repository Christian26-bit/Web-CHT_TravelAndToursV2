import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserTourPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    /**
     * Retrieves the curated, live list of available tour packages and adventure
     * itineraries from the backend catalog database.
     */
    const fetchPackages = async () => {
      try {
        const r = await api.get("/tour-packages");
        if (r.data.success && isMounted) setPackages(r.data.data);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPackages();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = packages.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.Name?.toLowerCase().includes(q) ||
      p.Destination?.toLowerCase().includes(q)
    );
  });

  const destinationAssets = [
    "https://images.unsplash.com/photo-1540202404-a2f29036bb52?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000",
  ];

  return (
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Tour Packages
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Tour Packages
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Explore our collection of custom and verified travel experiences
            curated for your next adventure.
          </p>
        </div>
      </header>

      <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] flex items-center justify-between gap-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full mb-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-[16px] w-[16px] text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-400"
            placeholder="Search packages by destination or package name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex h-10 items-center gap-2 px-4 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b]">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
            Total:
          </span>
          <span className="text-[16px] font-bold text-slate-900">
            {packages.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] bg-white rounded-[12px] animate-pulse border border-[#e2e8f0] shadow-sm"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] py-32 text-center w-full">
          <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">
            No packages found
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filtered.map((pkg, idx) => (
            <div
              key={pkg.PackageID}
              className="group bg-white rounded-[12px] overflow-hidden border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col relative hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={destinationAssets[idx % destinationAssets.length]}
                  alt={pkg.Name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c950] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                      Verified Experience
                    </span>
                  </div>
                  <h3
                    className="font-['Arimo-Regular',Helvetica] font-medium text-white text-[18px] leading-[26px] tracking-tight line-clamp-1"
                    title={pkg.Name}
                  >
                    {pkg.Name}
                  </h3>
                </div>
              </div>

              <div className="p-[20px] flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-[6px] bg-[#eff6ff] flex items-center justify-center text-[#007bff] flex-shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </div>
                    <span
                      className="font-['Arimo-Regular',Helvetica] font-bold text-[#64748b] text-[14px] leading-[20px] truncate block"
                      title={pkg.Destination || "Destination"}
                    >
                      {pkg.Destination || "Destination"}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#007bff] text-[18px] leading-[24px] tracking-tight">
                      ₱{parseFloat(pkg.Price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="font-['Arimo-Regular',Helvetica] text-[13px] leading-[20px] text-[#64748b] mb-4 line-clamp-2">
                  {pkg.Description ||
                    "Experience a wonderful journey with our premium curated package inclusions."}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#f8fafc] rounded-[8px] p-3 border border-[#cbd5e1]/30">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Duration
                    </p>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[15px] leading-[20px]">
                      {pkg.Duration} Days
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-[8px] p-3 border border-[#cbd5e1]/30">
                    <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-0.5">
                      Max Capacity
                    </p>
                    <p className="font-['Arimo-Regular',Helvetica] font-bold text-[#1e293b] text-[15px] leading-[20px]">
                      {pkg.MaxPax || 25} Pax
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#f1f5f9]">
                  <h4 className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[10px] leading-[14px] uppercase tracking-wider mb-2">
                    Package Features
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(pkg.Inclusions || "Hotels, Transport, Tours")
                      .split(",")
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#f8fafc] text-[#64748b] rounded-[4px] text-[10px] font-bold uppercase tracking-wider border border-[#e2e8f0]"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
