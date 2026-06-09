import { Wave } from './Wave';

export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative">
      <div className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src={image || '/images/hinnavaru-hero.jpg'}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003A70]/85 via-[#0066B3]/70 to-[#00B7E5]/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-poppins font-extrabold text-3xl sm:text-5xl text-white drop-shadow">{title}</h1>
          {subtitle && <p className="mt-4 text-sky-100 text-base sm:text-lg">{subtitle}</p>}
        </div>
      </div>
      <Wave className="block w-full h-12 -mt-1" color="#f7fbfe" />
    </section>
  );
}
