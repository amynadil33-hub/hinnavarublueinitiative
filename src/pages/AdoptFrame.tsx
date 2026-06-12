import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  CheckCircle,
  Heart,
  Camera,
  MessageCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { CRM_ENDPOINT } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import type { Frame, FrameProgress } from '@/lib/types';

type AdoptStep = {
  t: string;
  d: string;
};

type FrameProgressWithFrame = FrameProgress & {
  frames?: Frame;
};

const ADOPT_DEFAULTS = {
  title: 'Adopt a Coral Frame',
  subtitle: "Give a reef a future — sponsor a coral frame in Hinnavaru's waters",
  heroImage:
    'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965118488_5a4fb952.jpg',
  steps: [
    {
      t: 'Choose a Frame',
      d: 'Browse our available coral frames and pick one to sponsor.',
    },
    {
      t: 'Submit Your Details',
      d: 'Send your adoption request so our team can confirm the next steps.',
    },
    {
      t: 'Watch it Grow',
      d: 'Follow progress updates as your coral frame supports reef recovery.',
    },
  ],
};

const WHATSAPP_URL = 'https://wa.me/9607714340';

const formatMvrAmount = (amount?: number | null) =>
  `MVR ${Number(amount ?? 0).toLocaleString('en-US')}`;

const isMostPopularPackage = (frame: Frame) =>
  frame.frame_code.trim().toLowerCase() === 'reef guardian';

