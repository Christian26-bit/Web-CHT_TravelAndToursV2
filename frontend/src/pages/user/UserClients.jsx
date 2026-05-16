import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    address: "",
    contactNumber: "",
    customerType: "REGULAR",
  });

  const fetchClients = async () => {
    try {
      const r = await api.get("/clients");
      if (r.data.success) setClients(r.data.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const formatName = (fullName) => {
    if (!fullName) return "—";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, m, l] = parts;
      return `${f} ${l}`;
    }
    return fullName;
  };

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const display = formatName(c.Name).toLowerCase();
    return display.includes(q) || c.Email?.toLowerCase().includes(q);
  });

  const resetForm = () =>
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      address: "",
      contactNumber: "",
      customerType: "REGULAR",
    });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const normalizedName = `${formData.firstName}|${formData.middleName}|${formData.lastName}`;
      await api.post("/clients_save", { ...formData, name: normalizedName });
      setFormOpen(false);
      resetForm();
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save.");
    }
  };

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Customers</h1>
          <p className="text-[14px] font-medium text-slate-400">View and manage your travel agency's customer base</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-full max-w-[400px] group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors z-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <Input
              type="text"
              placeholder="Search by Name or Email..."
              className="w-full h-14 pl-14 pr-6 rounded-[0.75rem] border-slate-100 bg-white text-[14px] font-bold focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => { resetForm(); setFormOpen(!formOpen); }} className="h-14 px-8 rounded-[0.75rem] text-[12px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all whitespace-nowrap">
            {formOpen ? "Close Form" : "New Customer"}
          </Button>
        </div>
      </div>

      {/* Entry Form */}
      {formOpen && (
        <Card className="p-10 mb-10 shadow-xl animate-fade-in relative overflow-hidden border-slate-100 rounded-[1.5rem]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <h3 className="text-[18px] font-black text-slate-900 mb-8 uppercase tracking-widest pl-4">Add New Customer</h3>
          <form onSubmit={handleSave} className="pl-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name *</label>
                <Input type="text" required placeholder="John" className="h-14 px-6 rounded-[0.75rem] bg-slate-50 border-slate-50 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Middle Name</label>
                <Input type="text" placeholder="Middle Name" className="h-14 px-6 rounded-[0.75rem] bg-slate-50 border-slate-50 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name *</label>
                <Input type="text" required placeholder="Doe" className="h-14 px-6 rounded-[0.75rem] bg-slate-50 border-slate-50 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <Input type="email" required placeholder="traveler@example.com" className="h-14 px-6 rounded-[0.75rem] bg-slate-50 border-slate-50 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <Input type="text" placeholder="+63 XXX XXX XXXX" className="h-14 px-6 rounded-[0.75rem] bg-slate-50 border-slate-50 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Type</label>
                <div className="relative">
                  <select className="w-full h-14 px-6 rounded-[0.75rem] bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none" value={formData.customerType} onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}>
                    <option value="REGULAR">Regular</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="VIP">VIP</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-slate-50">
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)} className="h-14 px-8 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Discard</Button>
              <Button type="submit" className="h-14 px-10 rounded-[0.75rem] text-[12px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Save Customer</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Data Table */}
      <Card className="shadow-sm border-slate-100 overflow-hidden rounded-[1.5rem]">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[250px]">Customer Name</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Contact Info</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Type</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Date Joined</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5" className="px-10 py-6 border-b border-slate-50"><div className="h-10 bg-slate-50 animate-pulse rounded-xl" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-widest">No customers found</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.clientId} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors">{formatName(c.Name)}</span>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Verified Profile</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-900">{c.Email}</span>
                        <span className="text-[11px] font-medium text-slate-400">{c.ContactNumber}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        c.CustomerType === "VIP" ? "bg-emerald-50 text-emerald-600" : c.CustomerType === "CORPORATE" ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-primary"
                      }`}>{c.CustomerType}</span>
                    </td>
                    <td className="px-10 py-6 text-[13px] font-bold text-slate-900">
                      {new Date(c.DateRegistered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
