import { useEffect, useState } from 'react';
import { Award, X, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { fetchSiteContent, getSiteObject } from '@/lib/siteContent';
import type { Achievement } from '@/lib/types';

export default function Achievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeImage, setActiveImage] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchSiteContent(['achievements_page']).then(setContent);

    supabase
      .from('achievements')
      .select('*')
      .eq('published', true)
      .eq('category', 'Awards')
      .order('achievement_date', { ascending: false })
      .then(({ data, error }) => {
        console.log('Supabase awards result:', data);
        console.error('Supabase awards error:', error);
        setItems(data || []);
      });
  }, []);

  const page = getSiteObject(content, 'achievements_page', {
    title: 'Awards & Recognition',
    subtitle:
      'Official award letters, certificates, and recognition received by Hinnavaru Blue Initiative.',
    heroImage:
      'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965118488_5a4fb952.jpg',
  });

  const toggleExpanded = (id: string) => {
    setExpanded((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const getSummary = (text?: string, isExpanded?: boolean) => {
    if (!text) return '';
    if (isExpanded || text.length <= 170) return text;
    return `${text.slice(0, 170).trim()}...`;
  };

  return (
    <div className="bg-[#F0FCFC]">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#68E0D6]/20 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-[#F5E7B2]/35 blur-3xl" />

        <div className="relative">
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-2 text-[#008EB3] font-semibold tracking-wide">
              <Award className="h-4 w-4" />
              AWARDS ONLY
            </span>

            <h2 className="mt-3 font-poppins font-bold text-3xl sm:text-5xl text-[#003A70] leading-tight">
              Recognition for community-led ocean care.
            </h2>

            <p className="mt-5 text-slate-600 leading-relaxed">
              This page highlights official award letters, certificates, and recognition
              received by Hinnavaru Blue Initiative. Click any certificate image to view it
              in full.
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {items.map((award) => {
                const isExpanded = expanded[award.id];
                const summary = getSummary(award.description, isExpanded);
                const hasLongDescription =
                  Boolean(award.description) && award.description!.length > 170;

                return (
                  <article
                    key={award.id}
                    className="group rounded-[2rem] bg-white/90 backdrop-blur border border-sky-50 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => award.image && setActiveImage(award)}
                      disabled={!award.image}
                      className="relative block w-full h-72 overflow-hidden bg-gradient-to-br from-[#EFFFFD] to-[#F7FBFE] text-left"
                    >
                      {award.image ? (
                        <>
                          <img
                            src={award.image}
                            alt={award.title}
                            className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#003A70]/60 via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#003A70]">
                              Click to open certificate
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-[#0066B3]">
                          <Award className="h-14 w-14" />
                          <span className="mt-3 text-sm font-semibold">
                            Certificate image coming soon
                          </span>
                        </div>
                      )}
                    </button>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EFFFFD] px-3 py-1 text-xs font-semibold text-[#006B8F]">
                          <Award className="h-3.5 w-3.5" />
                          Award
                        </span>

                        {award.achievement_date && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(award.achievement_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 font-poppins font-bold text-xl text-[#003A70] leading-snug">
                        {award.title}
                      </h3>

                      {summary && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          {summary}
                        </p>
                      )}

                      {hasLongDescription && (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(award.id)}
                          className="mt-4 text-sm font-semibold text-[#0066B3] hover:text-[#003A70]"
                        >
                          {isExpanded ? 'View less' : 'View more'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[#68E0D6]/25 bg-white/80 p-10 text-center">
              <Award className="h-12 w-12 text-[#00B7E5] mx-auto" />
              <h3 className="mt-4 font-poppins font-bold text-xl text-[#003A70]">
                No awards published yet
              </h3>
              <p className="mt-2 text-slate-500">
                Award letters and certificates will appear here once they are added
                in Supabase with the category set to “Awards”.
              </p>
            </div>
          )}
        </div>
      </section>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                cat === c ? 'bg-[#0066B3] text-white' : 'bg-white text-slate-600 border border-[#CDEFEF] hover:bg-[#E8F8F7]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-sky-200" />
          <div className="space-y-10">
            {filtered.map((a, i) => (
              <div key={a.id} className={`relative flex flex-col sm:flex-row gap-6 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-[#00B7E5] flex items-center justify-center ring-4 ring-[#F0FCFC]">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="sm:w-1/2" />
                <div className="sm:w-1/2 pl-14 sm:pl-0">
                  <div className="rounded-2xl bg-white shadow-sm border border-[#CDEFEF] overflow-hidden">
                    {a.image && <img src={a.image} alt={a.title} className="h-40 w-full object-cover" />}
                    <div className="p-5">
                      <span className="text-xs font-semibold text-[#00B7E5]">{a.category}</span>
                      <h3 className="mt-1 font-poppins font-bold text-[#003A70]">{a.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{a.description}</p>
                      {a.achievement_date && <p className="mt-3 text-xs text-slate-400">{new Date(a.achievement_date).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

