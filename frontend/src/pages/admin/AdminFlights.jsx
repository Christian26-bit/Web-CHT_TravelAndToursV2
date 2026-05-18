import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    airline: "",
    flightNumber: "",
    departureGate: "",
    arrivalGate: "",
    departureTime: "",
    arrivalTime: "",
    status: "ON TIME",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * Fetches the complete list of flights from the database via backend API.
   * Tracks loading state during the network request.
   */
  const fetchFlights = async () => {
    try {
      const res = await api.get("/flights");
      if (res.data.success) setFlights(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const filtered = flights.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.airline?.toLowerCase().includes(q) ||
      f.flightNumber?.toLowerCase().includes(q)
    );
  });

  const resetForm = () =>
    setFormData({
      id: "",
      airline: "",
      flightNumber: "",
      departureGate: "",
      arrivalGate: "",
      departureTime: "",
      arrivalTime: "",
      status: "ON TIME",
    });

  /**
   * Pre-populates the editor form with flight details selected for editing.
   * Formats ISO dates to datetime-local inputs.
   */
  const openEdit = (f) => {
    setFormData({
      id: f.FlightId,
      airline: f.airline || "",
      flightNumber: f.flightNumber || "",
      departureGate: f.departureGate || "",
      arrivalGate: f.arrivalGate || "",
      departureTime: f.departureTime ? f.departureTime.split(".")[0] : "",
      arrivalTime: f.arrivalTime ? f.arrivalTime.split(".")[0] : "",
      status: f.status || "ON TIME",
    });
    setFormOpen(true);
  };

  /**
   * Submits new or modified flight configurations to the server.
   * Triggers a live schedule list refresh on success.
   */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/flights", {
        id: formData.id || undefined,
        ...formData,
      });
      setFormOpen(false);
      resetForm();
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save flight.");
    }
  };

  /**
   * Delete flight records from the live system by Flight ID.
   */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/flights/${id}`);
      setDeleteConfirm(null);
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete.");
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Flights</h1>
          <p className="text-[14px] font-medium text-slate-400">Manage airline schedules and gate logistics</p>
        </div>
        <button onClick={() => { resetForm(); setFormOpen(!formOpen); }} className="cv-btn-primary h-14 px-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {formOpen ? "Close Editor" : "Add Flight"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Active Flights", value: flights.length, color: "#007BFF", bgColor: "#EBF3FF" },
          { label: "On-Time Rate", value: "94.2%", color: "#10B981", bgColor: "#ECFDF5" },
          { label: "Total Carriers", value: [...new Set(flights.map(f => f.airline))].length, color: "#7C3AED", bgColor: "#F5F3FF" },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-8 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[12px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: m.bgColor, color: m.color }}>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[20px] p-6 mb-10 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" placeholder="Search by airline or flight number..." className="w-full h-14 pl-16 pr-6 rounded-xl border border-slate-50 bg-slate-50/50 text-[14px] font-medium outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {formOpen && (
        <div className="bg-white border border-slate-200 rounded-[32px] p-10 mb-10 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#007BFF]" />
          <h3 className="text-[18px] font-black text-slate-900 mb-8">Flight Editor</h3>
          <form onSubmit={handleSave} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Airline</label>
                 <input type="text" required placeholder="e.g. Philippine Airlines" className="cv-input" value={formData.airline} onChange={(e) => setFormData({ ...formData, airline: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Flight Number</label>
                 <input type="text" required placeholder="e.g. PR 102" className="cv-input" value={formData.flightNumber} onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })} />
               </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Gate</label>
                 <input type="text" placeholder="T1 / G12" className="cv-input" value={formData.departureGate} onChange={(e) => setFormData({ ...formData, departureGate: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Gate</label>
                 <input type="text" placeholder="T3 / G05" className="cv-input" value={formData.arrivalGate} onChange={(e) => setFormData({ ...formData, arrivalGate: e.target.value })} />
               </div>
               <div className="space-y-2 col-span-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                 <select className="cv-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                   <option value="ON TIME">On Time</option>
                   <option value="DELAYED">Delayed</option>
                   <option value="CANCELLED">Cancelled</option>
                   <option value="IN AIR">In Air</option>
                   <option value="ARRIVED">Arrived</option>
                 </select>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Time</label>
                 <input type="datetime-local" className="cv-input" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Time</label>
                 <input type="datetime-local" className="cv-input" value={formData.arrivalTime} onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} />
               </div>
             </div>
             <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
               <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="h-14 px-8 rounded-2xl border border-slate-200 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all cursor-pointer">Discard</button>
               <button type="submit" className="cv-btn-primary px-10">Save Flight</button>
             </div>
          </form>
        </div>
      )}

      <div className="cv-table-card">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[25%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Carrier & Flight</div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Departure</div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Arrival</div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Gate Access</div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">Status</div>
                </th>
                <th className="font-normal w-[5%] text-right pr-2">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px]">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-solid border-[#e2e8f0] h-[39px]">
                    <td colSpan="6" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-[14px]">
                    No flights scheduled
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.FlightId} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[200px]" title={f.airline}>
                        {f.airline}
                      </div>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-slate-400 text-[11px] ml-[8px] truncate" title={f.flightNumber}>
                        {f.flightNumber}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] whitespace-nowrap">
                        {f.departureTime ? new Date(f.departureTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                    </td>
                    <td>
                      <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] whitespace-nowrap">
                        {f.arrivalTime ? new Date(f.arrivalTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5 ml-[8px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">DEP: <span className="text-slate-900 font-normal">{f.departureGate || "TBA"}</span></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">ARR: <span className="text-slate-900 font-normal">{f.arrivalGate || "TBA"}</span></span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center ml-[8px]">
                        <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border whitespace-nowrap ${
                          f.status === "ON TIME" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : f.status === "CANCELLED" 
                              ? "bg-red-50 text-red-600 border-red-100" 
                              : "bg-blue-50 text-[#007BFF] border-blue-100"
                        }`}>{f.status}</span>
                      </div>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(f)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-[#007BFF] transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(f.FlightId)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-red-500 transition-all cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
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
          <div className="bg-white rounded-[32px] p-12 shadow-2xl max-w-md w-full mx-4 border border-slate-200">
            <h3 className="text-[24px] font-black text-slate-900 mb-4 tracking-tighter">Remove Flight?</h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Are you sure you want to delete this flight from the system?
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
