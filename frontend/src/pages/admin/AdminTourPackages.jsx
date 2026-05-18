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

  /**
   * Retrieves the live list of tour packages from the backend repository.
   * Updates state once packages are received or in case of error.
   */
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

  /**
   * Populates the package editor state with properties of the selected package
   * to allow updating details like price, duration, and inclusions.
   */
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

  /**
   * Persists new tour packages or updates existing ones in the backend system.
   * Displays errors to the user if form validation fails.
   */
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

  /**
   * Removes a tour package from active distribution by Package ID.
   */
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start p-8 gap-8 bg-[#f8fafc] animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-[14px] text-[#1e293b] font-normal leading-[20px]">
            <span className="text-[#64748b]">Admin</span>
            <span className="text-[#cbd5e1] font-light">/</span>
            <span>Tour Packages</span>
          </div>
          <h1 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[32px] tracking-[-0.02em] leading-[40px] mt-1">
            Tour Packages
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px]">
            Create and manage tour packages and destinations
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setFormOpen(!formOpen);
          }}
          className={`flex items-center justify-center gap-2 h-10 px-4 rounded-[6px] text-white text-[14px] font-medium transition-all shadow-sm cursor-pointer ${
            formOpen ? "bg-[#64748b] hover:bg-[#475569]" : "bg-[#007bff] hover:bg-[#0069d9]"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{formOpen ? "Close Editor" : "New Package"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Packages
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {packages.length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#eff6ff] text-[#007bff]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.25 2.25 0 01-1.6-2.098V7.93a3.723 3.723 0 00-1.81-3.218 3.703 3.703 0 00-4.66.56L9.67 7.29a3.75 3.75 0 00-1.079 2.502v2.464a2.25 2.25 0 01-.6 1.6l-1.136 1.136a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 002.25 2.25h12.93a2.25 2.25 0 002.25-2.25v-2.927a2.25 2.25 0 00-.659-1.591z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Capacity
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {packages.reduce((a, b) => a + (b.MaxPax || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#f0fdf4] text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3.75 20.25h16.5M3.75 20.25a8.961 8.961 0 011.089-3.75 8.961 8.961 0 018.461-4.5 8.961 8.961 0 018.461 4.5 8.961 8.961 0 011.089 3.75M3.75 20.25H16.5M10.5 11.25a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm7.5-3a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Bookings
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              232
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#fff7ed] text-[#f97316]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Cancelled
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#ef4444] text-[24px] tracking-[-0.02em] leading-[32px]">
              1
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#fef2f2] text-[#ef4444]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </article>
      </div>

      <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="relative group w-full max-w-[500px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#007bff] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search packages or destinations..."
            className="w-full h-10 pl-10 pr-4 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {formOpen && (
        <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-solid border-[#e2e8f0]">
            <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[16px] leading-[24px]">
              Package Editor
            </h3>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. European Explorer"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paris, France"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Capacity (Pax)
                </label>
                <input
                  type="number"
                  min="1"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.maxPax}
                  onChange={(e) => setFormData({ ...formData, maxPax: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Price (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Category
                </label>
                <select
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Beach">Beach</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="p-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all h-24 resize-none placeholder:text-[#94a3b8]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the experience..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Inclusions (Comma separated)
                </label>
                <textarea
                  rows="3"
                  className="p-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all h-24 resize-none placeholder:text-[#94a3b8]"
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  placeholder="Hotel, Meals, Guide..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-solid border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="h-[36px] px-4 rounded-[6px] border border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] text-[14px] font-medium transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="h-[36px] px-4 rounded-[6px] bg-[#007bff] hover:bg-[#0069d9] text-white text-[14px] font-medium transition-all shadow-sm cursor-pointer"
              >
                Save Package
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[500px] bg-white rounded-[12px] animate-pulse border border-slate-100 shadow-sm" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[12px] border border-slate-200 border-dashed">
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#64748b] text-[14px] uppercase tracking-wider">No packages found</span>
          </div>
        ) : (
          filtered.map((pkg) => (
            <div key={pkg.PackageID} className="bg-white rounded-[12px] border border-solid border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&q=80&w=800&sig=${pkg.PackageID}`} alt={pkg.Name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6 px-3 py-1 bg-white/20 backdrop-blur-md rounded-[6px] text-white text-[10px] font-['Arimo-Bold',Helvetica] font-bold uppercase tracking-wider border border-white/30">
                  {pkg.Category || "Leisure"}
                </div>
                
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <div className="flex justify-between items-end gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[24px] tracking-tight leading-tight mb-1 truncate block" title={pkg.Name}>{pkg.Name}</h3>
                      <p className="font-['Arimo-Regular',Helvetica] font-normal text-[10px] opacity-70 uppercase tracking-wider">PKG-{String(pkg.PackageID).padStart(3, "0")}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-['Arimo-Bold',Helvetica] font-bold text-[22px] text-[#007bff] bg-white px-4 py-1 rounded-[6px] shadow-sm">₱{parseFloat(pkg.Price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <p className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] text-slate-500 leading-relaxed mb-6 line-clamp-3" title={pkg.Description}>{pkg.Description || "Explore the wonders of this curated destination with our premium all-inclusive package options."}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-solid border-[#e2e8f0]">
                  <div className="flex items-center gap-3 font-['Arimo-Regular',Helvetica] font-normal text-[14px] text-slate-700 min-w-0">
                    <div className="w-8 h-8 rounded-[6px] bg-blue-50 flex items-center justify-center text-[#007bff] flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <span className="truncate block" title={pkg.Destination}>{pkg.Destination}</span>
                  </div>
                  <div className="flex items-center gap-3 font-['Arimo-Regular',Helvetica] font-normal text-[14px] text-slate-700 min-w-0">
                    <div className="w-8 h-8 rounded-[6px] bg-blue-50 flex items-center justify-center text-[#007bff] flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="truncate block">{pkg.Duration}D / {pkg.Duration - 1}N</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(pkg.Inclusions?.split(',') || ["Luxury Stay", "Transfers", "Guided Tour"]).map((inc, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-[4px] text-[10px] font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-[#007bff] group-hover:border-blue-100 transition-all whitespace-nowrap">{inc.trim()}</span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-solid border-[#e2e8f0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-['Arimo-Regular',Helvetica] font-normal text-[12px] text-[#1e293b] uppercase tracking-wider whitespace-nowrap">{pkg.MaxPax || 20} Capacity</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(pkg)}
                      className="w-8 h-8 rounded-lg border border-solid border-[#cbd5e1] text-slate-400 hover:text-[#007bff] hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(pkg.PackageID)}
                      className="w-8 h-8 rounded-lg border border-solid border-[#cbd5e1] text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-solid border-[#e2e8f0]">
              <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[18px] tracking-[-0.02em]">
                De-list Package?
              </h3>
              <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] mt-1.5 leading-relaxed">
                Are you sure you want to remove this package from the live catalog?
              </p>
            </div>
            <div className="flex gap-3 p-6 pt-6 border-t border-solid border-[#e2e8f0]">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-[36px] rounded-[6px] border border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] text-[14px] font-medium transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-[36px] rounded-[6px] bg-red-600 hover:bg-red-700 text-white text-[14px] font-medium transition-all shadow-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
