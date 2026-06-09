import { Compass, Eye, Heart, Anchor, Fish, Users, Leaf } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

const HERO = 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965190451_e8d79013.png';
const STORY = 'https://d64gsuwffb70l.cloudfront.net/6a275e85a0ba2d9edb470fe3_1780965170244_a1644cb0.png';

const VALUES = [
  { icon: Anchor, title: 'Community First', text: 'Local people lead every project we undertake.' },
  { icon: Fish, title: 'Science-Based', text: 'Our restoration is guided by marine research and data.' },
  { icon: Leaf, title: 'Sustainability', text: 'We build lasting solutions for generations to come.' },
  { icon: Users, title: 'Inclusivity', text: 'Everyone — young and old — has a role in conservation.' },
];

export default function OurRoots() {
  return (
    <div>
      <PageHero title="Our Roots" subtitle="The story of a community rising to protect its ocean" image={HERO} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <img src={STORY} alt="Our story" className="rounded-3xl shadow-lg h-80 w-full object-cover" />
        <div>
          <span className="text-[#00B7E5] font-semibold">OUR STORY</span>
          <h2 className="mt-2 font-poppins font-bold text-3xl text-[#003A70]">Born from the reef, built by the community</h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            Hinnavaru Blue Initiative began when a small group of divers and fishers noticed the reefs around
            our island fading. Bleaching events, plastic pollution and unsustainable practices were eroding
            the marine life our community has depended on for generations.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            What started as weekend cleanups grew into a registered environmental NGO running coral
            restoration, education and atoll-wide partnerships — all powered by the people of Hinnavaru.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white">
            <Compass className="h-8 w-8 text-[#68E0D6]" />
            <h3 className="mt-4 font-poppins font-bold text-2xl">Our Mission</h3>
            <p className="mt-3 text-sky-100">
              To restore and protect the coral reefs and marine ecosystems of Hinnavaru through community-led
              conservation, scientific restoration and environmental education.
            </p>
          </div>
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#003A70] to-[#0066B3] text-white">
            <Eye className="h-8 w-8 text-[#68E0D6]" />
            <h3 className="mt-4 font-poppins font-bold text-2xl">Our Vision</h3>
            <p className="mt-3 text-sky-100">
              A thriving, resilient Hinnavaru where healthy reefs sustain marine life, livelihoods and a
              community proud to be stewards of its blue home.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-[#00B7E5] font-semibold">WHAT GUIDES US</span>
          <h2 className="mt-2 font-poppins font-bold text-3xl text-[#003A70]">Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl bg-white p-6 shadow-sm border border-sky-50 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0066B3]">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-poppins font-bold text-[#003A70]">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: 'Why Hinnavaru', text: 'One of Lhaviyani Atoll\'s largest communities, Hinnavaru sits among reefs of extraordinary biodiversity worth protecting.' },
            { icon: Users, title: 'Community Stewardship', text: 'We believe conservation succeeds when it is owned by the community. Locals lead, learn and benefit.' },
            { icon: Fish, title: 'Reef Conservation', text: 'Healthy reefs protect our shores, feed our families and anchor our island\'s future.' },
          ].map((b) => (
            <div key={b.title}>
              <b.icon className="h-8 w-8 text-[#0066B3]" />
              <h3 className="mt-4 font-poppins font-bold text-xl text-[#003A70]">{b.title}</h3>
              <p className="mt-2 text-slate-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
