import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Users, MessageCircle } from 'lucide-react';
import { CONTACT, CRM_SUBSCRIBE, LOGO_URL } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';

type FooterNavItem = { to: string; label: string };
type SocialLink = { url: string; label?: string };

export function Footer() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState(true);
  const [done, setDone] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['footer', 'navigation', 'contact_details', 'site_settings', 'social_links']).then(setContent);
  }, []);

  const footer = getSiteObject(content, 'footer', {
    description: 'A community-led environmental NGO restoring reefs and protecting the marine ecosystems of Lh. Hinnavaru, Maldives.',
    copyright: "Protecting Hinnavaru's blue future.",
  });
  const contactDetails = { ...getSiteObject(content, 'contact_details', CONTACT), ...CONTACT };
  const settings = getSiteObject(content, 'site_settings', { siteName: 'Hinnavaru Blue' });
  const navItems = getSiteArray<FooterNavItem>(content, 'navigation', [
    { to: '/our-roots', label: 'Our Roots' },
    { to: '/projects', label: 'Projects' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/adopt-a-frame', label: 'Adopt a Frame' },
    { to: '/contact-us', label: 'Contact Us' },
  ]);
  const socialLinks = getSiteArray<SocialLink>(content, 'social_links', []);

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
    } catch (crmError) {
      console.error('CRM subscribe error:', crmError);
    }
    setDone(true);
    setEmail('');
    setPhone('');
  };

  return (
    <footer className="bg-[#003A70] text-sky-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={LOGO_URL} alt="Hinnavaru Blue Initiative logo" className="h-10 w-10 object-contain" />
            <span className="font-poppins font-bold text-white">{settings.siteName}</span>
          </div>
          <p className="text-sm text-sky-200/80 leading-relaxed">
            {footer.description}
          </p>
          <div className="flex gap-3 mt-4">
            {socialLinks.map((link, i) => {
              const icons = [Facebook, Instagram, Twitter];
              const Icon = icons[i] || Facebook;
              return (
                <a key={link.url || i} href={link.url} className="p-2 rounded-full bg-white/10 hover:bg-[#00B7E5] transition" aria-label={link.label || 'social'}>
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-poppins font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.to}><Link to={item.to} className="hover:text-[#68E0D6]">{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-poppins font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-sky-200/90">
            <li className="flex gap-2"><Users className="h-4 w-4 mt-0.5 text-[#68E0D6]" />Contact Person: {contactDetails.person}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#68E0D6]" />{contactDetails.address}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-[#68E0D6]" />{contactDetails.email}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-[#68E0D6]" /><a href={contactDetails.phoneHref} className="hover:text-[#68E0D6]">{contactDetails.phone}</a></li>
            <li>
              <a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#68E0D6] hover:text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp Neeth
              </a>
            </li>
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
        © {new Date().getFullYear()} Hinnavaru Blue Initiative. {footer.copyright}
      </div>
    </footer>
  );
}
