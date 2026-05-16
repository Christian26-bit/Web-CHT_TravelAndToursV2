import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ role }) {
  return (
    <div className="flex min-h-screen bg-[#F0F1F1]">
      {/* Fixed Sidebar */}
      <Sidebar role={role} />

      {/* Content Area Shell */}
      <div className="cv-content-shell">
        {/* Sticky Topbar */}
        <Topbar />

        {/* Dynamic Page Content */}
        <main className="cv-page-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
