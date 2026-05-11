import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try { 
        const res = await api.get('/user_dashboard_summary'); 
        if (res.data.success && isMounted) { 
          setStats(res.data.data); 
          setBookings(res.data.data.recentBookings || []); 
        } 
      }
      catch (err) { console.error(err); } finally { if (isMounted) setLoading(false); }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  const metrics = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? '0', color: 'blue', icon: <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
    { label: 'Ongoing Trips', value: stats?.ongoingTrips ?? '0', color: 'amber', icon: <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg> },
    { label: 'Upcoming Trips', value: stats?.upcomingTrips ?? '0', color: 'green', icon: <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z"/></svg> },
    { label: 'Completed Trips', value: stats?.completedTrips ?? '0', color: 'violet', icon: <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> },
  ];

  return (
    <>
      <Topbar />
      <div className="cv-main-container animate-fade-in">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="cv-page-title">Traveler Dashboard</h1>
            <p className="cv-page-subtitle">Welcome back! Here's your travel overview.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/user/clients')} className="cv-btn cv-btn-outline">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Clients
            </button>
            <button onClick={() => navigate('/bookings/step/1')} className="cv-btn cv-btn-primary">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              New Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((m, i) => (
            <div key={i} className="cv-metric-card group">
              <div>
                <p className="cv-metric-label">{m.label}</p>
                <p className="cv-metric-value">{m.value}</p>
              </div>
              <div className={`cv-icon-box ${m.color}`}>
                {m.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="cv-table-wrapper">
          <div className="flex justify-between items-center px-10 py-7 border-b border-slate-100 bg-slate-50/20">
            <div>
              <h2 className="text-[18px] font-black text-slate-900 tracking-tight uppercase">Recent Bookings</h2>
              <p className="text-[13px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Latest travel activities</p>
            </div>
            <button onClick={() => navigate('/user/bookings')} className="cv-btn cv-btn-outline cv-btn-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead>
                <tr>
                  {['Booking ID','Customer','Destination','Package','Date','Status'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading data...</td></tr>
                : bookings.length === 0 ? <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No bookings found</td></tr>
                : bookings.map(b => (
                  <tr key={b.BookingID}>
                    <td className="font-black text-blue-600">BK-{String(b.BookingID).padStart(4,'0')}</td>
                    <td className="font-bold text-slate-900">{b.Client?.name || b.clientName || '—'}</td>
                    <td className="font-medium text-slate-500">{b.Package?.Destination || b.destination || '—'}</td>
                    <td className="font-medium text-slate-500">{b.Package?.Name || b.packageName || '—'}</td>
                    <td className="text-slate-400 font-bold text-[13px]">{b.BookingDate || b.startDate}</td>
                    <td>
                      <span className={`cv-badge cv-badge-${(b.Status || b.status)?.toLowerCase()}`}>
                        {b.Status || b.status}
                      </span>
                    </td>
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
