import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LOGO_URL } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';

type NavItem = { to: string; label: string };

const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/our-roots', label: 'Our Roots' },
  { to: '/projects', label: 'Projects' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/adopt-a-frame', label: 'Adopt a Frame' },
  { to: '/contact-us', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const { pathname } = useLocation();

  useEffect(() => {
    fetchSiteContent(['navigation', 'site_settings']).then(setContent);
  }, []);

  const navItems = getSiteArray<NavItem>(content, 'navigation', NAV);
  const settings = getSiteObject(content, 'site_settings', { siteName: 'Hinnavaru Blue', siteTagline: 'INITIATIVE' });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Hinnavaru Blue Initiative logo" className="h-10 w-10 lg:h-12 lg:w-12 object-contain" />
          <div className="leading-tight">
            <span className="block font-poppins font-bold text-[#003A70] text-sm sm:text-base">{settings.siteName}</span>
            <span className="block text-[10px] sm:text-xs text-sky-600 tracking-wide">{settings.siteTagline}</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === n.to ? 'text-[#0066B3] bg-sky-50' : 'text-slate-600 hover:text-[#0066B3] hover:bg-sky-50'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/adopt-a-frame"
            className="ml-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90 transition shadow"
          >
            Adopt a Frame
          </Link>
        </nav>

        <button className="lg:hidden p-2 text-[#003A70]" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden bg-white border-t border-sky-100 px-4 py-3 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === n.to ? 'text-[#0066B3] bg-sky-50' : 'text-slate-700 hover:bg-sky-50'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
