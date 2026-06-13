import { useEffect, useState } from 'react';
import { Anchor, Compass, Eye, Fish, Heart, Leaf, Users, Waves } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { fetchSiteContent, getSiteObject } from '@/lib/siteContent';

const ROOTS_DEFAULTS = {
title: 'Our Roots',
subtitle: 'The story of a community rising to protect its ocean',
heroImage:
'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965190451_e8d79013.png',
storyImage:
'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png',
};

const STORY_SECTIONS = [
{
icon: Anchor,
eyebrow: 'THE SHIPYARD',
title: 'The Shipyard: Where Steel Became Reef',
paragraphs: [
'Resting within the dynamic currents of Felivaru Kandu, The Shipyard stands as one of the Maldives’ most iconic marine sanctuaries in Lhaviyani Atoll. Beneath the azure surface lie Skipjack I and Skipjack II—two legacy vessels that, over four decades, have quietly transitioned from artifacts of maritime industry into thriving, biodiverse artificial reefs.',
"What was once cold steel is now a vibrant canvas of coral and marine life, a testament to nature's capacity for regeneration when shaped by time and tide. For the community of Hinnavaru, these wrecks represent far more than a diving destination; they are a profound symbol of cultural heritage, ecological resilience, and the evolution of our symbiotic relationship with the ocean.",
],
},
{
icon: Waves,
eyebrow: 'COMMUNITY CONSERVATION',
title: 'The Hinnavaru Blue Initiative: A Catalyst for Community-Led Conservation',
paragraphs: [
'The Hinnavaru Blue Initiative was born from a fundamental truth: the survival and prosperity of our island are inextricably linked to the health of our coral reefs.',
'From this realization emerged a community-driven model of marine conservation rooted in ancestral responsibility and localized environmental stewardship, woven by the sons and daughters of the sea.',
],
},
{
icon: Users,
eyebrow: 'NEXT GENERATION',
title: 'Empowering Next-Generation Ocean Stewards',
paragraphs: [
'At the heart of this movement is Ahmed Nabeel Hussain Didi, a local youth advocate whose lifelong fascination with the ocean has transformed into a mission for its preservation.',
'Through immersive field experience, rigorous citizen science, and direct underwater observation, Nabeel’s approach to conservation bridges the gap between theoretical ecology and community action. To him, the reef is not an abstract environmental cause; it is a living, breathing ecosystem experienced in both its profound fragility and its remarkable strength.',
'Guided by this ground-level perspective, the initiative champions a core principle of equitable conservation: that the coastal communities who know the ocean best must be empowered to lead the movement for its protection.',
],
},
];

const VALUES = [
{
icon: Anchor,
title: 'Community First',
text: 'Conservation begins with the people who live closest to the reef.',
},
{
icon: Fish,
title: 'Ocean Knowledge',
text: 'Local observation, citizen science, and lived experience guide our action.',
},
{
icon: Leaf,
title: 'Restoration',
text: 'We work toward reef recovery, climate resilience, and long-term protection.',
},
{
icon: Users,
title: 'Shared Stewardship',
text: 'Everyone has a role in protecting Hinnavaru’s blue future.',
},
];

export default function OurRoots() {
const [content, setContent] = useState<Record<string, unknown>>({});

useEffect(() => {
fetchSiteContent(['our_roots_page']).then(setContent);
}, []);

const page = getSiteObject(content, 'our_roots_page', ROOTS_DEFAULTS);

return ( <div className="min-h-screen bg-[#DDF7F7]"> <PageHero title={page.title} subtitle={page.subtitle} image={page.heroImage} />

```
  <section className="relative overflow-hidden py-20">
    <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#68E0D6]/30 blur-3xl" />
    <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-[#BFEAE9]/50 blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center mb-20">
        <div className="relative">
          <div className="absolute -top-5 -left-5 h-24 w-24 rounded-full bg-[#F5E7B2]/70" />
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#68E0D6]/35" />

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-white/70">
            <img
              src={page.storyImage}
              alt="Hinnavaru reef and community conservation"
              className="h-[460px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003A70]/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-poppins font-semibold text-xl drop-shadow">
                Rooted in reef, heritage, and community stewardship.
              </p>
            </div>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-3 text-[#008EB3] font-semibold tracking-wide">
            <span className="h-px w-10 bg-[#00B7E5]" />
            OUR STORY
          </span>

          <h2 className="mt-5 font-poppins font-bold text-3xl sm:text-5xl text-[#003A70] leading-tight">
            Born from Hinnavaru’s relationship with the sea.
          </h2>

          <p className="mt-6 text-lg text-slate-700 leading-relaxed">
            Our Roots traces the connection between maritime heritage, reef resilience,
            and a community-led movement to protect the ocean systems that sustain
            life in Lhaviyani Atoll.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {STORY_SECTIONS.map((section, index) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className={
                'grid gap-8 rounded-[2rem] border border-[#B7E6E5] bg-white/85 backdrop-blur p-6 sm:p-8 shadow-sm lg:grid-cols-[0.32fr_0.68fr] ' +
                (index === 1 ? 'lg:grid-cols-[0.68fr_0.32fr]' : '')
              }
            >
              <div className={index === 1 ? 'lg:order-2' : ''}>
                <div className="h-14 w-14 rounded-2xl bg-[#E8F8F7] flex items-center justify-center text-[#0066B3]">
                  <Icon className="h-7 w-7" />
                </div>

                <span className="mt-5 inline-block text-sm font-semibold tracking-wide text-[#008EB3]">
                  {section.eyebrow}
                </span>

                <h3 className="mt-3 font-poppins font-bold text-2xl sm:text-3xl text-[#003A70] leading-tight">
                  {section.title}
                </h3>
              </div>

              <div className="space-y-5">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-slate-700 leading-relaxed text-base sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>

  <section className="bg-gradient-to-br from-[#CFF1F0] via-[#DDF7F7] to-[#BFEAE9] py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6">
      <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white shadow-lg">
        <Compass className="h-8 w-8 text-[#68E0D6]" />
        <h3 className="mt-4 font-poppins font-bold text-2xl">Our Mission</h3>
        <p className="mt-3 text-sky-100 leading-relaxed">
          To restore and protect Hinnavaru’s marine ecosystems through community-led
          conservation, coral restoration, citizen science, and environmental education.
        </p>
      </div>

      <div className="rounded-3xl p-8 bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white shadow-lg">
        <Eye className="h-8 w-8 text-[#68E0D6]" />
        <h3 className="mt-4 font-poppins font-bold text-2xl">Our Vision</h3>
        <p className="mt-3 text-sky-100 leading-relaxed">
          A resilient Hinnavaru where healthy reefs protect our shores, sustain marine
          life, strengthen livelihoods, and inspire future generations of ocean stewards.
        </p>
      </div>
    </div>
  </section>

  <section className="py-20 bg-[#DDF7F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#008EB3] font-semibold tracking-wide">
          <Heart className="h-4 w-4" />
          WHAT GUIDES US
        </span>

        <h2 className="mt-3 font-poppins font-bold text-3xl sm:text-4xl text-[#003A70]">
          Core Values
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-relaxed">
          Our work is shaped by the belief that conservation succeeds when local
          communities are empowered to lead.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map((value) => {
          const Icon = value.icon;

          return (
            <div
              key={value.title}
              className="rounded-2xl bg-white/90 p-6 shadow-sm border border-[#B7E6E5] text-center hover:-translate-y-1 hover:shadow-lg transition"
            >
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#E8F8F7] flex items-center justify-center text-[#0066B3]">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-poppins font-bold text-[#003A70]">
                {value.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {value.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
</div>


);
}
