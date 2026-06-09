import { useEffect, useState } from 'react';
import { MapPin, Mail, Phone, CheckCircle, Users, Handshake } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { CONTACT, CRM_SUBSCRIBE, BOOKING_URL } from '@/lib/constants';
import { fetchSiteContent, getSiteObject } from '@/lib/siteContent';

const CONTACT_DEFAULTS = {
  title: 'Contact Us',
  subtitle: 'Reach out to volunteer, partner, or learn more',
  heroImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',
  introTitle: 'Get in touch',
  introText: "We'd love to hear from you — whether you want to volunteer, partner, donate or just learn more about our work.",
  volunteerTitle: 'Volunteer with us',
  volunteerText: 'Join our cleanups and restoration dives.',
  partnerTitle: 'Partner with us',
  partnerText: 'Resorts, councils and NGOs welcome.',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', sms_opt_in: true });
  const [sent, setSent] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['contact_page', 'contact_details']).then(setContent);
  }, []);

  const page = getSiteObject(content, 'contact_page', CONTACT_DEFAULTS);
  const contactDetails = getSiteObject(content, 'contact_details', CONTACT);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email, phone: form.phone || null, subject: form.subject, message: form.message,
    }).select();
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    try {
      await fetch(CRM_SUBSCRIBE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, name: form.name, phone: form.phone || undefined,
          sms_opt_in: form.sms_opt_in, source: 'contact-form', tags: ['contact'],
        }),
      });
    } catch (crmError) {
      console.error('CRM subscribe error:', crmError);
    }
    setSent(true);
  };

  return (
    <div>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-[#003A70]">{page.introTitle}</h2>
          <p className="mt-3 text-slate-600">{page.introText}</p>

          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, label: contactDetails.address },
              { icon: Mail, label: contactDetails.email },
              { icon: Phone, label: contactDetails.phone },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#0066B3]"><c.icon className="h-5 w-5" /></div>
                {c.label}
              </div>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white">
              <Users className="h-6 w-6 text-[#68E0D6]" />
              <h3 className="mt-3 font-poppins font-bold">{page.volunteerTitle}</h3>
              <p className="mt-1 text-sm text-sky-100">{page.volunteerText}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline">Book a call</a>
            </div>
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white">
              <Handshake className="h-6 w-6 text-[#68E0D6]" />
              <h3 className="mt-3 font-poppins font-bold">{page.partnerTitle}</h3>
              <p className="mt-1 text-sm text-sky-100">{page.partnerText}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline">Schedule a meeting</a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-md border border-sky-50 p-8">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle className="h-14 w-14 text-[#4E9B47] mx-auto" />
              <h3 className="mt-4 font-poppins font-bold text-2xl text-[#003A70]">Message Sent!</h3>
              <p className="mt-2 text-slate-600">Thank you for reaching out. We'll respond as soon as we can.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-f w-full" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-f w-full" />
              <input type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-f w-full" />
              <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-f w-full" />
              <textarea required placeholder="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-f w-full" />
              <label className="flex items-start gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={form.sms_opt_in} onChange={(e) => setForm({ ...form, sms_opt_in: e.target.checked })} className="mt-0.5" />
                <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
              </label>
              <button className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90">Send Message</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
