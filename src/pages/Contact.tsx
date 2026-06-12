import { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  CheckCircle,
  Users,
  MessageCircle,
  Calendar,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { CRM_ENDPOINT } from '@/lib/constants';
import { fetchSiteContent, getSiteObject } from '@/lib/siteContent';

const CONTACT_DEFAULTS = {
  title: 'Contact Us',
  subtitle: 'Reach out to volunteer, partner, or learn more',
  heroImage:
    'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',
  introTitle: 'Get in touch',
  introText:
    "We'd love to hear from you — whether you want to volunteer, partner, donate or just learn more about our work.",
  volunteerTitle: 'Volunteer With Us',
  volunteerText:
    'Join our cleanups, reef care activities, and community restoration work.',
  partnerTitle: 'Schedule a Call',
  partnerText:
    'Speak directly with our team to learn about coral restoration, partnerships, volunteering opportunities, and adopting a coral frame.',
};

const HBI_CONTACT = {
  office: 'Neeth, Lh. Hinnavaru, Maldives',
  phone: '+960 7714340',
  phoneHref: 'tel:+9607714340',
  whatsapp: 'https://wa.me/9607714340',
  email: 'info@hinnavarublue.org',
};

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    sms_opt_in: true,
  });

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['contact_page', 'contact_details']).then(setContent);
  }, []);

  const pageContent = getSiteObject(content, 'contact_page', CONTACT_DEFAULTS);

  const page = {
    ...pageContent,
    volunteerTitle: CONTACT_DEFAULTS.volunteerTitle,
    volunteerText: CONTACT_DEFAULTS.volunteerText,
    partnerTitle: CONTACT_DEFAULTS.partnerTitle,
    partnerText: CONTACT_DEFAULTS.partnerText,
  };

  // Official HBI contact details.
  // Neeth is the office/address, not a person.
  const contactDetails = HBI_CONTACT;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMessage('');
    setSent(false);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
      status: 'new',
    };

    console.log('Contact form payload:', payload);

    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);

    console.error('Contact insert error:', error);

    if (error) {
      setSubmitting(false);
      setErrorMessage(`Message could not be sent: ${error.message}`);
      return;
    }

    try {
      if (CRM_ENDPOINT) {
        await fetch(CRM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim(),
            name: form.name.trim(),
            phone: form.phone.trim() || undefined,
            sms_opt_in: form.sms_opt_in,
            source: 'contact-form',
            tags: ['contact'],
          }),
        });
      }
    } catch (crmError) {
      console.error('CRM sync error:', crmError);
    }

    setSubmitting(false);
    setSent(true);

    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      sms_opt_in: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F0FCFC]">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-[#003A70]">
            {page.introTitle}
          </h2>

          <p className="mt-3 text-slate-600">
            {page.introText}
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="h-10 w-10 rounded-xl bg-[#E8F8F7] flex items-center justify-center text-[#0066B3]">
                <Building2 className="h-5 w-5" />
              </div>
              <span>
                <strong>Office:</strong> {contactDetails.office}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="h-10 w-10 rounded-xl bg-[#E8F8F7] flex items-center justify-center text-[#0066B3]">
                <Phone className="h-5 w-5" />
              </div>
              <a
                href={contactDetails.phoneHref}
                className="font-semibold text-[#0066B3] hover:text-[#003A70]"
              >
                {contactDetails.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="h-10 w-10 rounded-xl bg-[#E8F8F7] flex items-center justify-center text-[#0066B3]">
                <Mail className="h-5 w-5" />
              </div>
              <span>{contactDetails.email}</span>
            </div>

            <a
              href={contactDetails.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4E9B47] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Message Us on WhatsApp
            </a>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <section className="rounded-2xl p-5 bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white">
              <Users className="h-6 w-6 text-[#68E0D6]" />

              <h3 className="mt-3 font-poppins font-bold">
                {page.volunteerTitle}
              </h3>

              <p className="mt-1 text-sm text-sky-100">
                {page.volunteerText}
              </p>

              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline"
              >
                <MessageCircle className="h-4 w-4" />
                Volunteer With Us
              </a>
            </section>

            <section className="rounded-2xl p-5 bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white">
              <Calendar className="h-6 w-6 text-[#68E0D6]" />

              <h3 className="mt-3 font-poppins font-bold">
                {page.partnerTitle}
              </h3>

              <p className="mt-1 text-sm text-sky-100">
                {page.partnerText}
              </p>

              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline"
              >
                <MessageCircle className="h-4 w-4" />
                Schedule a Call
              </a>
            </section>
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-md border border-[#CDEFEF] p-8">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle className="h-14 w-14 text-[#4E9B47] mx-auto" />

              <h3 className="mt-4 font-poppins font-bold text-2xl text-[#003A70]">
                Message Sent!
              </h3>

              <p className="mt-2 text-slate-600">
                Thank you for reaching out. We'll respond as soon as we can.
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 px-5 py-2.5 rounded-full bg-[#0066B3] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {errorMessage && (
                <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <input
                required
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-f w-full"
              />

              <input
                required
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-f w-full"
              />

              <input
                name="phone"
                type="tel"
                placeholder="Phone number optional"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-f w-full"
              />

              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-f w-full"
              />

              <textarea
                required
                name="message"
                placeholder="Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-f w-full"
              />

              <label className="flex items-start gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={form.sms_opt_in}
                  onChange={(e) =>
                    setForm({ ...form, sms_opt_in: e.target.checked })
                  }
                  className="mt-0.5"
                />
                <span>
                  Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

