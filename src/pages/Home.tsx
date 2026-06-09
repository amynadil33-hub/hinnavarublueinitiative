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

const HOME_DEFAULTS = {
  heroImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965093187_81f9d5dc.jpg',
  coralImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965190451_e8d79013.png',
  sweepImage: 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',
  location: 'Lh. Hinnavaru, Maldives',
  title: "Restoring Reefs.\nReviving Community.",
  highlight: "Protecting Hinnavaru's Blue Future.",
  subtitle: 'A community-led environmental NGO dedicated to coral restoration, reef conservation and marine ecosystem protection.',
  aboutEyebrow: 'ABOUT HBI',
  aboutTitle: 'Community stewardship of our reefs',
  aboutBody: [
    'The Hinnavaru Blue Initiative was born from a simple belief: the people who depend on the ocean are its best protectors. We bring together divers, fishers, students and families to restore damaged reefs, clean our island, and educate the next generation.',
    'From coral frames to island sweeps, every effort strengthens both our marine ecosystem and our community.',
  ],
  programs: [
    { title: 'Coral Restoration', text: 'Building and deploying coral frames to rebuild damaged reefs.', imageKey: 'coralImage' },
    { title: 'Island Sweep', text: 'Monthly cleanups removing plastic from beaches and lagoons.', imageKey: 'sweepImage' },
    { title: 'Community Impact', text: 'Education programs creating lifelong ocean stewards.', imageKey: 'heroImage' },
  ],
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
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center overflow-hidden">
        <img src={home.heroImage} alt="Maldives reef" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A70]/90 via-[#0066B3]/70 to-[#00B7E5]/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm backdrop-blur">
              <Waves className="h-4 w-4" /> {home.location}
            </span>
            <h1 className="mt-6 font-poppins font-extrabold text-4xl sm:text-6xl text-white leading-tight drop-shadow-lg">
              {home.title.split('\n').map((line) => (
                <span key={line}>{line}<br /></span>
              ))}
              <span className="text-[#68E0D6]">{home.highlight}</span>
            </h1>
            <p className="mt-6 text-lg text-sky-100 max-w-xl">
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
        </div>
        <Wave className="absolute bottom-0 w-full h-16" color="#f7fbfe" />
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="rounded-3xl bg-white shadow-xl border border-sky-50 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <StatCounter key={s.id} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
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
        <div className="grid grid-cols-2 gap-4">
          <img src={home.coralImage} alt="coral" className="rounded-2xl h-56 w-full object-cover shadow-md" />
          <img src={home.sweepImage} alt="cleanup" className="rounded-2xl h-56 w-full object-cover shadow-md mt-8" />
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
          <div key={p.title} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-sky-50 group">
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
      <section className="bg-gradient-to-br from-[#003A70] to-[#0066B3] py-20 text-white">
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
