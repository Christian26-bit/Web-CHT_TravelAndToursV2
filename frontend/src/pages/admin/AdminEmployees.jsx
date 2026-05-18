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

  /**
   * Fetches user/employee records from the backend live database.
   * Updates state with matching authorization records.
   */
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

  /**
   * Parses the pipeline-separated name (Last|First|Middle) from the DB
   * and returns a friendly readable format.
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
   * Generates display initials (up to 2 characters) for the user profile circle.
   */
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

  /**
   * Pre-loads employee parameters into the editor workspace form.
   * Resets password entry fields for security safety.
   */
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

  /**
   * Handles user creation or update operations. Performs client-side password matching.
   * Submits payloads to standard express authorization endpoints.
   */
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

  /**
   * Revokes user credentials and deletes database records.
   */
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start p-8 gap-8 bg-[#f8fafc] animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-[14px] text-[#1e293b] font-normal leading-[20px]">
            <span className="text-[#64748b]">Admin</span>
            <span className="text-[#cbd5e1] font-light">/</span>
            <span>Employees</span>
          </div>
          <h1 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[32px] tracking-[-0.02em] leading-[40px] mt-1">
            User Roles & Permissions
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px]">
            Manage admin and agent permissions and roles
          </p>
        </div>
        <button
          onClick={openAddForm}
          className={`flex items-center justify-center gap-2 h-10 px-4 rounded-[6px] text-white text-[14px] font-medium transition-all shadow-sm cursor-pointer ${
            formOpen ? "bg-[#64748b] hover:bg-[#475569]" : "bg-[#007bff] hover:bg-[#0069d9]"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{formOpen ? "Close Editor" : "New User"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Total Users
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {employees.length}
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
              Administrators
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {employees.filter(e => e.IsManager).length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#faf5ff] text-[#7c3aed]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Agents
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[24px] tracking-[-0.02em] leading-[32px]">
              {employees.filter(e => !e.IsManager).length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#f0fdf4] text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a6 6 0 00-3.44-5.54M2 19.5a5.993 5.993 0 0110-4.5 5.993 5.993 0 0110 4.5m-18 0h18M12 11.25a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75zm8.25 2.25a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25z" />
            </svg>
          </div>
        </article>

        <article className="flex flex-row items-center justify-between w-full p-[24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] uppercase tracking-wider">
              Active Users
            </span>
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[#10b981] text-[24px] tracking-[-0.02em] leading-[32px]">
              {employees.filter(e => e.IsActive).length}
            </span>
          </div>
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] bg-[#f0fdf4] text-[#10b981]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </article>
      </div>

      <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-4">
        <div className="relative group flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#007bff] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full h-10 pl-10 pr-4 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button className="w-10 h-10 flex items-center justify-center border border-[#cbd5e1] rounded-[6px] text-slate-400 hover:text-[#1e293b] hover:bg-slate-50 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
          </button>
          <div className="relative">
            <select
              className="h-10 pl-3 pr-8 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {formOpen && (
        <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-solid border-[#e2e8f0] flex items-center justify-between">
            <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[16px] leading-[24px]">
              User Editor
            </h3>
            <span className="text-[11px] text-[#64748b] bg-slate-100 px-2 py-0.5 rounded font-mono">
              {formData.employeeId ? `EDITING USR-${String(formData.employeeId).padStart(3, "0")}` : "NEW USER REGISTRATION"}
            </span>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Full Name (Last|First|Middle)
                </label>
                <input
                  type="text"
                  required
                  placeholder="CRUZ|JUAN|D"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@cht.com"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all placeholder:text-[#94a3b8]"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Role
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full h-10 px-3 rounded-[6px] border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] bg-white transition-all appearance-none cursor-pointer"
                    value={formData.isManager ? "Admin" : "Employee"}
                    onChange={(e) => setFormData({ ...formData, isManager: e.target.value === "Admin" })}
                  >
                    <option value="Employee">Employee (Agent)</option>
                    <option value="Admin">Admin (Manager)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="userActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#007bff] rounded border-slate-300 cursor-pointer focus:ring-[#007bff] transition-colors"
              />
              <label htmlFor="userActive" className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[13px] cursor-pointer select-none">
                Active System Access
              </label>
            </div>

            {formError && (
              <p className="text-red-500 text-[12px] font-bold mt-2">
                {formError}
              </p>
            )}

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
                Save User
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="w-full bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    User Profile
                  </div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Email
                  </div>
                </th>
                <th className="font-normal w-[12%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Role
                  </div>
                </th>
                <th className="font-normal w-[10%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Position
                  </div>
                </th>
                <th className="font-normal w-[18%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Permissions
                  </div>
                </th>
                <th className="font-normal w-[10%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] uppercase tracking-wider ml-[8px]">
                    Status
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
                    <td colSpan="7" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 text-[14px]">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-slate-50 transition-colors h-[48px]">
                    <td>
                      <div className="flex items-center gap-3 ml-[8px] min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                          emp.IsManager ? "bg-[#007bff] text-white shadow-sm" : "bg-slate-100 text-slate-500"
                        }`}>
                          {getInitials(emp.Name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] truncate" title={formatName(emp.Name)}>
                            {formatName(emp.Name)}
                          </div>
                          <div className="font-['Arimo-Regular',Helvetica] font-normal text-slate-400 text-[10px] tracking-tighter uppercase leading-[12px]">
                            USR-{String(emp.employeeId).padStart(3, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[180px]" title={emp.Email}>
                        {emp.Email}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-medium uppercase tracking-wider border ${
                          emp.IsManager 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-blue-50 text-[#007bff] border-blue-100"
                        }`}>{emp.IsManager ? "Admin" : "Agent"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] text-slate-500">
                        {emp.IsManager ? "Manager" : "Staff"}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1 ml-[8px]">
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{emp.IsManager ? "Full System" : "Bookings"}</span>
                        {!emp.IsManager && <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Client View</span>}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium uppercase tracking-wider border whitespace-nowrap ${
                          emp.IsActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>{emp.IsActive ? "Active" : "Locked"}</span>
                      </div>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(emp)}
                          className="w-8 h-8 rounded-lg border border-solid border-[#cbd5e1] text-slate-400 hover:text-[#007bff] transition-all hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(emp.employeeId)}
                          className="w-8 h-8 rounded-lg border border-solid border-[#cbd5e1] text-slate-400 hover:text-red-500 transition-all hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white rounded-[12px] border border-solid border-[#e2e8f0] shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-solid border-[#e2e8f0]">
              <h3 className="font-['Arimo-Bold',Helvetica] font-bold text-[#1e293b] text-[18px] tracking-[-0.02em]">
                De-authorize User?
              </h3>
              <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] mt-1.5 leading-relaxed">
                Are you sure you want to revoke system access for this user?
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
