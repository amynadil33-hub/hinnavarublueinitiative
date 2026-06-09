import { useEffect, useState } from 'react';
import { X, CheckCircle, Heart, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { FrameCard } from '@/components/FrameCard';
import { CRM_SUBSCRIBE } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import type { Frame, FrameProgress } from '@/lib/types';

type AdoptStep = { t: string; d: string };

type FrameProgressWithFrame = FrameProgress & { frames?: Frame };

const ADOPT_DEFAULTS = {
  title: 'Adopt a Coral Frame',
  subtitle: "Give a reef a future — sponsor a coral frame in Hinnavaru's waters",
  heroImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965118488_5a4fb952.jpg',
  steps: [
    { t: 'Choose a Frame', d: 'Browse our available coral frames and pick one to sponsor.' },
    { t: 'Make a Donation', d: 'Your donation funds the frame, fragments and ongoing care.' },
    { t: 'Watch it Grow', d: 'Receive photo updates as your coral flourishes on the reef.' },
  ],
};

export default function AdoptFrame() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [progress, setProgress] = useState<FrameProgressWithFrame[]>([]);
  const [selected, setSelected] = useState<Frame | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '', donor_type: 'Individual',
    display_name: '', dedication_message: '', sms_opt_in: true,
  });

  useEffect(() => {
    fetchSiteContent(['adopt_frame_page', 'adopt_frame_steps']).then(setContent);
    load();
    supabase.from('frame_progress').select('*, frames(*)').order('progress_date', { ascending: false }).limit(6)
      .then(({ data, error }) => {
        console.log('Supabase result:', data);
        console.error('Supabase error:', error);
        setProgress((data as FrameProgressWithFrame[]) || []);
      });
  }, []);

  const load = () => supabase.from('frames').select('*').order('frame_code').then(({ data, error }) => {
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    setFrames(data || []);
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('adoption_requests').insert({
      name: form.name, email: form.email, phone: form.phone || null, country: form.country,
      donor_type: form.donor_type, frame_id: selected?.id, display_name: form.display_name,
      dedication_message: form.dedication_message,
    }).select();
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    try {
      await fetch(CRM_SUBSCRIBE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, name: form.name, phone: form.phone || undefined,
          sms_opt_in: form.sms_opt_in, source: 'adopt-a-frame', tags: ['donor', 'frame-adoption'],
        }),
      });
    } catch (crmError) {
      console.error('CRM subscribe error:', crmError);
    }
    setSubmitted(true);
  };

  const page = getSiteObject(content, 'adopt_frame_page', ADOPT_DEFAULTS);
  const steps = getSiteArray<AdoptStep>(content, 'adopt_frame_steps', page.steps as AdoptStep[]);

  return (
    <div>
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-sky-50">
              <div className="h-10 w-10 rounded-full bg-[#0066B3] text-white flex items-center justify-center font-bold">{i + 1}</div>
              <h3 className="mt-4 font-poppins font-bold text-[#003A70]">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>

        <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-6">Available Frames</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {frames.map((f) => <FrameCard key={f.id} frame={f} onAdopt={(fr) => { setSelected(fr); setSubmitted(false); }} />)}
        </div>
      </section>

      {progress.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="h-6 w-6 text-[#00B7E5]" />
              <h2 className="font-poppins font-bold text-2xl text-[#003A70]">Frame Progress Updates</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden bg-[#f7fbfe] border border-sky-50">
                  {p.photo && <img src={p.photo} alt="" className="h-44 w-full object-cover" />}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-[#0066B3]">{p.frames?.frame_code}</span>
                    <p className="mt-1 text-sm text-slate-600">{p.note}</p>
                    {p.progress_date && <p className="mt-2 text-xs text-slate-400">{new Date(p.progress_date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full my-8 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X /></button>
            {submitted ? (
              <div className="p-10 text-center">
                <CheckCircle className="h-14 w-14 text-[#4E9B47] mx-auto" />
                <h3 className="mt-4 font-poppins font-bold text-2xl text-[#003A70]">Thank You!</h3>
                <p className="mt-2 text-slate-600">Your adoption request for <b>{selected.frame_code}</b> has been received. We'll be in touch shortly with next steps.</p>
                <button onClick={() => setSelected(null)} className="mt-6 px-6 py-2.5 rounded-full bg-[#0066B3] text-white font-semibold">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="h-6 w-6 text-[#00B7E5]" />
                  <h3 className="font-poppins font-bold text-xl text-[#003A70]">Adopt {selected.frame_code}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-f" />
                  <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-f" />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-f" />
                  <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-f" />
                  <select value={form.donor_type} onChange={(e) => setForm({ ...form, donor_type: e.target.value })} className="input-f">
                    <option>Individual</option><option>Family</option><option>Corporate</option><option>School</option>
                  </select>
                  <input placeholder="Display Name (public)" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="input-f" />
                </div>
                <textarea placeholder="Dedication Message" value={form.dedication_message} onChange={(e) => setForm({ ...form, dedication_message: e.target.value })} rows={3} className="input-f w-full mt-3" />
                <label className="flex items-start gap-2 text-xs text-slate-500 mt-3">
                  <input type="checkbox" checked={form.sms_opt_in} onChange={(e) => setForm({ ...form, sms_opt_in: e.target.checked })} className="mt-0.5" />
                  <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
                </label>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>Donation</span>
                  <span className="font-bold text-[#0066B3] text-lg">${selected.donation_amount}</span>
                </div>
                <button className="mt-4 w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90">
                  Submit Adoption Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
