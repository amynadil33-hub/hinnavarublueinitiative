import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Wave } from '@/components/Wave';
import { ProjectCard } from '@/components/ProjectCard';
import type { Project } from '@/lib/types';

function embedUrl(url: string) {
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
  if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
  return url;
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);
    supabase.from('projects').select('*').eq('slug', slug).eq('published', true).single().then(({ data, error }) => {
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
      setProject(data);
      if (data) {
        supabase.from('projects').select('*').eq('category', data.category).eq('published', true).neq('id', data.id).limit(3).then(({ data: relatedData, error: relatedError }) => {
          console.log('Supabase result:', relatedData);
          console.error('Supabase error:', relatedError);
          setRelated(relatedData || []);
        });
      }
    });
  }, [slug]);

  if (!project) return <div className="py-32 text-center text-slate-400">Loading...</div>;

  const videos = (project.videos as Array<string | { url: string }>) || [];
  const isUrlVideo = (u: string) => /\.(mp4|webm|mov)$/i.test(u);

  return (
    <div>
      <section className="relative h-[55vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={project.cover_image} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003A70]/95 via-[#003A70]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sky-100 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">{project.category}</span>
          <h1 className="mt-3 font-poppins font-extrabold text-3xl sm:text-5xl text-white">{project.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sky-100 text-sm">
            {project.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{project.location}</span>}
            {project.project_date && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(project.project_date).toLocaleDateString()}</span>}
            {project.status && <span className="px-2 py-0.5 rounded bg-[#4E9B47] text-white text-xs">{project.status}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-14">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">About this project</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{project.full_description || project.description}</p>
        </div>

        {project.impact_metrics && project.impact_metrics.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">Impact Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.impact_metrics.map((m, i) => (
                <div key={i} className="rounded-2xl bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white p-5 text-center">
                  <div className="font-poppins font-extrabold text-2xl">{m.value}</div>
                  <div className="text-xs text-sky-100 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.gallery.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setLightbox(img)} className="rounded-xl h-44 w-full object-cover cursor-pointer hover:opacity-90 transition" />
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">Videos</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((v, i) => {
                const url = typeof v === 'string' ? v : v.url;
                return isUrlVideo(url) ? (
                  <video key={i} controls src={url} className="rounded-xl w-full aspect-video bg-black" />
                ) : (
                  <iframe key={i} src={embedUrl(url)} className="rounded-xl w-full aspect-video" allowFullScreen title={`video-${i}`} />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <Wave className="w-full h-10 -mt-16" color="#ffffff" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-8">Related Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
