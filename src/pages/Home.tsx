import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Waves, Trash2, Users, Sprout, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import { Wave } from '@/components/Wave';
import { StatCounter } from '@/components/StatCounter';
import { ProjectCard } from '@/components/ProjectCard';
import type { ImpactStat, Project, Achievement } from '@/lib/types';

type HomeProgram = { title: string; text: string; img?: string; image?: string; imageKey?: 'heroImage' | 'coralImage' | 'sweepImage' };

const HOME_HERO_IMAGE = '/images/hinnavaru-hero.png';

const HOME_DEFAULTS = {
  heroImage: HOME_HERO_IMAGE,
  coralImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965190451_e8d79013.png',
  sweepImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',
  location: 'Lh. Hinnavaru, Maldives',
  title: "From Hinnavaru's lagoon\nA blue future grows.",
  highlight: "Reefs, island, and community in harmony.",
  subtitle: 'A community-led environmental NGO weaving coral restoration, island cleanups, and ocean education into the everyday rhythm of Hinnavaru.',
  aboutEyebrow: 'ISLAND-ROOTED STEWARDSHIP',
  aboutTitle: 'A Maldivian home for reef restoration',
  aboutBody: [
    'The Hinnavaru Blue Initiative was born from a simple belief: the people who live with the lagoon, monsoon winds, reef fish and shorelines are its most faithful protectors. We bring together divers, fishers, students and families to care for damaged reefs, clean our island, and educate the next generation.',
    'From coral frames to island sweeps, each action carries the colours of Maldivian life — turquoise water, white sand, green palms, and a community choosing a healthier ocean.',
  ],
  programs: [
    { title: 'Coral Restoration', text: 'Hand-built coral frames nurturing reef gardens beneath Hinnavaru waters.', imageKey: 'coralImage' },
    { title: 'Island Sweep', text: 'Community cleanups keeping beaches, harbours and lagoons naturally beautiful.', imageKey: 'sweepImage' },
    { title: 'Community Impact', text: 'Ocean learning rooted in Maldivian island life and everyday stewardship.', imageKey: 'heroImage' },
  ],
  islandNotes: ['Lagoon-blue restoration', 'Maldivian island rhythms', 'Reef-safe community action'],
  ctaTitle: "Be part of Hinnavaru's blue future",
  ctaText: 'Adopt a coral frame, volunteer for a cleanup, or partner with us to scale marine conservation across Lhaviyani Atoll.',
};

