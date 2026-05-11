import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step1({ bookingData, updateData }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (search.length < 2) {
      Promise.resolve().then(() => setSearchResults([]));
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/clients?q=${search}`);
        if (res.data.success) setSearchResults(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const selectClient = (client) => {
    updateData({
      clientId: client.clientId,
      customerName: client.Name,
      email: client.Email,
      contact: client.ContactNumber || "",
      address: client.Address || "",
      customerType: client.CustomerType || "REGULAR",
    });
    setSearch("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Customer Information
        </h2>
        <p className="text-slate-500 mt-1">
          Search for an existing customer or enter new details below.
        </p>
      </div>

      {/* Existing Customer Lookup */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
          Existing Customer Lookup
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Email or ID..."
            className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-6 right-6 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 max-h-[240px] overflow-y-auto">
            {searchResults.map((c) => (
              <button
                key={c.clientId}
                onClick={() => selectClient(c)}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-blue-600">
                    {c.Name}
                  </div>
                  <div className="text-xs text-slate-400">{c.Email}</div>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded">
                  ID: {c.clientId}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Customer Form Area */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-[15px] font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[12px]">
            👤
          </span>
          Customer Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Full Customer Name
            </label>
            <input
              type="text"
              value={bookingData.customerName || ""}
              onChange={(e) => updateData({ customerName: e.target.value })}
              placeholder="Enter full name"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-700 outline-none transition-all focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Contact Number
            </label>
            <input
              type="text"
              value={bookingData.contact || ""}
              onChange={(e) => updateData({ contact: e.target.value })}
              placeholder="e.g. 0912..."
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-700 outline-none transition-all focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={bookingData.email || ""}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="email@example.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-700 outline-none transition-all focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Number of Travellers (Pax)
            </label>
            <input
              type="number"
              min="1"
              value={bookingData.pax || 1}
              onChange={(e) =>
                updateData({ pax: parseInt(e.target.value) || 1 })
              }
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[15px] text-slate-700 outline-none transition-all focus:border-blue-500"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Travel Type
            </label>
            <div className="flex gap-3 flex-wrap">
              {["Leisure", "Business", "Family", "Solo"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateData({ travelType: type })}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    bookingData.travelType === type
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
