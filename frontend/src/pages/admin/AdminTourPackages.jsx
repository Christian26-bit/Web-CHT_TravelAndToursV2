import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
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
    Promise.resolve().then(() => fetchPackages());
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

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-1">
          <h2 className="text-lg font-bold text-slate-800">
            Tour Package Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage all the tour packages offered by CHT Travel & Tours.
          </p>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-3 my-5 flex-wrap">
          <div className="relative flex-1 max-w-[400px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="ml-auto flex gap-3">
            <button
              onClick={fetchPackages}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => {
                resetForm();
                setFormOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Add New Package
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "ID",
                    "Name",
                    "Destination",
                    "Duration",
                    "Max Pax",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400"
                    >
                      Loading packages...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400"
                    >
                      No packages found
                    </td>
                  </tr>
                ) : (
                  filtered.map((pkg) => (
                    <tr
                      key={pkg.PackageID}
                      className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {pkg.PackageID}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {pkg.Name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {pkg.Destination || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {pkg.Duration} days
                      </td>
                      <td className="px-5 py-3 text-slate-600">{pkg.MaxPax}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        ₱
                        {parseFloat(pkg.Price || 0).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${pkg.IsActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {pkg.IsActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEdit(pkg)}
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
                            onClick={() => setDeleteConfirm(pkg.PackageID)}
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

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Package?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Packages with existing bookings cannot be deleted.
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
              } else {
                resetForm();
                setFormOpen(true);
              }
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
            {formData.id ? "Edit Tour Package" : "Add New Tour Package"}
          </button>

          {formOpen && (
            <form
              onSubmit={handleSave}
              className="p-6 animate-[fadeIn_0.2s_ease]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Island Hopping"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    placeholder="e.g. Palawan, PH"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Max Pax
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxPax}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPax: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded"
                    />{" "}
                    Active
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter package details..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Inclusions
                </label>
                <textarea
                  rows="2"
                  value={formData.inclusions}
                  onChange={(e) =>
                    setFormData({ ...formData, inclusions: e.target.value })
                  }
                  placeholder="e.g. flights, hotel, breakfast..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y"
                />
              </div>
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
                  Save Package
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
