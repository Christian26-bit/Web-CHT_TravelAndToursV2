import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTrips = async () => {
      try {
        const r = await api.get('/trips');
        if (r.data.success && isMounted) setTrips(r.data.data);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTrips();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-5"><h2 className="text-lg font-bold text-slate-800">Trip Itineraries</h2><p className="text-sm text-slate-500">View available trip itineraries and their details.</p></div>

        {loading ? <p className="text-center py-12 text-slate-400">Loading...</p>
        : trips.length === 0 ? <p className="text-center py-12 text-slate-400">No trips found</p>
        : (
          <div className="space-y-3">
            {trips.map(t => (
              <div key={t.tripId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => setExpanded(expanded === t.tripId ? null : t.tripId)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg">✈️</div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{t.Name}</h3>
                      <p className="text-xs text-slate-500">{t.Location || 'No location'} • {t.StartDate} to {t.EndDate}</p>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${expanded === t.tripId ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                </button>
                {expanded === t.tripId && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 animate-[fadeIn_0.2s_ease]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Activities</h4>
                        {t.Activities?.length > 0 ? (
                          <ul className="space-y-1">{t.Activities.map((a,i) => <li key={i} className="text-sm text-slate-700 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{a.Name}</li>)}</ul>
                        ) : <p className="text-xs text-slate-400">No activities</p>}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Accommodations</h4>
                        {t.Accommodations?.length > 0 ? (
                          <ul className="space-y-1">{t.Accommodations.map((a,i) => <li key={i} className="text-sm text-slate-700 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{a.Name}</li>)}</ul>
                        ) : <p className="text-xs text-slate-400">No accommodations</p>}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Vehicles</h4>
                        {t.Vehicles?.length > 0 ? (
                          <ul className="space-y-1">{t.Vehicles.map((v,i) => <li key={i} className="text-sm text-slate-700 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{v.Type} ({v.Capacity} pax)</li>)}</ul>
                        ) : <p className="text-xs text-slate-400">No vehicles</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
