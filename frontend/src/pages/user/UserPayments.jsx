import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ bookingId: '', amount: '', paymentDate: '', paymentMethod: 'Cash', referenceNumber: '', status: 'Paid' });

  const fetchPayments = async () => { 
    try { 
      const r = await api.get('/payments'); 
      if (r.data.success) setPayments(r.data.data); 
    } catch(err) {
      console.error('Failed to fetch payments:', err);
    } finally { 
      setLoading(false); 
    } 
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchPayments());
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.post('/payments', formData); setFormOpen(false); setFormData({ bookingId: '', amount: '', paymentDate: '', paymentMethod: 'Cash', referenceNumber: '', status: 'Paid' }); fetchPayments(); }
    catch (err) { alert(err.response?.data?.error || 'Failed to save.'); }
  };

  const statusColors = { Paid: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Failed: 'bg-red-100 text-red-700', Refunded: 'bg-blue-100 text-blue-700' };

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="flex justify-between items-start mb-5">
          <div><h2 className="text-lg font-bold text-slate-800">Payments</h2><p className="text-sm text-slate-500">View and record payment transactions.</p></div>
          <button onClick={() => setFormOpen(!formOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Record Payment
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['ID','Booking','Client','Amount','Date','Method','Ref #','Status'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="8" className="text-center py-12 text-slate-400">Loading...</td></tr>
                : payments.length === 0 ? <tr><td colSpan="8" className="text-center py-12 text-slate-400">No payments</td></tr>
                : payments.map(p => (
                  <tr key={p.paymentId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-800">{p.paymentId}</td>
                    <td className="px-5 py-3 text-blue-600 font-medium">BK-{String(p.BookingID).padStart(4,'0')}</td>
                    <td className="px-5 py-3 text-slate-800">{p.Booking?.Client?.Name || '—'}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">₱{parseFloat(p.Amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3 text-slate-500">{p.PaymentDate}</td>
                    <td className="px-5 py-3 text-slate-600">{p.PaymentMethod}</td>
                    <td className="px-5 py-3 text-slate-500">{p.ReferenceNumber || '—'}</td>
                    <td className="px-5 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.Status] || 'bg-slate-100 text-slate-600'}`}>{p.Status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Payment Form */}
        {formOpen && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm mt-6 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100"><h3 className="text-base font-semibold text-slate-800">Record Payment</h3></div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Booking ID</label><input type="number" value={formData.bookingId} onChange={e => setFormData({...formData, bookingId: e.target.value})} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Amount (₱)</label><input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Date</label><input type="date" value={formData.paymentDate} onChange={e => setFormData({...formData, paymentDate: e.target.value})} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Method</label><select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"><option>Cash</option><option>Bank Transfer</option><option>Credit Card</option><option>GCash</option></select></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Reference #</label><input type="text" value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"><option>Paid</option><option>Pending</option></select></div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">Save Payment</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
