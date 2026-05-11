import { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserTourPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchPackages = async () => { 
      try { 
        const r = await api.get('/tour-packages'); 
        if (r.data.success && isMounted) setPackages(r.data.data); 
      } catch(err) {
        console.error('Failed to fetch packages:', err);
      } finally { 
        if (isMounted) setLoading(false); 
      } 
    };
    fetchPackages();
    return () => { isMounted = false; };
  }, []);

  const filtered = packages.filter(p => { if (!search) return true; const q = search.toLowerCase(); return p.Name?.toLowerCase().includes(q) || p.Destination?.toLowerCase().includes(q); });

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">Tour Packages</h2>
          <p className="text-sm text-slate-500">Browse available tour packages.</p>
        </div>

        <div className="relative max-w-[400px] mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" placeholder="Search by name or destination..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        </div>

        {loading ? <p className="text-center py-12 text-slate-400">Loading packages...</p>
        : filtered.length === 0 ? <p className="text-center py-12 text-slate-400">No packages found</p>
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pkg => (
              <div key={pkg.PackageID} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                  <h3 className="text-lg font-bold mb-1">{pkg.Name}</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                    {pkg.Destination || 'Various'}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{pkg.Description || 'No description available.'}</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase">Duration</p>
                      <p className="text-sm font-bold text-slate-800">{pkg.Duration} days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase">Max Pax</p>
                      <p className="text-sm font-bold text-slate-800">{pkg.MaxPax}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase">Price</p>
                      <p className="text-sm font-bold text-blue-600">₱{parseFloat(pkg.Price || 0).toLocaleString('en-PH')}</p>
                    </div>
                  </div>
                  {pkg.Inclusions && <p className="text-xs text-slate-500 border-t border-slate-100 pt-3"><strong>Includes:</strong> {pkg.Inclusions}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
