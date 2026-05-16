import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserTourPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
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
    return () => { isMounted = false; };
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
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Tour Packages</h1>
          <p className="text-[14px] font-medium text-slate-400">Browse our selection of premium tour packages for your next adventure</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-full max-w-[420px] group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" placeholder="Search packages..." className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 bg-white text-[14px] font-bold outline-none focus:border-[#007BFF] transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl px-6 h-14 flex items-center gap-3 shadow-sm">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total:</span>
            <span className="text-[18px] font-black text-slate-900 tracking-tighter">{packages.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-white rounded-[32px] animate-pulse border border-slate-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 border-dashed rounded-[32px] py-32 text-center">
          <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">No packages found</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((pkg, idx) => (
            <div key={pkg.PackageID} className="group bg-white rounded-[32px] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative">
              {/* Image */}
              <div className="h-64 relative overflow-hidden">
                <img src={destinationAssets[idx % destinationAssets.length]} alt={pkg.Name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[2px]">Verified Experience</span>
                  </div>
                  <h3 className="text-[24px] font-black text-white tracking-tight leading-tight line-clamp-2" title={pkg.Name}>{pkg.Name}</h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                   <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      </div>
                      <span className="text-[15px] font-bold text-slate-500 truncate block" title={pkg.Destination || "Destination"}>{pkg.Destination || "Destination"}</span>
                   </div>
                   <div className="text-right flex-shrink-0">
                      <p className="text-[20px] font-black text-[#007BFF] tracking-tight">₱{parseFloat(pkg.Price || 0).toLocaleString()}</p>
                   </div>
                </div>

                <p className="text-[14px] text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">
                  {pkg.Description || "Experience a wonderful journey with our premium curated package inclusions."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-[18px] font-black text-slate-900 tracking-tight">{pkg.Duration} Days</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-transparent group-hover:border-blue-100 group-hover:bg-white transition-all">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-[18px] font-black text-slate-900 tracking-tight">{pkg.MaxPax || 25} Pax</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Package Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {(pkg.Inclusions || "Hotels, Transport, Tours").split(",").map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-50 group-hover:text-[#007BFF] group-hover:bg-blue-50 transition-all">
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
