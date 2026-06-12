import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#DDF7F7] flex flex-col font-inter">
      <Navbar />
      <main className="flex-1 bg-[#DDF7F7]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