export default function AdoptFrame() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [frames, setFrames] = useState<Frame[]>([]);
  const [progress, setProgress] = useState<FrameProgressWithFrame[]>([]);
  const [selected, setSelected] = useState<Frame | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [content, setContent] = useState<Record<string, unknown>>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    donor_type: 'Individual',
    display_name: '',
    dedication_message: '',
    sms_opt_in: true,
  });

  useEffect(() => {
    fetchSiteContent(['adopt_frame_page', 'adopt_frame_steps']).then(setContent);
    loadFrames();
    loadProgress();
  }, []);

  const loadFrames = async () => {
    const { data, error } = await supabase
      .from('frames')
      .select('*')
      .order('donation_amount', { ascending: true });

    console.log('Frames result:', data);
    console.error('Frames error:', error);

    setFrames(data || []);
  };

  const loadProgress = async () => {
    const { data, error } = await supabase
      .from('frame_progress')
      .select('*, frames(*)')
      .order('progress_date', { ascending: false })
      .limit(6);

    console.log('Frame progress result:', data);
    console.error('Frame progress error:', error);

    setProgress((data as FrameProgressWithFrame[]) || []);
  };

  const selectFrame = (frame: Frame) => {
    setSelected(frame);
    setSubmitted(false);
    setErrorMessage('');

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selected) {
      setErrorMessage('Please choose a coral frame before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitted(false);
    setErrorMessage('');

    const payload = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      country: form.country.trim() || null,
      donor_type: form.donor_type,
      frame_id: selected.id,
      display_name: form.display_name.trim() || null,
      dedication_message: form.dedication_message.trim() || null,
      status: 'pending',
    };

    console.log('Adoption request payload:', payload);

    const { data, error } = await supabase
      .from('adoption_requests')
      .insert([payload])
      .select();

    console.log('Adoption request result:', data);
    console.error('Adoption request error:', error);

    if (error) {
      setSubmitting(false);
      setErrorMessage(`Adoption request could not be submitted: ${error.message}`);
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
            source: 'adopt-a-frame',
            tags: ['donor', 'frame-adoption'],
          }),
        });
      }
    } catch (crmError) {
      console.error('CRM sync error:', crmError);
    }

    setSubmitting(false);
    setSubmitted(true);

    setForm({
      name: '',
      email: '',
      phone: '',
      country: '',
      donor_type: 'Individual',
      display_name: '',
      dedication_message: '',
      sms_opt_in: true,
    });
  };

  const page = getSiteObject(content, 'adopt_frame_page', ADOPT_DEFAULTS);
  const steps = getSiteArray<AdoptStep>(
    content,
    'adopt_frame_steps',
    page.steps as AdoptStep[]
  );

  return (
    <div className="min-h-screen bg-[#F0FCFC]">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.t}
              className="rounded-3xl bg-white p-6 shadow-sm border border-[#CDEFEF]"
            >
              <div className="h-10 w-10 rounded-full bg-[#0066B3] text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <h3 className="mt-4 font-poppins font-bold text-[#003A70]">
                {step.t}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {step.d}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-[#00B7E5] font-semibold">
              CORAL FRAME ADOPTION
            </span>

            <h2 className="mt-2 font-poppins font-bold text-3xl text-[#003A70]">
              Choose an adoption package
            </h2>

            <p className="mt-3 text-slate-600 max-w-2xl">
              Select a one-time coral frame contribution package below and the adoption form will open for that package.
            </p>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4E9B47] text-white text-sm font-semibold hover:opacity-90 transition w-fit"
          >
            <MessageCircle className="h-4 w-4" />
            Ask on WhatsApp
          </a>
        </div>

        {frames.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {frames.map((frame) => {
              const status = frame.status.toLowerCase();
              const canAdopt = status === 'available' || status === 'reserved';

              return (
                <article
                  key={frame.id}
                  className={`relative rounded-3xl overflow-hidden bg-white border shadow-sm transition ${
                    selected?.id === frame.id
                      ? 'border-[#00B7E5] ring-2 ring-[#68E0D6]/50'
                      : isMostPopularPackage(frame)
                      ? 'border-[#00B7E5] shadow-lg hover:-translate-y-1'
                      : 'border-[#CDEFEF] hover:-translate-y-1'
                  }`}
                >
                  {isMostPopularPackage(frame) && (
                    <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#68E0D6] to-[#F5E7B2] px-3 py-1 text-xs font-bold text-[#003A70] shadow">
                      Most Popular
                    </div>
                  )}

                  <div className="relative h-44 bg-[#E8F8F7] overflow-hidden">
                    {frame.photo ? (
                      <img
                        src={frame.photo}
                        alt={frame.frame_code}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#EFFFFD] to-[#DDF7FF] flex items-center justify-center">
                        <Heart className="h-10 w-10 text-[#00B7E5]" />
                      </div>
                    )}

                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        status === 'available'
                          ? 'bg-[#4E9B47] text-white'
                          : status === 'adopted'
                          ? 'bg-[#003A70] text-white'
                          : 'bg-white/90 text-[#003A70]'
                      }`}
                    >
                      {frame.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-poppins font-bold text-[#003A70]">
                      {frame.frame_code}
                    </h3>

                    {frame.location && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {frame.location}
                      </p>
                    )}

                    {frame.description && (
                      <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                        {frame.description}
                      </p>
                    )}

                    <div className="mt-5 rounded-2xl bg-[#E8F8F7] p-4 text-center">
                      <div className="font-poppins text-3xl font-extrabold text-[#0066B3]">
                        {formatMvrAmount(frame.donation_amount)}
                      </div>

                      <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500">
                        one-time contribution
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAdopt}
                      onClick={() => selectFrame(frame)}
                      className="mt-4 w-full rounded-full py-2.5 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {`Choose ${frame.frame_code}`}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#CDEFEF] p-10 text-center">
            <p className="text-slate-500">
              Coral frames will appear here once they are added in Supabase.
            </p>
          </div>
        )}
      </section>

      {/* Adoption Form */}
      <section ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-[2rem] bg-white shadow-md border border-[#CDEFEF] overflow-hidden">
          <div className="bg-gradient-to-r from-[#003A70] to-[#0066B3] p-6 text-white">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-[#68E0D6]" />
              <div>
                <h2 className="font-poppins font-bold text-2xl">
                  Adoption Request Form
                </h2>

                <p className="text-sm text-sky-100 mt-1">
                  {selected
                    ? `You are requesting to adopt ${selected.frame_code}.`
                    : 'Choose a frame above to begin your adoption request.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="h-14 w-14 text-[#4E9B47] mx-auto" />

                <h3 className="mt-4 font-poppins font-bold text-2xl text-[#003A70]">
                  Thank You!
                </h3>

                <p className="mt-2 text-slate-600">
                  Your adoption request has been received. We'll be in touch shortly
                  with the next steps.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSelected(null);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#0066B3] text-white font-semibold"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {!selected && (
                  <div className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 p-4 text-sm">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>Please choose a coral frame before submitting the form.</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    required
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-f"
                  />

                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-f"
                  />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone / WhatsApp optional"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-f"
                  />

                  <input
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="input-f"
                  />

                  <select
                    name="donor_type"
                    value={form.donor_type}
                    onChange={(e) =>
                      setForm({ ...form, donor_type: e.target.value })
                    }
                    className="input-f"
                  >
                    <option>Individual</option>
                    <option>Family</option>
                    <option>Corporate</option>
                    <option>School</option>
                    <option>Other</option>
                  </select>

                  <input
                    name="display_name"
                    placeholder="Display Name public optional"
                    value={form.display_name}
                    onChange={(e) =>
                      setForm({ ...form, display_name: e.target.value })
                    }
                    className="input-f"
                  />
                </div>

                <textarea
                  name="dedication_message"
                  placeholder="Dedication Message optional"
                  value={form.dedication_message}
                  onChange={(e) =>
                    setForm({ ...form, dedication_message: e.target.value })
                  }
                  rows={4}
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
                    Text me updates. Msg &amp; data rates may apply. Reply STOP to
                    unsubscribe.
                  </span>
                </label>

                {selected && (
                  <div className="rounded-2xl bg-[#E8F8F7] p-4 flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Selected package
                    </span>

                    <span className="font-bold text-[#0066B3]">
                      {selected.frame_code}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !selected}
                  className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Adoption Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {progress.length > 0 && (
        <section className="bg-[#E8F8F7] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="h-6 w-6 text-[#00B7E5]" />
              <h2 className="font-poppins font-bold text-2xl text-[#003A70]">
                Frame Progress Updates
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-[#FAFFFF] border border-[#CDEFEF]"
                >
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt=""
                      className="h-44 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <span className="text-xs font-semibold text-[#0066B3]">
                      {item.frames?.frame_code}
                    </span>

                    <p className="mt-1 text-sm text-slate-600">
                      {item.note}
                    </p>

                    {item.progress_date && (
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(item.progress_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

