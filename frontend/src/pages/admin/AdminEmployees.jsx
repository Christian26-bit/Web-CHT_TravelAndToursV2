import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import api from "../../api/axios";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
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
    Promise.resolve().then(() => fetchEmployees());
  }, []);

  const filtered = employees.filter((e) => {
    if (!showInactive && !e.IsActive) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.Name.toLowerCase().includes(q) || e.Email.toLowerCase().includes(q)
      );
    }
    return true;
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
      setFormError("Name and email are required.");
      return;
    }
    if (!formData.id && !formData.password) {
      setFormError("Password is required for new employees.");
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
      setFormError(err.response?.data?.error || "Failed to save employee.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/employees/${id}`);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete.");
      setDeleteConfirm(null);
    }
  };

  const handleToggle = async (emp) => {
    try {
      await api.patch(`/admin/employees/${emp.employeeId}/toggle`, {
        isActive: !emp.IsActive,
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Topbar />
      <div className="cv-main-container animate-fade-in">
        {/* HEADER */}
        <div className="cv-section-header">
          <h1 className="cv-page-title">User Roles Management</h1>
          <p className="cv-page-subtitle">
            Manage CHT Travel & Tours employees and their system roles.
          </p>
        </div>

        {/* ACTIONS ROW */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="relative flex-1 max-w-[400px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] fill-slate-400"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-[11px] pl-11 pr-5 border border-slate-200 rounded-full text-[14px] bg-white text-slate-900 outline-none transition-all focus:border-blue-600 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded text-blue-600 cursor-pointer"
            />
            <label
              htmlFor="showInactive"
              className="text-[13px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer"
            >
              Show Inactive
            </label>
          </div>
          <div className="ml-auto flex gap-3">
            <button
              onClick={fetchEmployees}
              className="cv-btn cv-btn-outline cv-btn-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </button>
            <button
              onClick={openAddForm}
              className="cv-btn cv-btn-primary cv-btn-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Add New Employee
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400"
                    >
                      Loading employees...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400"
                    >
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr
                      key={emp.employeeId}
                      className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {emp.employeeId}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {emp.Name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{emp.Email}</td>
                      <td className="px-5 py-3 text-slate-600">
                        {emp.ContactNumber || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${emp.IsManager ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {emp.IsManager ? "Manager" : "Staff"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${emp.IsActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {emp.IsActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEditForm(emp)}
                            title="Edit"
                            className="w-7 h-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggle(emp)}
                            title={emp.IsActive ? "Deactivate" : "Activate"}
                            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${emp.IsActive ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
                          >
                            {emp.IsActive ? (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0112 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0112 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(emp.employeeId)}
                            title="Delete"
                            className="w-7 h-7 rounded-md border border-red-200 bg-white flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-[fadeIn_0.15s_ease]">
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Employee?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. Employees with existing bookings
                cannot be deleted.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form Accordion */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm mt-6 overflow-hidden">
          <button
            onClick={() => {
              if (formOpen) {
                setFormOpen(false);
                resetForm();
              } else openAddForm();
            }}
            className="w-full flex items-center gap-2 px-5 py-4 bg-slate-50 border-b border-slate-100 text-left text-base font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg
              className={`w-5 h-5 transition-transform ${formOpen ? "rotate-180" : ""}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
            </svg>
            {formData.id ? "Edit Employee" : "Add New Employee"}
          </button>

          {formOpen && (
            <form
              onSubmit={handleSave}
              className="p-6 animate-[fadeIn_0.2s_ease]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Juan De La Cruz"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.g. juan@cht.com"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="e.g. 09123456789"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={formData.isManager ? "Manager" : "Staff"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isManager: e.target.value === "Manager",
                      })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Password{" "}
                    {formData.id && (
                      <span className="text-slate-400 normal-case">
                        (leave blank to keep)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded"
                  />{" "}
                  Active Account
                </label>
              </div>
              {formError && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {formError}
                </p>
              )}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  Save Employee
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
