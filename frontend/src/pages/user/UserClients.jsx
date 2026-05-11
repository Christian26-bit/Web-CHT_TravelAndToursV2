import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', address: '', contactNumber: '', customerType: 'REGULAR' });

  const fetchClients = async () => { 
    try { 
      const r = await api.get('/clients'); 
      if (r.data.success) setClients(r.data.data); 
    } catch(err) {
      console.error('Failed to fetch clients:', err);
    } finally { 
      setLoading(false); 
    } 
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchClients());
  }, []);

  const filtered = clients.filter(c => { if (!search) return true; const q = search.toLowerCase(); return c.Name?.toLowerCase().includes(q) || c.Email?.toLowerCase().includes(q); });

  const resetForm = () => setFormData({ id: '', name: '', email: '', address: '', contactNumber: '', customerType: 'REGULAR' });

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.post('/clients', formData); setFormOpen(false); resetForm(); fetchClients(); }
    catch (err) { alert(err.response?.data?.error || 'Failed to save.'); }
  };

  const typeColors = { REGULAR: 'bg-slate-100 text-slate-600', CORPORATE: 'bg-blue-100 text-blue-700', VIP: 'bg-amber-100 text-amber-700' };

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="flex justify-between items-start mb-5">
          <div><h2 className="text-lg font-bold text-slate-800">Clients</h2><p className="text-sm text-slate-500">Manage your client records.</p></div>
          <button onClick={() => { resetForm(); setFormOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            Add Client
          </button>
        </div>

        <div className="relative max-w-[400px] mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['ID','Name','Email','Address','Contact','Type','Registered'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="text-center py-12 text-slate-400">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan="7" className="text-center py-12 text-slate-400">No clients found</td></tr>
                : filtered.map(c => (
                  <tr key={c.clientId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-800">{c.clientId}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{c.Name}</td>
                    <td className="px-5 py-3 text-slate-600">{c.Email}</td>
                    <td className="px-5 py-3 text-slate-600">{c.Address || '—'}</td>
                    <td className="px-5 py-3 text-slate-600">{c.ContactNumber}</td>
                    <td className="px-5 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${typeColors[c.CustomerType] || 'bg-slate-100 text-slate-600'}`}>{c.CustomerType}</span></td>
                    <td className="px-5 py-3 text-slate-500">{c.DateRegistered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Client Accordion */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm mt-6 overflow-hidden">
          <button onClick={() => { if(formOpen){setFormOpen(false);resetForm();}else{resetForm();setFormOpen(true);}}}
            className="w-full flex items-center gap-2 px-5 py-4 bg-slate-50 border-b border-slate-100 text-left text-base font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer">
            <svg className={`w-5 h-5 transition-transform ${formOpen?'rotate-180':''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            Add New Client
          </button>
          {formOpen && (
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Name</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Email</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Address</label><input type="text" value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Contact</label><input type="text" value={formData.contactNumber} onChange={e=>setFormData({...formData,contactNumber:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"/></div>
                <div><label className="block mb-1.5 text-xs font-medium text-slate-500 uppercase">Type</label><select value={formData.customerType} onChange={e=>setFormData({...formData,customerType:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"><option value="REGULAR">Regular</option><option value="CORPORATE">Corporate</option><option value="VIP">VIP</option></select></div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={()=>{setFormOpen(false);resetForm();}} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">Save Client</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
