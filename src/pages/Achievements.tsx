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
  const categories = getSiteArray<string>(content, 'achievement_categories', ACHIEVEMENT_CATEGORIES);
  const categoryOptions = ['All', ...categories];
  const featuredStats = items.slice(0, 4);

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {featuredStats.map((achievement) => (
            <div key={achievement.id} className="rounded-2xl bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white p-6 text-center">
              <div className="font-poppins font-extrabold text-2xl text-[#68E0D6]">{achievement.metric_value}</div>
              <div className="text-xs text-sky-100 mt-1">{achievement.metric_label}</div>
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
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setCat(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                cat === category ? 'bg-[#0066B3] text-white' : 'bg-white text-slate-600 border border-[#CDEFEF] hover:bg-[#E8F8F7]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-sky-200" />
          <div className="space-y-10">
            {filtered.map((achievement, index) => (
              <div key={achievement.id} className={`relative flex flex-col sm:flex-row gap-6 ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-[#00B7E5] flex items-center justify-center ring-4 ring-[#F0FCFC]">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="sm:w-1/2" />
                <div className="sm:w-1/2 pl-14 sm:pl-0">
                  <div className="rounded-2xl bg-white shadow-sm border border-[#CDEFEF] overflow-hidden">
                    {achievement.image && <img src={achievement.image} alt={achievement.title} className="h-40 w-full object-cover" />}
                    <div className="p-5">
                      <span className="text-xs font-semibold text-[#00B7E5]">{achievement.category}</span>
                      <h3 className="mt-1 font-poppins font-bold text-[#003A70]">{achievement.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{achievement.description}</p>
                      {achievement.achievement_date && <p className="mt-3 text-xs text-slate-400">{new Date(achievement.achievement_date).toLocaleDateString()}</p>}
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

