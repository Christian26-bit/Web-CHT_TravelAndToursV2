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
    const timer = setTimeout(() => {
      fetchClients();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const formatName = (fullName) => {
    if (!fullName) return "—";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, , l] = parts;
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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      
      {/* Top Breadcrumb & Title Area */}
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Customers
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Customers Directory
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Manage your customer database, regular profiles, and loyalty types.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setFormOpen(!formOpen);
          }}
          className={`flex h-[36px] items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[6px] transition-all duration-300 cursor-pointer ${
            formOpen
              ? "bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#1e293b]"
              : "bg-[#007bff] hover:bg-[#0069d9] text-white shadow-sm"
          }`}
        >
          {formOpen ? (
            <>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] leading-[20px] whitespace-nowrap">
                Close Form
              </span>
            </>
          ) : (
            <>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] leading-[20px] whitespace-nowrap">
                New Customer
              </span>
            </>
          )}
        </button>
      </header>

      {/* Search Filter Panel */}
      <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] flex items-center gap-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full animate-fade-in">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-[16px] w-[16px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-400"
            placeholder="Search customers by Name or Email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Entry Form */}
      {formOpen && (
        <Card className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[24px] mb-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] animate-fade-in relative overflow-hidden w-full">
          <h3 className="font-['Arimo-Regular',Helvetica] font-medium text-[#1e293b] text-[16px] leading-[24px] mb-[20px]">
            Add New Customer
          </h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Middle Name
                </label>
                <input
                  type="text"
                  placeholder="Middle Name"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="traveler@example.com"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+63 XXX XXX XXXX"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Customer Type
                </label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
                    value={formData.customerType}
                    onChange={(e) =>
                      setFormData({ ...formData, customerType: e.target.value })
                    }
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="VIP">VIP</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex h-[36px] items-center justify-center px-[16px] py-[8px] rounded-[6px] border border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 text-[14px] font-normal transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex h-[36px] items-center justify-center px-[16px] py-[8px] rounded-[6px] bg-[#007bff] hover:bg-[#0069d9] text-white text-[14px] font-normal transition-all cursor-pointer shadow-sm"
              >
                Save Customer
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Data Table */}
      <div className="cv-table-card mt-10">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Customer Name
                  </div>
                </th>
                <th className="font-normal w-[35%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Contact Info
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Type
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Date Joined
                  </div>
                </th>
                <th className="font-normal w-[10%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-solid border-[#e2e8f0] h-[39px]"
                  >
                    <td colSpan="5" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-slate-500 text-[14px]"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.clientId}
                    className="hover:bg-slate-50 transition-colors h-[48px]"
                  >
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[220px]">
                        {formatName(c.Name)}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[320px]">
                        {c.Email} <span className="text-[#cbd5e1] mx-1.5">•</span> {c.ContactNumber}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span
                          className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border border-solid ${
                            c.CustomerType === "VIP"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : c.CustomerType === "CORPORATE"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                : "bg-blue-50 text-[#007bff] border-blue-100"
                          }`}
                        >
                          {c.CustomerType}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                        {new Date(c.DateRegistered).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                          Active
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
