import { MapPin } from 'lucide-react';
import { STATUS_COLORS } from '@/lib/constants';
import type { Frame } from '@/lib/types';

export function FrameCard({ frame, onAdopt }: { frame: Frame; onAdopt: (f: Frame) => void }) {
  const available = frame.status === 'Available';
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition border border-[#CDEFEF]">
      <div className="relative h-44 overflow-hidden">
        <img src={frame.photo} alt={frame.frame_code} className="h-full w-full object-cover" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[frame.status] || 'bg-slate-100 text-slate-600'}`}>
          {frame.status}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins font-bold text-[#003A70]">{frame.frame_code}</h3>
          <span className="font-bold text-[#0066B3]">${frame.donation_amount}</span>
        </div>
        {frame.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{frame.location}</p>
        )}
        {frame.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{frame.description}</p>}
        <button
          disabled={!available}
          onClick={() => onAdopt(frame)}
          className={`mt-4 w-full rounded-full py-2 text-sm font-semibold transition ${
            available
              ? 'text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5] hover:opacity-90'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {available ? 'Adopt This Frame' : frame.status}
        </button>
      </div>
    </div>
  );
}
