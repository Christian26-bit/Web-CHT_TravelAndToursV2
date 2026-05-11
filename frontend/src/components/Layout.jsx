import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ role }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-[260px] min-w-0">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
