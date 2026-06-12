import { useEffect, useState } from 'react';
import { Award, Calendar, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { fetchSiteContent, getSiteObject } from '@/lib/siteContent';
import type { Achievement } from '@/lib/types';

const DESCRIPTION_PREVIEW_LENGTH = 180;

export default function Achievements() {
  const [awards, setAwards] = useState<Achievement[]>([]);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchSiteContent(['achievements_page']).then(setContent);

    supabase
      .from('achievements')
      .select('*')
      .eq('published', true)
      .eq('category', 'Awards')
      .order('achievement_date', { ascending: false })
      .then(({ data, error }) => {
        console.log('Awards result:', data);
        console.error('Awards error:', error);
        setAwards(data || []);
      });
  }, []);

  const page = getSiteObject(content, 'achievements_page', {
    title: 'Awards & Recognition',
    subtitle: 'Certificates and milestones recognizing community-led conservation in Hinnavaru',
    heroImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965118488_5a4fb952.jpg',
  });

  return (
    <div className="min-h-screen bg-[#F0FCFC]">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center justify-center gap-2 text-[#008EB3] font-semibold tracking-wide">
            <Award className="h-4 w-4" />
            AWARDS & CERTIFICATES
          </span>

          <h2 className="mt-3 font-poppins font-bold text-3xl sm:text-4xl text-[#003A70]">
            Recognition for our blue community
          </h2>

          <p className="mt-4 text-slate-600 leading-relaxed">
            A collection of award certificates and recognition received by Hinnavaru Blue Initiative for reef restoration, island stewardship, and community conservation work.
          </p>
        </div>

        {awards.length === 0 ? (
          <div className="rounded-[2rem] border border-[#CDEFEF] bg-white/80 p-10 text-center shadow-sm">
            <Award className="h-10 w-10 text-[#00B7E5] mx-auto" />
            <p className="mt-4 text-slate-500">
              Award certificates will appear here once they are published.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => {
              const description = award.description || '';
              const isLong = description.length > DESCRIPTION_PREVIEW_LENGTH;
              const isExpanded = expandedId === award.id;
              const visibleDescription = isLong && !isExpanded
                ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}…`
                : description;

              return (
                <article
                  key={award.id}
                  className="rounded-[2rem] overflow-hidden bg-white shadow-sm border border-[#CDEFEF] hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <button
                    type="button"
                    onClick={() => award.image && setSelectedImage(award)}
                    disabled={!award.image}
                    className="relative block h-64 w-full overflow-hidden bg-gradient-to-br from-[#E8F8F7] to-[#FFF8E6] disabled:cursor-default"
                    aria-label={award.image ? `Open certificate image for ${award.title}` : undefined}
                  >
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={`${award.title} certificate`}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#00B7E5]">
                        <Award className="h-14 w-14" />
                      </div>
                    )}
                  </button>

                  <div className="p-6">
                    <span className="inline-flex items-center rounded-full bg-[#E8F8F7] px-3 py-1 text-xs font-semibold text-[#0066B3]">
                      Award Certificate
                    </span>

                    <h3 className="mt-4 font-poppins font-bold text-xl text-[#003A70]">
                      {award.title}
                    </h3>

                    {description && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {visibleDescription}
                      </p>
                    )}

                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : award.id)}
                        className="mt-3 text-sm font-semibold text-[#0066B3] hover:text-[#003A70]"
                      >
                        {isExpanded ? 'View less' : 'View more'}
                      </button>
                    )}

                    {award.achievement_date && (
                      <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-4 w-4 text-[#00B7E5]" />
                        {new Date(award.achievement_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedImage?.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedImage.title} certificate image`}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            aria-label="Close certificate image viewer"
          >
            <X className="h-6 w-6" />
          </button>

          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-w-6xl w-full flex-col items-center gap-4"
          >
            <img
              src={selectedImage.image}
              alt={`${selectedImage.title} certificate`}
              className="max-h-[84vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="rounded-full bg-white/10 px-5 py-2 text-center text-sm text-sky-50 backdrop-blur">
              {selectedImage.title}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
