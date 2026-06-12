import { useEffect, useMemo, useState } from 'react';
import { Search, Waves } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ProjectCard } from '@/components/ProjectCard';
import { Wave } from '@/components/Wave';
import { PROJECT_CATEGORIES, normalizeProjectCategory } from '@/lib/constants';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import type { Project } from '@/lib/types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['projects_page', 'project_categories']).then(setContent);
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('project_date', { ascending: false })
      .then(({ data, error }) => {
        console.log('Supabase result:', data);
        console.error('Supabase error:', error);
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const page = getSiteObject(content, 'projects_page', {
    title: 'Our Conservation Work',
    subtitle:
      'Explore coral restoration and island-led initiatives protecting the reefs, shores, and community life of Lh. Hinnavaru.',
    heroImage: '/images/hinnavaru-hero.png',
  });

  const categories = useMemo(() => {
    const siteCategories = getSiteArray<string>(content, 'project_categories', []);
    const normalized = siteCategories.map(normalizeProjectCategory);

    return Array.from(new Set([...PROJECT_CATEGORIES, ...normalized]));
  }, [content]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (cat === 'All' || normalizeProjectCategory(p.category) === cat) &&
          (p.title.toLowerCase().includes(q.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(q.toLowerCase())),
      ),
    [projects, q, cat],
  );

  const featured = projects.filter((p) => p.featured).slice(0, 1);

  return (
    <div className="bg-[#F0FCFC]">
      <section className="relative overflow-hidden bg-[#003A70]">
        <div className="relative min-h-[430px] flex items-center overflow-hidden">
          <img
            src={page.heroImage || '/images/hinnavaru-hero.png'}
            alt="Maldives lagoon and reef conservation work"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#002B4F]/90 via-[#0066B3]/72 to-[#00B7E5]/45" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F0FCFC] via-[#E8F8F7]/40 to-transparent" />
          <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#68E0D6]/20 blur-3xl" />
          <div className="absolute right-10 bottom-12 h-64 w-64 rounded-full bg-[#F5E7B2]/20 blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm font-semibold text-[#B9FFF7] backdrop-blur">
                <Waves className="h-4 w-4" />
                HBI CONSERVATION PROJECTS
              </span>

              <h1 className="mt-6 font-poppins font-extrabold text-4xl sm:text-6xl text-white leading-tight drop-shadow-lg">
                {page.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base sm:text-xl leading-relaxed text-sky-100">
                {page.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {PROJECT_CATEGORIES.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Wave className="block w-full h-12 -mt-1" color="#F0FCFC" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {featured.length > 0 && (
          <div className="mb-12 rounded-3xl overflow-hidden grid lg:grid-cols-2 bg-white shadow-md border border-[#CDEFEF]">
            <img src={featured[0].cover_image} alt={featured[0].title} className="h-64 lg:h-full w-full object-cover" />
            <div className="p-8 flex flex-col justify-center">
              <span className="text-[#00B7E5] font-semibold text-sm">FEATURED PROJECT</span>
              <h2 className="mt-2 font-poppins font-bold text-2xl text-[#003A70]">{featured[0].title}</h2>
              <p className="mt-3 text-slate-600">{featured[0].description}</p>
              <a href={`/projects/${featured[0].slug}`} className="mt-5 inline-block w-fit px-5 py-2.5 rounded-full bg-[#0066B3] text-white text-sm font-semibold hover:bg-[#003A70] transition">
                View Project
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[#CDEFEF] outline-none focus:ring-2 focus:ring-[#00B7E5] bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading projects...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No projects found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
