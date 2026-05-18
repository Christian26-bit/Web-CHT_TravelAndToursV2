import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step1({ bookingData, updateData, onBack, onNext }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const f = bookingData.firstName || "";
    const l = bookingData.lastName || "";
    if (f || l) {
      updateData({ customerName: `${f} ${l}`.trim() });
    }
  }, [bookingData.firstName, bookingData.lastName]);

  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/clients?q=${search}`);
        if (res.data.success) setSearchResults(res.data.data);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const selectClient = (client) => {
    const parts = client.Name?.split("|") || [];
    updateData({
      clientId: client.clientId,
      firstName: parts[0] || client.Name || "",
      middleName: parts[1] || "",
      lastName: parts[2] || "",
      email: client.Email,
      contact: client.ContactNumber || "",
      customerType: client.CustomerType || "REGULAR",
    });
    setSearch("");
    setSearchResults([]);
  };

  return (
    <div className="w-full flex flex-col gap-[24px]">
      <div className="flex flex-col bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)] p-[33px] w-full">
        <div className="flex flex-col gap-[24px] w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-[8px] w-full">
          <h2 className="font-['Arimo-Regular',Helvetica] text-[16px] text-[#1e293b] leading-[24px]">Customer Information</h2>
          <p className="font-['Arimo-Regular',Helvetica] text-[16px] text-[#64748b] leading-[24px]">Search for an existing customer or enter new customer details</p>
          
          {/* Interview Tip */}
          <div className="flex items-center h-[42px] px-[13px] rounded-[8px] border border-[#e2e8f0] bg-[rgba(239,246,255,0.3)]">
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[12px] text-[#64748b] leading-[16px]">💬 Interview Tip:</span>
            <span className="font-['Arimo-Regular',Helvetica] text-[12px] text-[#64748b] leading-[16px] ml-[4px]">
              Start by asking if they've traveled with us before. If yes, search their name or contact to auto-fill their information.
            </span>
          </div>
        </div>

        {/* Search Existing Customer Card */}
        <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e2e8f0] bg-[rgba(239,246,255,0.5)] h-auto relative">
          <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Search Existing Customer</label>
          <div className="relative w-full mt-1">
            <div className="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none">
              <svg className="h-[20px] w-[20px] text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full h-[36px] pl-[40px] pr-[12px] bg-white border border-transparent rounded-[6px] text-[14px] text-[#64748b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
              placeholder="Search by name or contact number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-[80px] left-0 right-0 bg-white border border-[#e2e8f0] rounded-[6px] shadow-lg max-h-[250px] overflow-y-auto z-50">
              {searchResults.map((c) => (
                <button key={c.clientId} onClick={() => selectClient(c)} className="w-full flex flex-col items-start px-[16px] py-[12px] hover:bg-[#f8fafc] border-b border-[#e2e8f0] last:border-0 transition-colors">
                  <span className="font-['Arimo-Bold',Helvetica] font-bold text-[14px] text-[#1e293b]">{c.Name?.replace(/\|/g, " ")}</span>
                  <span className="font-['Arimo-Regular',Helvetica] text-[12px] text-[#64748b]">{c.Email || "No Email Provided"} • {c.ContactNumber || "No Contact"}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-[24px]">
          {/* First Name */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">First Name *</label>
            <input 
              type="text"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              placeholder="Enter customer name"
              value={bookingData.firstName || ""}
              onChange={(e) => updateData({ firstName: e.target.value })}
            />
          </div>

          {/* Middle Name */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Middle Name *</label>
            <input 
              type="text"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              placeholder="Enter middle name"
              value={bookingData.middleName || ""}
              onChange={(e) => updateData({ middleName: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Last Name *</label>
            <input 
              type="text"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              placeholder="Enter last name"
              value={bookingData.lastName || ""}
              onChange={(e) => updateData({ lastName: e.target.value })}
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Contact Number *</label>
            <input 
              type="text"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              placeholder="+63 912 345 6789"
              value={bookingData.contact || ""}
              onChange={(e) => updateData({ contact: e.target.value })}
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Email Address *</label>
            <input 
              type="email"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              placeholder="customer@email.com"
              value={bookingData.email || ""}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          </div>

          {/* Travel Date */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Travel Date *</label>
            <input 
              type="date"
              className="w-full h-[36px] px-[12px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none transition-all"
              value={bookingData.travelDate || ""}
              onChange={(e) => updateData({ travelDate: e.target.value })}
            />
          </div>
        </div>

        {/* Number of Persons & Travel Type */}
        <div className="grid grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Number of Persons *</label>
            <div className="flex items-center bg-white border border-[#cbd5e1] rounded-[6px] px-[4px] h-[36px]">
              <button type="button" onClick={() => updateData({ pax: Math.max(1, (bookingData.pax || 1) - 1) }) } className="w-[28px] h-[28px] rounded-[4px] bg-slate-50 border border-[#cbd5e1] text-[#007bff] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-[#007bff] hover:text-white hover:border-[#007bff] transition-colors">−</button>
              <input type="number" value={bookingData.pax || 1} readOnly className="flex-1 text-center bg-transparent text-[14px] font-['Arimo-Regular',Helvetica] text-[#1e293b] outline-none" />
              <button type="button" onClick={() => updateData({ pax: (bookingData.pax || 1) + 1 }) } className="w-[28px] h-[28px] rounded-[4px] bg-slate-50 border border-[#cbd5e1] text-[#007bff] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-[#007bff] hover:text-white hover:border-[#007bff] transition-colors">+</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[14px]">Travel Type *</label>
            <div className="relative w-full">
              <select 
                className="w-full h-[36px] pl-[12px] pr-[36px] bg-white border border-[#cbd5e1] rounded-[6px] text-[14px] text-[#1e293b] font-['Arimo-Regular',Helvetica] focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none appearance-none cursor-pointer"
                value={bookingData.travelType || "Leisure"}
                onChange={(e) => updateData({ travelType: e.target.value })}
              >
                <option value="Leisure">Leisure</option>
                <option value="Business">Business</option>
                <option value="Corporate">Corporate</option>
                <option value="VIP">VIP</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-[16px] w-[16px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Bar: Back / Next */}
      <div className="flex items-center justify-between h-[36px] mt-[8px]">
        <button onClick={onBack} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-[#f8fafc] transition-colors w-[80px]">
          <svg className="w-[16px] h-[16px] text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-[14px] text-[#1e293b] leading-[20px]">Back</span>
        </button>
        
        <span className="text-[14px] text-[#64748b] leading-[20px]">Step 1 of 6</span>
        
        <button onClick={onNext} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#007bff] rounded-[6px] hover:bg-[#0069d9] transition-colors w-[80px]">
          <span className="text-[14px] text-white leading-[20px]">Next</span>
          <svg className="w-[16px] h-[16px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
