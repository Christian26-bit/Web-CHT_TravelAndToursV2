import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editClient, setEditClient] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      if (res.data.success) setClients(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/admin/employees");
      if (res.data.success) setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchEmployees();
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

  const handleUpdateManager = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/admin/clients/${editClient.clientId}/manager`, {
        managedByEmployeeId: editClient.managedByEmployeeId
      });
      setEditClient(null);
      fetchClients();
    } catch (err) {
      alert("Failed to update manager assignment.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = clients.filter((c) => {
    const displayName = formatName(c.Name);
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      displayName.toLowerCase().includes(q) || c.Email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Customers</h1>
          <p className="text-[14px] font-medium text-slate-400">View and manage your travel agency's customer base</p>
        </div>
        <Card className="px-8 h-14 flex items-center gap-4 shadow-sm border-slate-100 rounded-[0.75rem]">
           <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
           <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active Profiles:</span>
           <span className="text-[20px] font-black text-slate-900 tracking-tighter">{clients.length}</span>
        </Card>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Total Customers", value: clients.length, color: "#007BFF", bgColor: "#EBF3FF" },
          { label: "Corporate Clients", value: clients.filter(c => c.CustomerType === 'CORPORATE').length, color: "#7C3AED", bgColor: "#F5F3FF" },
          { label: "VIP Customers", value: clients.filter(c => c.CustomerType === 'VIP').length, color: "#10B981", bgColor: "#ECFDF5" },
        ].map((m, i) => (
          <Card key={i} className="p-8 flex justify-between items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 rounded-[1.5rem]">
            <div>
              <p className="text-[12px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: m.bgColor, color: m.color }}>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="p-6 mb-10 shadow-sm border-slate-100 rounded-[1.5rem]">
        <div className="relative group max-w-[500px]">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors z-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <Input 
            type="text" 
            placeholder="Search customers by name or email..." 
            className="w-full h-14 pl-16 pr-6 rounded-[0.75rem] border-slate-50 bg-slate-50/50 text-[14px] font-medium focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-slate-100 overflow-hidden rounded-[1.5rem]">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[300px]">Customer Name</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Account Manager</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Type</th>
                <th className="bg-slate-50 px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Date Joined</th>
                <th className="bg-slate-50 px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest pr-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5" className="px-10 py-8 border-b border-slate-50"><div className="h-12 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-[10px]">No customers found</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.clientId} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 group-hover:text-primary transition-colors truncate block" title={formatName(c.Name)}>{formatName(c.Name)}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate block" title={c.Email}>{c.Email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.AccountManager ? "bg-primary" : "bg-slate-200"}`}></div>
                        <span className="text-[14px] font-bold text-slate-900 truncate" title={c.AccountManager ? formatName(c.AccountManager.Name) : "Unassigned"}>
                          {c.AccountManager ? formatName(c.AccountManager.Name) : "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        c.CustomerType === 'VIP' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : c.CustomerType === 'CORPORATE' ? "bg-blue-50 text-primary border-blue-100" : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>{c.CustomerType}</span>
                    </td>
                    <td className="px-10 py-10 text-[14px] font-bold text-slate-900 whitespace-nowrap">
                      {new Date(c.DateRegistered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-10 text-right pr-12">
                      <Button variant="outline" size="icon" onClick={() => setEditClient(c)} className="w-12 h-12 rounded-[0.75rem] border-slate-200 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all ml-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assignment Modal */}
      {editClient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <Card className="p-12 shadow-2xl max-w-md w-full mx-4 border-slate-200 rounded-[2rem]">
            <h3 className="text-[24px] font-black text-slate-900 mb-2 tracking-tighter">Assign Manager</h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Select the staff member responsible for <b>{formatName(editClient.Name)}</b>.
            </p>
            <form onSubmit={handleUpdateManager}>
              <div className="space-y-3 mb-10">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Member</label>
                <div className="relative">
                  <select 
                    className="w-full h-14 px-6 rounded-[0.75rem] border border-slate-200 bg-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none" 
                    value={editClient.managedByEmployeeId || ""} 
                    onChange={(e) => setEditClient({ ...editClient, managedByEmployeeId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{formatName(emp.Name)}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setEditClient(null)} className="flex-1 h-14 rounded-[0.75rem] border-slate-200 text-slate-900 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</Button>
                <Button type="submit" disabled={saving} className="flex-1 h-14 rounded-[0.75rem] bg-primary text-primary-foreground text-[13px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  {saving ? "Saving..." : "Assign"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
