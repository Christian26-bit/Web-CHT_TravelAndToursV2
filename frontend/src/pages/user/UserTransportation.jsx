import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserTransportation() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      try {
        const r = await api.get('/transportation');
        if (r.data.success && isMounted) setVehicles(r.data.data);
      } catch (err) {
        console.error('Failed to fetch transportation:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVehicles();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-5"><h2 className="text-lg font-bold text-slate-800">Transportation</h2><p className="text-sm text-slate-500">Vehicle fleet available for trips.</p></div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {['ID','Type','Capacity','Plate Number','Provider'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="5" className="text-center py-12 text-slate-400">Loading...</td></tr>
                : vehicles.length === 0 ? <tr><td colSpan="5" className="text-center py-12 text-slate-400">No vehicles found</td></tr>
                : vehicles.map(v => (
                  <tr key={v.vehicleId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-800">{v.vehicleId}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{v.Type}</td>
                    <td className="px-5 py-3 text-slate-600">{v.Capacity} pax</td>
                    <td className="px-5 py-3 text-slate-600">{v.PlateNumber || '—'}</td>
                    <td className="px-5 py-3 text-slate-600">{v.Provider || '—'}</td>
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
