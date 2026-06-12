import { useEffect, useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/PageHero';
import { ACHIEVEMENT_CATEGORIES } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import type { Achievement } from '@/lib/types';

export default function Achievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [cat, setCat] = useState('All');
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['achievements_page', 'achievement_categories']).then(setContent);
    supabase.from('achievements').select('*').eq('published', true).order('achievement_date', { ascending: false }).then(({ data, error }) => {
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
      setItems(data || []);
    });
  }, []);

  const page = getSiteObject(content, 'achievements_page', {
    title: 'Our Achievements',
    subtitle: "Milestones on our journey to restore Hinnavaru's reefs",
    heroImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965118488_5a4fb952.jpg',
  });
  const categories = getSiteArray<string>(content, 'achievement_categories', ACHIEVEMENT_CATEGORIES);

  const filtered = useMemo(() => items.filter((a) => cat === 'All' || a.category === cat), [items, cat]);

  return (
    <div className="bg-[#F0FCFC]">
      <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {items.slice(0, 4).map((a) => (
            <div key={a.id} className="rounded-2xl bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white p-6 text-center">
              <div className="font-poppins font-extrabold text-2xl text-[#68E0D6]">{a.metric_value}</div>
              <div className="text-xs text-sky-100 mt-1">{a.metric_label}</div>
            </div>
          ))}
        </div>

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
      </section>
    </div>
  );
}
