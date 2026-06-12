import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F0FCFC] flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 bg-[#F0FCFC]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
