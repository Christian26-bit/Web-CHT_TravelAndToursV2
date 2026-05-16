import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminTourPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    destination: "",
    duration: 4,
    maxPax: 20,
    price: "",
    description: "",
    inclusions: "",
    category: "Cultural",
    isActive: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/admin/packages");
      if (res.data.success) setPackages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filtered = packages.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.Name?.toLowerCase().includes(q) ||
      p.Destination?.toLowerCase().includes(q)
    );
  });

  const resetForm = () =>
    setFormData({
      id: "",
      name: "",
      destination: "",
      duration: 4,
      maxPax: 20,
      price: "",
      description: "",
      inclusions: "",
      category: "Cultural",
      isActive: true,
    });

  const openEdit = (pkg) => {
    setFormData({
      id: pkg.PackageID,
      name: pkg.Name,
      destination: pkg.Destination || "",
      duration: pkg.Duration || 4,
      maxPax: pkg.MaxPax || 20,
      price: pkg.Price || "",
      description: pkg.Description || "",
      inclusions: pkg.Inclusions || "",
      category: pkg.Category || "Cultural",
      isActive: pkg.IsActive,
    });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/packages", {
        id: formData.id || undefined,
        name: formData.name,
        destination: formData.destination,
        duration: formData.duration,
        maxPax: formData.maxPax,
        price: formData.price,
        description: formData.description,
        inclusions: formData.inclusions,
        category: formData.category,
        isActive: formData.isActive,
      });
      setFormOpen(false);
      resetForm();
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save package.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/packages/${id}`);
      setDeleteConfirm(null);
      fetchPackages();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete.");
      setDeleteConfirm(null);
    }
  };

  const stats = [
    { label: "Total Packages", value: packages.length, color: "#007BFF" },
    { label: "Total Capacity", value: packages.reduce((a, b) => a + (b.MaxPax || 0), 0), color: "#10B981" },
    { label: "Total Bookings", value: "232", color: "#F97316" },
    { label: "Cancelled", value: "1", color: "#EF4444" },
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Tour Packages</h1>
          <p className="text-[14px] font-medium text-slate-400">Create and manage tour packages and destinations</p>
        </div>
        <button onClick={() => { resetForm(); setFormOpen(!formOpen); }} className="cv-btn-primary h-14 px-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {formOpen ? "Close Form" : "Add New Package"}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[20px] p-8 shadow-sm">
            <p className="text-[12px] font-bold text-slate-400 mb-2">{s.label}</p>
            <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none" style={{ color: s.label === "Cancelled" ? "#EF4444" : "#10B981" }}>
               {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-6 mb-10 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" placeholder="Search bookings, tours, customers..." className="w-full h-14 pl-16 pr-6 rounded-xl border border-slate-50 bg-slate-50/50 text-[14px] font-medium outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-white border border-slate-200 rounded-[32px] p-10 mb-10 shadow-2xl animate-fade-in">
          <h3 className="text-[18px] font-black text-slate-900 mb-8">Package Editor</h3>
          <form onSubmit={handleSave} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
                 <input type="text" required placeholder="e.g. European Explorer" className="cv-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                 <input type="text" required placeholder="e.g. Paris, France" className="cv-input" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
               </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                 <input type="number" min="1" className="cv-input" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity (Pax)</label>
                 <input type="number" min="1" className="cv-input" value={formData.maxPax} onChange={(e) => setFormData({ ...formData, maxPax: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₱)</label>
                 <input type="number" step="0.01" className="cv-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                 <select className="cv-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                   <option value="Cultural">Cultural</option>
                   <option value="Adventure">Adventure</option>
                   <option value="Luxury">Luxury</option>
                   <option value="Beach">Beach</option>
                   <option value="Urban">Urban</option>
                 </select>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                 <textarea rows="3" className="cv-input py-4 h-32 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the experience..." />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Inclusions (Comma separated)</label>
                 <textarea rows="3" className="cv-input py-4 h-32 resize-none" value={formData.inclusions} onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })} placeholder="Hotel, Meals, Guide..." />
               </div>
             </div>
             <div className="flex justify-end gap-4 pt-4">
               <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="h-14 px-8 rounded-2xl border border-slate-200 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all cursor-pointer">Discard</button>
               <button type="submit" className="cv-btn-primary px-10">Save Package</button>
             </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[500px] bg-white rounded-[32px] animate-pulse border border-slate-100 shadow-sm" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
            <span className="text-[14px] font-black text-slate-200 uppercase tracking-[10px]">No packages found</span>
          </div>
        ) : (
          filtered.map((pkg) => (
            <div key={pkg.PackageID} className="bg-white rounded-[40px] border border-slate-50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&q=80&w=800&sig=${pkg.PackageID}`} alt={pkg.Name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-[2px] border border-white/30">
                  {pkg.Category || "Leisure"}
                </div>
                
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <div className="flex justify-between items-end gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[24px] font-black tracking-tight leading-tight mb-1 truncate block" title={pkg.Name}>{pkg.Name}</h3>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-[2px]">PKG-{String(pkg.PackageID).padStart(3, "0")}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[22px] font-black text-[#007BFF] bg-white px-4 py-1 rounded-xl shadow-xl">₱{parseFloat(pkg.Price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 flex-1 flex flex-col">
                <p className="text-[15px] text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3" title={pkg.Description}>{pkg.Description || "Explore the wonders of this curated destination with our premium all-inclusive package options."}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-slate-50">
                  <div className="flex items-center gap-3 text-[14px] font-bold text-slate-700 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <span className="truncate block" title={pkg.Destination}>{pkg.Destination}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] font-bold text-slate-700 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#007BFF] flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="truncate block">{pkg.Duration}D / {pkg.Duration - 1}N</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {(pkg.Inclusions?.split(',') || ["Luxury Stay", "Transfers", "Guided Tour"]).map((inc, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-[#007BFF] group-hover:border-blue-100 transition-all whitespace-nowrap">{inc.trim()}</span>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[12px] font-black text-slate-900 tracking-tighter uppercase tracking-[1px] whitespace-nowrap">{pkg.MaxPax || 20} Capacity</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(pkg)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#007BFF] hover:shadow-lg transition-all cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(pkg.PackageID)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-lg transition-all cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[32px] p-12 shadow-2xl max-w-md w-full mx-4 border border-slate-200">
            <h3 className="text-[24px] font-black text-slate-900 mb-4 tracking-tighter">De-list Package?</h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Are you sure you want to remove this package from the live catalog?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-900 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all">Discard</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-14 rounded-2xl bg-red-600 text-white text-[13px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 cursor-pointer transition-all">Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
