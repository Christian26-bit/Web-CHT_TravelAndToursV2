import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Step1({ bookingData, updateData }) {
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
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-left">
        <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
          Traveler Details
        </h2>
        <p className="text-slate-500 text-[16px] font-medium tracking-tight">
          Enter the details of the primary traveler for this booking.
        </p>
      </div>

      {/* Customer Lookup */}
      <Card className="p-8 shadow-sm border-slate-100 rounded-[2rem]">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Search Existing Customer</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          </div>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or customer ID..."
            className="w-full h-14 pl-14 pr-6 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-bold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all outline-none"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto z-50 absolute left-8 right-8 lg:static lg:mt-4 lg:left-0 lg:right-0">
            {searchResults.map((c) => (
              <button key={c.clientId} onClick={() => selectClient(c)} className="w-full text-left px-8 py-5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center group transition-all cursor-pointer">
                <div>
                  <div className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors">{c.Name?.replace(/\|/g, " ")}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.Email}</div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-black rounded-lg uppercase">{c.CustomerType || "Regular"}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Manual Entry */}
      <Card className="p-10 shadow-sm relative overflow-hidden border-slate-100 rounded-[2rem]">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        
        <h3 className="text-[18px] font-black text-slate-900 mb-10 uppercase tracking-widest pl-4">Traveler Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 pl-4">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">First Name *</label>
            <Input type="text" value={bookingData.firstName || ""} onChange={(e) => updateData({ firstName: e.target.value })} placeholder="John" className="h-14 px-6 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-bold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Last Name *</label>
            <Input type="text" value={bookingData.lastName || ""} onChange={(e) => updateData({ lastName: e.target.value })} placeholder="Doe" className="h-14 px-6 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-bold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pl-4">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Phone Number</label>
            <Input type="text" value={bookingData.contact || ""} onChange={(e) => updateData({ contact: e.target.value })} placeholder="+63 XXX XXX XXXX" className="h-14 px-6 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-bold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Email Address</label>
            <Input type="email" value={bookingData.email || ""} onChange={(e) => updateData({ email: e.target.value })} placeholder="traveler@example.com" className="h-14 px-6 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-bold focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Number of Persons</label>
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-[1.5rem] px-4 h-14">
              <button type="button" onClick={() => updateData({ pax: Math.max(1, (bookingData.pax || 1) - 1) }) } className="w-10 h-10 rounded-[0.75rem] bg-white border border-slate-100 flex items-center justify-center text-primary font-black hover:bg-primary hover:text-white transition-all cursor-pointer text-xl shadow-sm">−</button>
              <input type="number" value={bookingData.pax || 1} readOnly className="flex-1 text-center bg-transparent text-[18px] font-black text-slate-900 outline-none" />
              <button type="button" onClick={() => updateData({ pax: (bookingData.pax || 1) + 1 }) } className="w-10 h-10 rounded-[0.75rem] bg-white border border-slate-100 flex items-center justify-center text-primary font-black hover:bg-primary hover:text-white transition-all cursor-pointer text-xl shadow-sm">+</button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Travel Type</label>
            <div className="flex gap-2 flex-wrap pt-1">
              {["Leisure", "Business", "Corporate", "VIP"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateData({ travelType: type })}
                  className={`px-6 py-2.5 rounded-[0.75rem] text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer ${
                    bookingData.travelType === type ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20" : "bg-white text-slate-400 border-slate-100 hover:border-primary hover:text-primary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
