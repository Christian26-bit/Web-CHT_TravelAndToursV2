import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    contactNumber: "",
    isManager: false,
    isActive: true,
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/admin/employees");
      if (res.data.success) setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const getInitials = (name) => {
    const cleanName = formatName(name);
    return cleanName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filtered = employees.filter((e) => {
    const displayName = formatName(e.Name);
    const matchesSearch = displayName.toLowerCase().includes(search.toLowerCase()) || e.Email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || (statusFilter === "Active" && e.IsActive) || (statusFilter === "Inactive" && !e.IsActive);
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      contactNumber: "",
      isManager: false,
      isActive: true,
      password: "",
      confirmPassword: "",
    });
    setFormError("");
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (emp) => {
    setFormData({
      id: emp.employeeId,
      name: emp.Name,
      email: emp.Email,
      contactNumber: emp.ContactNumber || "",
      isManager: emp.IsManager,
      isActive: emp.IsActive,
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and Email are required.");
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        id: formData.id || undefined,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        isManager: formData.isManager,
        isActive: formData.isActive,
      };
      if (formData.password) payload.password = formData.password;
      await api.post("/admin/employees", payload);
      setFormOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to save user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/employees/${id}`);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const stats = [
    { label: "Total Users", value: employees.length, color: "#003266", bgColor: "#E6EAEE" },
    { label: "Administrators", value: employees.filter(e => e.IsManager).length, color: "#007BFF", bgColor: "#EBF3FF" },
    { label: "Agents", value: employees.filter(e => !e.IsManager).length, color: "#10B981", bgColor: "#ECFDF5" },
    { label: "Active Users", value: employees.filter(e => e.IsActive).length, color: "#65C400", bgColor: "#F0F9E6" },
  ];

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">User Roles & Permissions</h1>
          <p className="text-[14px] font-medium text-slate-400">Manage admin and agent permissions and roles</p>
        </div>
        <button onClick={openAddForm} className="cv-btn-primary h-14 px-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v9m-4.5-4.5h9M3 5.25h18M3 12h18m-9 6.75h9" /></svg>
          Add New User
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[20px] p-8 flex justify-between items-center shadow-sm">
            <div>
               <p className="text-[12px] font-bold text-slate-400 mb-2">{s.label}</p>
               <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{s.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: s.bgColor, color: s.color }}>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-6 mb-10 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" placeholder="Search by name, email, or ID..." className="w-full h-14 pl-16 pr-6 rounded-xl border border-slate-50 bg-slate-50/50 text-[14px] font-medium outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="w-12 h-14 flex items-center justify-center border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg></button>
          <select className="h-14 px-6 border border-slate-100 rounded-xl text-[14px] font-bold text-slate-900 outline-none focus:border-[#007BFF] bg-white cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="bg-white border border-slate-200 rounded-[32px] p-10 mb-10 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#007BFF]" />
          <h3 className="text-[18px] font-black text-slate-900 mb-8">User Editor</h3>
          <form onSubmit={handleSave} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name (Last|First|Middle)</label>
                 <input type="text" required placeholder="CRUZ|JUAN|D" className="cv-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                 <input type="email" required placeholder="name@cht.com" className="cv-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                 <input type="password" placeholder="••••••••" className="cv-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                 <input type="password" placeholder="••••••••" className="cv-input" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                 <select className="cv-input" value={formData.isManager ? "Admin" : "Employee"} onChange={(e) => setFormData({ ...formData, isManager: e.target.value === "Admin" })}>
                   <option value="Employee">Employee</option>
                   <option value="Admin">Admin</option>
                 </select>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <input type="checkbox" id="userActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-[#007BFF] rounded border-slate-300 cursor-pointer" />
               <label htmlFor="userActive" className="text-[13px] font-bold text-slate-900 cursor-pointer select-none">Active System Access</label>
             </div>
             {formError && <p className="text-red-500 text-[12px] font-bold">{formError}</p>}
             <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
               <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="h-14 px-8 rounded-2xl border border-slate-200 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all cursor-pointer">Discard</button>
               <button type="submit" className="cv-btn-primary px-10">Save User</button>
             </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="cv-table-card">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr>
                <th className="min-w-[300px]">User Profile</th>
                <th className="min-w-[200px]">Email</th>
                <th className="min-w-[150px]">Role</th>
                <th className="min-w-[150px]">Position</th>
                <th className="min-w-[200px]">Permissions</th>
                <th className="min-w-[150px]">Status</th>
                <th className="text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="7" className="px-10 py-8"><div className="h-12 bg-slate-50 animate-pulse rounded-2xl w-full" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-[10px]">No users discovered</td></tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-5 min-w-0">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[15px] font-black shadow-lg flex-shrink-0 transition-transform group-hover:scale-105 ${
                          emp.IsManager ? "bg-blue-600 text-white shadow-blue-600/20" : "bg-slate-100 text-slate-400 shadow-slate-100/10"
                        }`}>
                          {getInitials(emp.Name)}
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-[16px] font-black text-slate-900 leading-tight mb-1 truncate block" title={formatName(emp.Name)}>{formatName(emp.Name)}</p>
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">USR-{String(emp.employeeId).padStart(3, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-3 text-slate-500 font-medium min-w-0">
                        <svg className="w-4 h-4 opacity-30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        <span className="text-[14px] truncate block" title={emp.Email}>{emp.Email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                       <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                         emp.IsManager ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10" : "bg-[#007BFF] text-white border-[#007BFF] shadow-lg shadow-[#007BFF]/10"
                       }`}>{emp.IsManager ? "Admin" : "Agent"}</span>
                    </td>
                    <td className="px-10 py-10 text-[14px] font-bold text-slate-500 whitespace-nowrap">{emp.IsManager ? "Manager" : "Staff"}</td>
                    <td className="px-10 py-10">
                       <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{emp.IsManager ? "Full System" : "Bookings"}</span>
                         {!emp.IsManager && <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Client View</span>}
                       </div>
                    </td>
                    <td className="px-10 py-10">
                       <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                         emp.IsActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                       }`}>{emp.IsActive ? "Active" : "Locked"}</span>
                    </td>
                    <td className="px-10 py-10 text-right pr-12">
                       <div className="flex justify-end gap-3">
                         <button onClick={() => openEditForm(emp)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#007BFF] hover:shadow-lg transition-all cursor-pointer">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                         </button>
                         <button onClick={() => setDeleteConfirm(emp.employeeId)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:shadow-lg transition-all cursor-pointer">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[32px] p-12 shadow-2xl max-w-md w-full mx-4 border border-slate-200">
            <h3 className="text-[24px] font-black text-slate-900 mb-4 tracking-tighter">De-authorize User?</h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Are you sure you want to revoke system access for this user?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-900 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all">Discard</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-14 rounded-2xl bg-red-600 text-white text-[13px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 cursor-pointer transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
