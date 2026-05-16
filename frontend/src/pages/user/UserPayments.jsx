import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    referenceNumber: "",
    status: "Paid",
  });

  const fetchPayments = async () => {
    try {
      const r = await api.get("/payments");
      if (r.data.success) setPayments(r.data.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payments_save", formData);
      setFormOpen(false);
      setFormData({
        bookingId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        referenceNumber: "",
        status: "Paid",
      });
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save payment.");
    }
  };

  const totalCollected = payments
    .filter((p) => p.Status === "Paid")
    .reduce((sum, p) => sum + parseFloat(p.Amount || 0), 0);

  const pendingCount = payments.filter((p) => p.Status === "Pending").length;

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Payments</h1>
          <p className="text-[14px] font-medium text-slate-400">View and manage all booking payments and transaction history</p>
        </div>
        <button onClick={() => setFormOpen(!formOpen)} className="h-14 px-8 rounded-2xl bg-[#007BFF] text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-[#007BFF]/20 hover:bg-[#0069D9] transition-all cursor-pointer flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {formOpen ? "Close Form" : "New Payment"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Total Paid", value: `₱${totalCollected.toLocaleString("en-PH")}`, color: "#ECFDF5", iconColor: "#10B981", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Pending", value: `${pendingCount} Records`, color: "#EFF6FF", iconColor: "#007BFF", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Total Records", value: `${payments.length} Payments`, color: "#F5F3FF", iconColor: "#7C3AED", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-8 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[12px] font-bold text-slate-400 mb-2">{m.label}</p>
              <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{m.value}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: m.color, color: m.iconColor }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={m.icon} /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Form */}
      {formOpen && (
        <div className="bg-white border border-slate-100 rounded-[32px] p-10 mb-10 shadow-xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#007BFF]" />
          <h3 className="text-[18px] font-black text-slate-900 mb-8 uppercase tracking-widest">Add New Payment</h3>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Booking ID *</label>
                <input type="number" required placeholder="e.g. 1024" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={formData.bookingId} onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₱) *</label>
                <input type="number" step="0.01" required placeholder="0.00" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
                <input type="date" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all appearance-none" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
                <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all appearance-none" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>GCash</option>
                  <option>Maya</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Number</label>
                <input type="text" placeholder="REF-XXXXXX" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all" value={formData.referenceNumber} onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] transition-all appearance-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option>Paid</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-slate-50">
              <button type="button" onClick={() => setFormOpen(false)} className="h-14 px-8 rounded-2xl border border-slate-100 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all cursor-pointer">Discard</button>
              <button type="submit" className="h-14 px-10 rounded-2xl bg-[#007BFF] text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-[#007BFF]/20 hover:bg-[#0069D9] transition-all cursor-pointer">Save Payment</button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="cv-table-card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr>
                <th className="min-w-[120px]">Payment ID</th>
                <th className="min-w-[250px]">Booking & Client</th>
                <th className="min-w-[180px]">Amount</th>
                <th className="min-w-[200px]">Method & Reference</th>
                <th className="text-right pr-12">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5" className="px-10 py-6"><div className="h-10 bg-slate-50 animate-pulse rounded-xl" /></td></tr>)
              ) : payments.length === 0 ? (
                <tr><td colSpan="5" className="px-10 py-24 text-center font-black text-slate-200 uppercase tracking-widest">No payments found</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-10 text-[13px] font-black text-slate-300 tracking-widest">#{String(p.paymentId).padStart(6, "0")}</td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-[#007BFF] group-hover:translate-x-1 transition-transform">BK-{p.BookingID}</span>
                        <span className="text-[12px] font-bold text-slate-900 mt-0.5 uppercase tracking-tighter truncate max-w-[220px]" title={p.Booking?.Client?.Name?.replace(/\|/g, " ")}>
                          {p.Booking?.Client?.Name?.replace(/\|/g, " ") || "Direct Payment"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-[20px] font-black text-slate-900 tracking-tight">
                      ₱{parseFloat(p.Amount || 0).toLocaleString("en-PH")}
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-slate-900 tracking-tight">{p.PaymentMethod}</span>
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest truncate max-w-[180px]">{p.ReferenceNumber || "NO-REF"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right pr-12">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        p.Status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-[#007BFF] border-blue-100"
                      }`}>{p.Status}</span>
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
