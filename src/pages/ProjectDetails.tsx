import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Wave } from '@/components/Wave';
import { ProjectCard } from '@/components/ProjectCard';
import { normalizeProjectCategory } from '@/lib/constants';
import type { Project } from '@/lib/types';

type ProjectGalleryItem = {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string | null;
  sort_order?: number | null;
};

type ProjectVideoItem = {
  id: string;
  project_id: string;
  url: string;
  type?: string | null;
  caption?: string | null;
};

type ProjectMetricItem = {
  id: string;
  project_id: string;
  label: string;
  value: string;
};

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
  const [gallery, setGallery] = useState<ProjectGalleryItem[]>([]);
  const [videos, setVideos] = useState<ProjectVideoItem[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetricItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isUrlVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
  const lightboxItem = lightboxIndex === null ? null : gallery[lightboxIndex];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPreviousImage = useCallback(() => {
    if (gallery.length === 0) return;

    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + gallery.length) % gallery.length,
    );
  }, [gallery.length]);
  const showNextImage = useCallback(() => {
    if (gallery.length === 0) return;

    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % gallery.length,
    );
  }, [gallery.length]);

  useEffect(() => {
    if (!slug) return;

    async function loadProject() {
      setLoading(true);
      setErrorMessage('');
      window.scrollTo(0, 0);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      console.log('Project:', projectData);
      console.error('Project error:', projectError);

      if (projectError || !projectData) {
        setErrorMessage('Project not found or could not be loaded.');
        setProject(null);
        setLoading(false);
        return;
      }

      setProject(projectData);

      const [
        galleryResult,
        videosResult,
        metricsResult,
        relatedResult,
      ] = await Promise.all([
        supabase
          .from('project_gallery')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true }),

        supabase
          .from('project_videos')
          .select('*')
          .eq('project_id', projectData.id),

        supabase
          .from('project_metrics')
          .select('*')
          .eq('project_id', projectData.id),

        supabase
          .from('projects')
          .select('*')
          .eq('category', projectData.category)
          .eq('published', true)
          .neq('id', projectData.id)
          .limit(3),
      ]);

      console.log('Gallery:', galleryResult.data);
      console.error('Gallery error:', galleryResult.error);

      console.log('Videos:', videosResult.data);
      console.error('Videos error:', videosResult.error);

      console.log('Metrics:', metricsResult.data);
      console.error('Metrics error:', metricsResult.error);

      console.log('Related:', relatedResult.data);
      console.error('Related error:', relatedResult.error);

      setGallery(galleryResult.data || []);
      setVideos(videosResult.data || []);
      setMetrics(metricsResult.data || []);
      setRelated(relatedResult.data || []);

      setLoading(false);
    }

    loadProject();
  }, [slug]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPreviousImage();
      if (event.key === 'ArrowRight') showNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [closeLightbox, lightboxIndex, showNextImage, showPreviousImage]);

  if (loading) {
    return <div className="py-32 text-center text-slate-400">Loading...</div>;
  }

  if (errorMessage || !project) {
    return (
      <div className="py-32 text-center">
        <p className="text-slate-500">{errorMessage || 'Project not found.'}</p>
        <Link to="/projects" className="mt-6 inline-flex items-center gap-2 text-[#0066B3] font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[55vh] min-h-[360px] flex items-end overflow-hidden">
        {project.cover_image && (
          <img
            src={project.cover_image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#003A70]/95 via-[#003A70]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sky-100 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">
            {normalizeProjectCategory(project.category)}
          </span>

          <h1 className="mt-3 font-poppins font-extrabold text-3xl sm:text-5xl text-white">
            {project.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sky-100 text-sm">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
            )}

            {project.project_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(project.project_date).toLocaleDateString()}
              </span>
            )}

            {project.status && (
              <span className="px-2 py-0.5 rounded bg-[#4E9B47] text-white text-xs">
                {project.status}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-14">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">
            About this project
          </h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {project.full_description || project.description}
          </p>
        </div>

        {metrics.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">
              Impact Metrics
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl bg-gradient-to-br from-[#0066B3] to-[#00B7E5] text-white p-5 text-center"
                >
                  <div className="font-poppins font-extrabold text-2xl">
                    {metric.value}
                  </div>
                  <div className="text-xs text-sky-100 mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gallery.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">
              Gallery
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((item, index) => (
                <img
                  key={item.id}
                  src={item.image_url}
                  alt={item.caption || project.title}
                  onClick={() => setLightboxIndex(index)}
                  className="rounded-xl h-44 w-full object-cover cursor-pointer hover:opacity-90 transition"
                />
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-4">
              Videos
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((video) =>
                isUrlVideo(video.url) ? (
                  <video
                    key={video.id}
                    controls
                    src={video.url}
                    className="rounded-xl w-full aspect-video bg-black"
                  />
                ) : (
                  <iframe
                    key={video.id}
                    src={embedUrl(video.url)}
                    className="rounded-xl w-full aspect-video"
                    allowFullScreen
                    title={video.caption || `Project video ${video.id}`}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <Wave className="w-full h-10 -mt-16" color="#ffffff" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-poppins font-bold text-2xl text-[#003A70] mb-8">
              Related Projects
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project gallery image viewer"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            aria-label="Close gallery image viewer"
          >
            <X className="h-6 w-6" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
                aria-label="Show previous gallery image"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
                aria-label="Show next gallery image"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <figure
            onClick={(event) => event.stopPropagation()}
            className="max-w-6xl w-full flex flex-col items-center gap-4"
          >
            <img
              src={lightboxItem.image_url}
              alt={lightboxItem.caption || project.title}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            {lightboxItem.caption && (
              <figcaption className="max-w-3xl rounded-full bg-white/10 px-5 py-2 text-center text-sm text-sky-50 backdrop-blur">
                {lightboxItem.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}