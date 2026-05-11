import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHotels = async () => {
      try {
        const r = await api.get('/hotels');
        if (r.data.success && isMounted) setHotels(r.data.data);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-5"><h2 className="text-lg font-bold text-slate-800">Hotels & Accommodations</h2><p className="text-sm text-slate-500">Available accommodations for trips.</p></div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['ID','Name','Address','Contact','Room Type','Rooms','Amenities'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="text-center py-12 text-slate-400">Loading...</td></tr>
                : hotels.length === 0 ? <tr><td colSpan="7" className="text-center py-12 text-slate-400">No accommodations found</td></tr>
                : hotels.map(h => (
                  <tr key={h.accommodationId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-800">{h.accommodationId}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{h.Name}</td>
                    <td className="px-5 py-3 text-slate-600">{h.Address}</td>
                    <td className="px-5 py-3 text-slate-600">{h.Contact || '—'}</td>
                    <td className="px-5 py-3"><span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">{h.DefaultRoomType || '—'}</span></td>
                    <td className="px-5 py-3 text-slate-600">{h.NumberOfRooms}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">{h.Amenities || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
