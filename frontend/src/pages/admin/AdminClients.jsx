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
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * Fetches customer list from the database.
   * Tracks customer registration records.
   */
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

  /**
   * Fetches active employees list from the backend to facilitate
   * manager assignment for customer accounts.
   */
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

  /**
   * Translates the pipe-separated database name (Last|First|Middle)
   * into a natural, friendly display string.
   */
  const formatName = (fullName) => {
    if (!fullName) return "—";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, m, l] = parts;
      return `${f} ${l}`;
    }
    return fullName;
  };

  /**
   * Submits account manager reassignment updates to the admin service.
   * Updates state on successful response.
   */
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

  /**
   * Deletes a customer profile from the repository by Client ID.
   */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/clients/${id}`);
      setDeleteConfirm(null);
      fetchClients();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete customer.");
      setDeleteConfirm(null);
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start p-8 gap-8 bg-[#f8fafc] animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-[14px] text-[#1e293b] font-normal leading-[20px]">
            <span className="text-[#64748b]">Admin</span>
            <span className="text-[#cbd5e1] font-light">/</span>
            <span>Customers</span>
          </div>
          <h1 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[32px] tracking-[-0.02em] leading-[40px] mt-1">
            Customers
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px]">
            View and manage your travel agency's customer base
          </p>
        </div>
        <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[12px_24px] flex items-center gap-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <div className="w-2 h-2 rounded-full bg-[#007bff] animate-pulse"></div>
          <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[12px] uppercase tracking-wider">
            Active Profiles:
          </span>
          <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[18px]">
            {clients.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Customers
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {clients.length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#eff6ff] text-[#007bff]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3.75 20.25h16.5M3.75 20.25a8.961 8.961 0 011.089-3.75 8.961 8.961 0 018.461-4.5 8.961 8.961 0 018.461 4.5 8.961 8.961 0 011.089 3.75M3.75 20.25H16.5M10.5 11.25a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm7.5-3a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Corporate Clients
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {clients.filter(c => c.CustomerType === 'CORPORATE').length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#faf5ff] text-[#7c3aed]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21m16.5 0H3.75" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              VIP Customers
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {clients.filter(c => c.CustomerType === 'VIP').length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#f0fdf4] text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
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
            placeholder="Search customers by name or email..."
            className="w-full h-10 pl-10 pr-4 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[35%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Customer Name
                  </div>
                </th>
                <th className="font-normal w-[30%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Account Manager
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Type
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Date Joined
                  </div>
                </th>
                <th className="font-normal w-[5%] text-right pr-2">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider text-right pr-[8px]">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-solid border-[#e2e8f0] h-[39px]">
                    <td colSpan="5" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 text-[14px]">
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.clientId} className="hover:bg-slate-50 transition-colors h-[48px]">
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[280px]" title={formatName(c.Name)}>
                        {formatName(c.Name)}
                      </div>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[11px] ml-[8px] truncate max-w-[280px]" title={c.Email}>
                        {c.Email}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 ml-[8px]">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.AccountManager ? "bg-[#007bff]" : "bg-slate-300"}`}></div>
                        <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] truncate" title={c.AccountManager ? formatName(c.AccountManager.Name) : "Unassigned"}>
                          {c.AccountManager ? formatName(c.AccountManager.Name) : "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium uppercase tracking-wider border ${
                          c.CustomerType === 'VIP' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : c.CustomerType === 'CORPORATE' ? "bg-blue-50 text-[#007bff] border-blue-100" : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>{c.CustomerType}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                        {new Date(c.DateRegistered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setEditClient(c)}
                          className="w-8 h-8 rounded-lg border border-solid border-[#cbd5e1] text-slate-400 hover:text-[#007bff] transition-all hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                          title="Assign Manager"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(c)}
                          className="w-8 h-8 rounded-lg border border-solid border-[#fecaca] text-[#f87171] hover:text-[#ef4444] transition-all hover:bg-[#fef2f2] flex items-center justify-center cursor-pointer"
                          title="Delete Customer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {editClient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-solid border-[#e2e8f0]">
              <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[18px] tracking-[-0.02em]">
                Assign Manager
              </h3>
              <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] mt-1.5 leading-relaxed">
                Select the staff member responsible for <b>{formatName(editClient.Name)}</b>.
              </p>
            </div>
            <form onSubmit={handleUpdateManager} className="p-6 space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Staff Member
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all appearance-none cursor-pointer"
                    value={editClient.managedByEmployeeId || ""}
                    onChange={(e) => setEditClient({ ...editClient, managedByEmployeeId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{formatName(emp.Name)}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-6 border-t border-solid border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setEditClient(null)}
                  className="flex-1 h-[36px] rounded-[6px] border border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] text-[14px] font-medium transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-[36px] rounded-[6px] bg-[#007bff] hover:bg-[#0069d9] text-white text-[14px] font-medium transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
