import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ role }) {
  return (
    <div className="flex min-h-screen bg-[#F0F1F1]">
      <Sidebar role={role} />

      <div className="cv-content-shell">
        <Topbar />

        <main className="cv-page-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
