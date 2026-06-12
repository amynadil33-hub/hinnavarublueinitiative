import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Waves, Trash2, Users, Sprout, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchSiteContent, getSiteArray, getSiteObject } from '@/lib/siteContent';
import { Wave } from '@/components/Wave';
import { ProjectCard } from '@/components/ProjectCard';
import type { Project } from '@/lib/types';

type HomeProgram = {
  title: string;
  text: string;
  img?: string;
  image?: string;
  imageKey?: 'heroImage' | 'coralImage' | 'sweepImage';
};

const HOME_HERO_IMAGE = '/images/hinnavaru-hero.png';

const HOME_DEFAULTS = {
  heroImage: HOME_HERO_IMAGE,

  coralImage:
    'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965190451_e8d79013.png',

  sweepImage:
    'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',

  location: 'Lh. Hinnavaru, Maldives',

  title: "From Hinnavaru's lagoon\nA blue future grows.",

  highlight: 'Reefs, island, and community in harmony.',

  subtitle:
    'A community-led environmental NGO weaving coral restoration, island cleanups, and ocean education into the everyday rhythm of Hinnavaru.',

  philosophyTitle: 'An island community restoring its blue heart.',

  philosophyText:
    'Hinnavaru Blue Initiative brings together reef restoration, island cleanups, and community stewardship to protect the ocean environment that shapes daily life in Lh. Hinnavaru.',

  aboutEyebrow: 'ISLAND-ROOTED STEWARDSHIP',

  programs: [
    {
      title: 'Reefs',
      text: 'Coral restoration, coral frames, reef monitoring, and long-term care beneath the surface.',
      imageKey: 'coralImage',
    },
    {
      title: 'Island',
      text: 'Island sweep efforts, waste reduction, and cleaner public spaces for the Hinnavaru community.',
      imageKey: 'sweepImage',
    },
    {
      title: 'Community',
      text: 'Volunteers, youth awareness, partnerships, and everyday ocean stewardship.',
      imageKey: 'heroImage',
    },
  ],

  ctaTitle: 'Help restore the reef that protects our island.',

  ctaText:
    'Adopt a coral frame, volunteer for an island sweep, or partner with Hinnavaru Blue Initiative to create lasting ripples of ocean care.',
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetchSiteContent(['home', 'home_programs']).then(setContent);

    supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('project_date', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        console.log('Supabase featured projects:', data);
        console.error('Supabase featured projects error:', error);
        setProjects(data || []);
      });
  }, []);

  const home = getSiteObject(content, 'home', HOME_DEFAULTS);

  const programs = getSiteArray<HomeProgram>(
    content,
    'home_programs',
    home.programs as HomeProgram[]
  );

  const getProgramImage = (program: HomeProgram) => {
    if (program.img) return program.img;
    if (program.image) return program.image;

    if (program.imageKey === 'coralImage') return home.coralImage;
    if (program.imageKey === 'sweepImage') return home.sweepImage;
    if (program.imageKey === 'heroImage') return home.heroImage;

    return home.heroImage || HOME_HERO_IMAGE;
  };

  return (
    <div className="bg-[#F0FCFC] text-slate-800 overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={home.heroImage || HOME_HERO_IMAGE}
          alt="Hinnavaru reef and island coastline"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#002B4F]/55 via-[#006B8F]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#F0FCFC] via-[#E8F8F7]/70 to-transparent" />

        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#68E0D6]/20 blur-3xl" />
        <div className="absolute right-10 bottom-24 h-64 w-64 rounded-full bg-[#F5E7B2]/20 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm backdrop-blur-md border border-white/20 shadow-sm">
              <Waves className="h-4 w-4" />
              {home.location}
            </span>

            <h1 className="mt-6 font-poppins font-extrabold text-4xl sm:text-6xl text-white leading-tight drop-shadow-lg">
              {home.title.split('\n').map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
              <span className="text-[#B9FFF7]">
                {home.highlight}
              </span>
            </h1>

            <p className="mt-6 text-lg text-sky-50 max-w-xl leading-relaxed drop-shadow">
              {home.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAFFFF] text-[#003A70] font-semibold hover:bg-white transition shadow-lg"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/adopt-a-frame"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#68E0D6] to-[#F5E7B2] text-[#003A70] font-semibold hover:opacity-90 transition shadow-lg"
              >
                <Heart className="h-4 w-4" />
                Adopt a Coral Frame
              </Link>
            </div>
          </div>
        </div>

        <Wave className="absolute bottom-0 w-full h-16" color="#F0FCFC" />
      </section>

      {/* INTRO */}
      <section className="relative bg-[#F0FCFC] py-24">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#68E0D6]/20 blur-3xl" />
        <div className="absolute right-0 bottom-12 h-72 w-72 rounded-full bg-[#F5E7B2]/40 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-[#008EB3] font-semibold tracking-wide">
                <span className="h-px w-10 bg-[#00B7E5]" />
                {home.aboutEyebrow}
              </span>

              <h2 className="mt-5 font-poppins font-bold text-3xl sm:text-5xl text-[#003A70] leading-tight">
                {home.philosophyTitle}
              </h2>

              <p className="mt-7 text-lg text-slate-600 leading-relaxed">
                {home.philosophyText}
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {['Coral Restoration', 'Island Sweep & Initiatives'].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-full border border-[#68E0D6]/40 bg-white/70 px-4 py-2 text-sm text-[#003A70] text-center"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-5 -left-5 h-24 w-24 rounded-full bg-[#F5E7B2]/70" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#68E0D6]/35" />

              <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-white">
                <img
                  src={home.coralImage}
                  alt="Coral restoration work"
                  className="h-[420px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#003A70]/45 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-poppins font-semibold text-xl drop-shadow">
                    Reef recovery, shaped by community care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE PROTECT */}
      <section className="relative bg-gradient-to-br from-[#F0FCFC] via-[#E8F8F7] to-[#FFF8E6] py-24">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F0FCFC] to-transparent" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#00B7E5]/10 blur-3xl" />
        <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#4E9B47]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-[#008EB3] font-semibold tracking-wide">
              WHAT WE PROTECT
            </span>

            <h2 className="mt-3 font-poppins font-bold text-3xl sm:text-5xl text-[#003A70] leading-tight">
              Reef, island, and community are one living system.
            </h2>

            <p className="mt-5 text-slate-600 leading-relaxed">
              Our work connects what happens below the waterline with what happens on the
              island — because a healthy reef, a clean island, and an informed community
              protect each other.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program, index) => {
              const icons = [Sprout, Trash2, Users];
              const Icon = icons[index] || Sprout;
              const image = getProgramImage(program);

              return (
                <article
                  key={program.title}
                  className="group rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur border border-white shadow-sm hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={image}
                      alt={program.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#002B4F]/75 via-[#002B4F]/10 to-transparent" />

                    <div className="absolute top-5 left-5 h-12 w-12 rounded-2xl bg-white/85 backdrop-blur flex items-center justify-center text-[#0066B3]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-poppins font-bold text-2xl text-white">
                        {program.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {program.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="relative bg-[#F0FCFC] py-24">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#E8F8F7] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[#008EB3] font-semibold tracking-wide">
                <Waves className="h-4 w-4" />
                CURRENT CONSERVATION WORK
              </span>

              <h2 className="mt-3 font-poppins font-bold text-3xl sm:text-5xl text-[#003A70] leading-tight">
                Projects shaped by reef, island, and community.
              </h2>

              <p className="mt-5 text-slate-600 leading-relaxed">
                Explore the active conservation efforts led by Hinnavaru Blue Initiative —
                from coral restoration to island cleanups and awareness programs.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#00A8D8] text-[#0066B3] font-semibold hover:bg-[#00A8D8] hover:text-white transition w-fit"
            >
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[#68E0D6]/25 bg-white/70 p-10 text-center">
              <p className="text-slate-500">
                Featured projects will appear here once they are published in Supabase.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 overflow-hidden">
        <img
          src={home.sweepImage || home.coralImage || HOME_HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#002B4F]/90 via-[#003A70]/72 to-[#006B8F]/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#002B4F]/50 to-transparent" />
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#68E0D6]/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <span className="inline-flex items-center justify-center gap-2 text-[#B9FFF7] font-semibold tracking-wide">
            <Heart className="h-4 w-4" />
            TAKE PART
          </span>

          <h2 className="mt-4 font-poppins font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            {home.ctaTitle}
          </h2>

          <p className="mt-5 text-sky-100 leading-relaxed">
            {home.ctaText}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/adopt-a-frame"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#68E0D6] to-[#F5E7B2] text-[#003A70] font-semibold hover:opacity-90 transition shadow-lg"
            >
              Adopt a Frame
            </Link>

            <Link
              to="/contact-us"
              className="px-6 py-3 rounded-full bg-white text-[#003A70] font-semibold hover:bg-sky-50 transition shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

