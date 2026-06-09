import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import type { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-sky-50"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={project.cover_image}
          alt={project.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#0066B3]">
          {project.category}
        </span>
        {project.status && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#4E9B47]/90 text-white">
            {project.status}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-poppins font-bold text-[#003A70] text-lg group-hover:text-[#0066B3] transition">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
          {project.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.location}</span>
          )}
          {project.project_date && (
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(project.project_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
