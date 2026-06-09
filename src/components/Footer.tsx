import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT, CRM_SUBSCRIBE, LOGO_URL } from '@/lib/constants';

export function Footer() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState(true);
  const [done, setDone] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(CRM_SUBSCRIBE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          sms_opt_in: sms,
          source: 'footer-signup',
          tags: ['newsletter', 'hbi'],
        }),
      });
    } catch (_) {}
    setDone(true);
    setEmail('');
    setPhone('');
  };

  return (
    <footer className="bg-[#003A70] text-sky-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={LOGO_URL} alt="HBI" className="h-10 w-10 rounded-full" />
            <span className="font-poppins font-bold text-white">Hinnavaru Blue</span>
          </div>
          <p className="text-sm text-sky-200/80 leading-relaxed">
            A community-led environmental NGO restoring reefs and protecting the marine ecosystems of Lh. Hinnavaru, Maldives.
          </p>
          <div className="flex gap-3 mt-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#00B7E5] transition" aria-label="social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-poppins font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/our-roots" className="hover:text-[#68E0D6]">Our Roots</Link></li>
            <li><Link to="/projects" className="hover:text-[#68E0D6]">Projects</Link></li>
            <li><Link to="/achievements" className="hover:text-[#68E0D6]">Achievements</Link></li>
            <li><Link to="/adopt-a-frame" className="hover:text-[#68E0D6]">Adopt a Frame</Link></li>
            <li><Link to="/contact-us" className="hover:text-[#68E0D6]">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-poppins font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-sky-200/90">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#68E0D6]" />{CONTACT.address}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-[#68E0D6]" />{CONTACT.email}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-[#68E0D6]" />{CONTACT.phone}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-poppins font-semibold text-white mb-4">Stay Updated</h4>
          {done ? (
            <p className="text-sm text-[#68E0D6]">Thank you for joining our blue community!</p>
          ) : (
            <form onSubmit={subscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
              />
              <label className="flex items-start gap-2 text-[11px] text-sky-200/80">
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-0.5" />
                <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
              </label>
              <button className="w-full rounded-lg bg-gradient-to-r from-[#00B7E5] to-[#68E0D6] text-[#003A70] font-semibold py-2 text-sm hover:opacity-90">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-sky-200/70">
        © {new Date().getFullYear()} Hinnavaru Blue Initiative. Protecting Hinnavaru's blue future.
      </div>
    </footer>
  );
}