export default function Home() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['home', 'home_programs']).then(setContent);
    supabase.from('impact_stats').select('*').order('sort_order').then(({ data, error }) => {
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
      setStats(data || []);
    });
    supabase.from('projects').select('*').eq('featured', true).eq('published', true).limit(3).then(({ data, error }) => {
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
      setProjects(data || []);
    });
    supabase.from('achievements').select('*').eq('published', true).order('achievement_date', { ascending: false }).limit(3).then(({ data, error }) => {
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
      setAchievements(data || []);
    });
  }, []);

  const home = getSiteObject(content, 'home', HOME_DEFAULTS);
  const programs = getSiteArray<HomeProgram>(content, 'home_programs', home.programs as HomeProgram[]);

  return (
    <div className="bg-[#f7fbfe]">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#001B3A]">
        <img src={HOME_HERO_IMAGE} alt="Hinnavaru reef and island coastline" className="absolute inset-0 h-full w-full object-cover object-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#001B3A]/95 via-[#003A70]/82 to-[#00B7E5]/45" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#68E0D6]/20 blur-3xl" />
        <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-[#F7D36A]/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7fbfe] via-[#f7fbfe]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm backdrop-blur">
              <Waves className="h-4 w-4" /> {home.location}
            </span>
            <h1 className="mt-6 font-poppins font-extrabold text-4xl sm:text-6xl text-white leading-tight drop-shadow-lg">
              {home.title.split('\n').map((line) => (
                <span key={line}>{line}<br /></span>
              ))}
              <span className="bg-gradient-to-r from-[#68E0D6] via-white to-[#F7D36A] bg-clip-text text-transparent">{home.highlight}</span>
            </h1>
            <p className="mt-6 text-lg text-sky-50 max-w-xl leading-relaxed">
              {home.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#003A70] font-semibold hover:bg-sky-50 transition shadow-lg">
                Explore Projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/adopt-a-frame" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00B7E5] to-[#68E0D6] text-[#003A70] font-semibold hover:opacity-90 transition shadow-lg">
                <Heart className="h-4 w-4" /> Adopt a Coral Frame
              </Link>
            </div>
          </div>

          <div className="hidden lg:block justify-self-end">
            <div className="relative w-[390px] rounded-[2rem] border border-white/20 bg-white/12 p-5 shadow-2xl backdrop-blur-md">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full border border-[#68E0D6]/40" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#68E0D6]/20 blur-2xl" />
              <div className="rounded-[1.5rem] overflow-hidden border border-white/20">
                <img src={home.coralImage} alt="Coral restoration in Hinnavaru waters" className="h-64 w-full object-cover" />
              </div>
              <div className="mt-5 space-y-3">
                {(home.islandNotes || HOME_DEFAULTS.islandNotes).map((note) => (
                  <div key={note} className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F7D36A] shadow-[0_0_18px_rgba(247,211,106,0.8)]" />
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Wave className="absolute bottom-0 w-full h-16" color="#f7fbfe" />
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="rounded-3xl bg-white/95 shadow-xl border border-sky-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 backdrop-blur">
          {stats.map((s) => (
            <StatCounter key={s.id} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center overflow-hidden">
        <div className="absolute left-4 top-12 h-32 w-32 rounded-full bg-[#68E0D6]/20 blur-3xl" />
        <div>
          <span className="text-[#00B7E5] font-semibold">{home.aboutEyebrow}</span>
          <h2 className="mt-2 font-poppins font-bold text-3xl sm:text-4xl text-[#003A70]">
            {home.aboutTitle}
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            {home.aboutBody?.[0]}
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {home.aboutBody?.[1]}
          </p>
          <Link to="/our-roots" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0066B3] hover:gap-3 transition-all">
            Discover Our Roots <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <div className="absolute inset-x-8 top-10 bottom-0 rounded-full bg-[#00B7E5]/10 blur-3xl" />
          <img src={home.coralImage} alt="Coral restoration frame in Maldivian waters" className="relative rounded-[2rem] h-64 w-full object-cover shadow-xl ring-4 ring-white" />
          <img src={home.sweepImage} alt="Hinnavaru community cleanup" className="relative rounded-[2rem] h-64 w-full object-cover shadow-xl ring-4 ring-white mt-10" />
          <div className="absolute -bottom-6 left-8 rounded-2xl bg-white px-5 py-4 shadow-xl border border-sky-50">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00B7E5]">Made in Hinnavaru</p>
            <p className="mt-1 font-poppins font-bold text-[#003A70]">Lagoon care, island heart</p>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-gradient-to-b from-white to-sky-50/80 py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#00B7E5] font-semibold">OUR WORK</span>
            <h2 className="mt-2 font-poppins font-bold text-3xl sm:text-4xl text-[#003A70]">Featured Projects</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#0066B3] text-[#0066B3] font-semibold hover:bg-[#0066B3] hover:text-white transition">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-3 gap-6">
        {programs.map((p, index) => {
          const icons = [Sprout, Trash2, Users];
          const Icon = icons[index] || Sprout;
          const img = p.img || p.image || home[p.imageKey as keyof typeof home] || home.heroImage;
          return (
          <div key={p.title} className="rounded-[1.75rem] overflow-hidden bg-white shadow-sm border border-sky-100 group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="h-40 overflow-hidden">
              <img src={img} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="h-11 w-11 rounded-xl bg-sky-50 flex items-center justify-center text-[#0066B3]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-poppins font-bold text-[#003A70] text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.text}</p>
            </div>
          </div>
        );
        })}
      </section>

      {/* ACHIEVEMENTS */}
      <section className="relative bg-gradient-to-br from-[#00284f] via-[#003A70] to-[#0066B3] py-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #68E0D6 0 2px, transparent 2px), radial-gradient(circle at 70% 60%, #F7D36A 0 1px, transparent 1px)', backgroundSize: '52px 52px, 38px 38px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#68E0D6] font-semibold">MILESTONES</span>
            <h2 className="mt-2 font-poppins font-bold text-3xl sm:text-4xl">Latest Achievements</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {achievements.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/10">
                <div className="text-3xl font-poppins font-extrabold text-[#68E0D6]">{a.metric_value}</div>
                <div className="text-sm text-sky-200">{a.metric_label}</div>
                <h3 className="mt-3 font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-sky-100/80">{a.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/achievements" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#003A70] font-semibold hover:bg-sky-50 transition">
              See All Achievements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <img src={home.coralImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#003A70]/85" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-white">
            {home.ctaTitle}
          </h2>
          <p className="mt-4 text-sky-100">
            {home.ctaText}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/adopt-a-frame" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00B7E5] to-[#68E0D6] text-[#003A70] font-semibold hover:opacity-90 transition">
              Adopt a Frame
            </Link>
            <Link to="/contact-us" className="px-6 py-3 rounded-full bg-white text-[#003A70] font-semibold hover:bg-sky-50 transition">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
