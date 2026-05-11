import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get('/bookings_list');
      if (res.data.success) setBookings(res.data.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      await fetchBookings();
      if (!mounted) return;
    };

    loadData();
    
    return () => { mounted = false; };
  }, [fetchBookings]);

  const handleDelete = async (id) => {
    try { 
      await api.post('/bookings_delete', { id }); 
      setDeleteConfirm(null); 
      fetchBookings(); 
    }
    catch (err) { 
      alert(err.response?.data?.error || 'Failed to delete.'); 
      setDeleteConfirm(null); 
    }
  };

  const filtered = bookings.filter(b => statusFilter === 'all' || (b.Status || b.status)?.toLowerCase() === statusFilter);

  return (
    <>
      <Topbar />
      <div className="cv-main-container animate-fade-in">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="cv-page-title">My Bookings</h1>
            <p className="cv-page-subtitle">Track and manage all your travel arrangements.</p>
          </div>
          <button onClick={() => navigate('/bookings/step/1')} className="cv-btn cv-btn-primary">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            New Booking
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['all','confirmed','pending','cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`cv-btn cv-btn-sm ${statusFilter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'cv-btn-outline'}`}>
              <span className="capitalize">{s}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-black ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {s === 'all' ? bookings.length : bookings.filter(b => (b.Status || b.status)?.toLowerCase() === s).length}
              </span>
            </button>
          ))}
        </div>

        <div className="cv-table-wrapper">
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead>
                <tr>
                  {['Booking ID','Client','Package','Destination','Date','Pax','Status','Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="8" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading bookings...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan="8" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No bookings found</td></tr>
                : filtered.map(b => (
                  <tr key={b.BookingID}>
                    <td className="font-black text-blue-600">BK-{String(b.BookingID).padStart(4,'0')}</td>
                    <td className="font-bold text-slate-900">{b.Client?.name || b.clientName || '—'}</td>
                    <td className="font-medium text-slate-600">{b.Package?.Name || b.packageName || '—'}</td>
                    <td className="font-medium text-slate-600">{b.Package?.Destination || b.destination || '—'}</td>
                    <td className="text-slate-400 font-bold text-[13px]">{b.BookingDate || b.startDate}</td>
                    <td className="font-bold text-slate-700">{b.PaxCount || b.pax}</td>
                    <td>
                      <span className={`cv-badge cv-badge-${(b.Status || b.status)?.toLowerCase()}`}>
                        {b.Status || b.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(b.BookingID)} className="w-9 h-9 rounded-xl border border-red-100 bg-red-50/50 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all cursor-pointer">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-[32px] p-10 shadow-2xl max-w-md w-full mx-4 border border-slate-100">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Delete Booking?</h3>
              <p className="text-slate-500 font-medium mb-8">Are you sure you want to delete this booking? This action cannot be undone and will remove all associated data.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 cv-btn cv-btn-outline">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 cv-btn bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
