import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LOGO_URL, PROJECT_CATEGORIES, normalizeProjectCategory } from '@/lib/constants';
import { LogOut, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

const TABS = [
  { key: 'projects', label: 'Projects' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'frames', label: 'Frames' },
  { key: 'frame_progress', label: 'Frame Progress' },
  { key: 'adoption_requests', label: 'Adoption Requests' },
  { key: 'contact_messages', label: 'Messages' },
  { key: 'site_content', label: 'Site Content' },
];

type AdminRow = Record<string, string | number | boolean | null | undefined>;

const FIELDS: Record<string, { key: string; label: string; type?: string }[]> = {
  projects: [
    { key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' }, { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'full_description', label: 'Full Description', type: 'textarea' },
    { key: 'cover_image', label: 'Cover Image URL' }, { key: 'status', label: 'Status' }, { key: 'location', label: 'Location' },
    { key: 'project_date', label: 'Date', type: 'date' },
  ],
  achievements: [
    { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image', label: 'Image URL' }, { key: 'metric_value', label: 'Metric Value' }, { key: 'metric_label', label: 'Metric Label' },
    { key: 'achievement_date', label: 'Date', type: 'date' },
  ],
  frames: [
    { key: 'frame_code', label: 'Frame Code' }, { key: 'location', label: 'Location' }, { key: 'status', label: 'Status' },
    { key: 'photo', label: 'Photo URL' }, { key: 'donation_amount', label: 'Donation Amount', type: 'number' }, { key: 'description', label: 'Description', type: 'textarea' },
  ],
  frame_progress: [
    { key: 'frame_id', label: 'Frame ID' }, { key: 'note', label: 'Note', type: 'textarea' }, { key: 'photo', label: 'Photo URL' }, { key: 'progress_date', label: 'Date', type: 'date' },
  ],
  site_content: [
    { key: 'key', label: 'Key' }, { key: 'title', label: 'Title' }, { key: 'content', label: 'Content / JSON', type: 'textarea' },
  ],
};

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState('projects');
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(tab).select('*').order('created_at', { ascending: false });
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    setRows((data || []) as AdminRow[]);
  }, [tab]);

  useEffect(() => { if (session) load(); }, [load, session]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) {
      const { error: e2 } = await supabase.auth.signUp({ email, password: pw });
      if (e2) setErr(e2.message);
    }
  };

  const save = async () => {
    const payload = { ...editing };
    if (tab === 'projects' && typeof payload.category === 'string') {
      payload.category = normalizeProjectCategory(payload.category);
    }
    delete payload.created_at; delete payload.updated_at;
    if (payload.donation_amount) payload.donation_amount = Number(payload.donation_amount);
    if (payload.id) {
      const { data, error } = await supabase.from(tab).update(payload).eq('id', payload.id).select();
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
    } else {
      delete payload.id;
      const { data, error } = await supabase.from(tab).insert(payload).select();
      console.log('Supabase result:', data);
      console.error('Supabase error:', error);
    }
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const { data, error } = await supabase.from(tab).delete().eq('id', id).select();
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    load();
  };

  const togglePublish = async (row: AdminRow) => {
    const { data, error } = await supabase.from(tab).update({ published: !row.published }).eq('id', row.id).select();
    console.log('Supabase result:', data);
    console.error('Supabase error:', error);
    load();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003A70] to-[#0066B3] p-4">
        <form onSubmit={login} className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
          <img src={LOGO_URL} alt="Hinnavaru Blue Initiative logo" className="h-14 w-14 object-contain mx-auto" />
          <h1 className="mt-4 text-center font-poppins font-bold text-xl text-[#003A70]">Admin Dashboard</h1>
          {err && <p className="mt-3 text-sm text-red-500 text-center">{err}</p>}
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-f w-full mt-5" />
          <input required type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className="input-f w-full mt-3" />
          <button className="w-full rounded-full py-3 mt-5 font-semibold text-white bg-gradient-to-r from-[#0066B3] to-[#00B7E5]">Sign In</button>
          <p className="mt-3 text-xs text-center text-slate-400">First sign-in creates the admin account.</p>
        </form>
      </div>
    );
  }

  const hasPublish = ['projects', 'achievements'].includes(tab);
  const editable = FIELDS[tab];

  return (
    <div className="min-h-screen bg-[#F0FCFC]">
      <header className="bg-[#003A70] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Hinnavaru Blue Initiative logo" className="h-9 w-9 object-contain" />
          <span className="font-poppins font-bold">HBI Admin</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-sm hover:text-[#68E0D6]"><LogOut className="h-4 w-4" /> Sign Out</button>
      </header>

      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-[#CDEFEF] bg-[#E8F8F7]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setEditing(null); }} className={`px-4 py-2 rounded-full text-sm font-medium ${tab === t.key ? 'bg-[#0066B3] text-white' : 'bg-[#E8F8F7] text-slate-600'}`}>{t.label}</button>
        ))}
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {editable && (
          <button onClick={() => setEditing({})} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E9B47] text-white text-sm font-semibold"><Plus className="h-4 w-4" /> New</button>
        )}

        {editing && editable && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-[#CDEFEF]">
            <h3 className="font-poppins font-bold text-[#003A70] mb-4">{editing.id ? 'Edit' : 'Create'}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {editable.map((f) => {
                if (tab === 'projects' && f.key === 'category') {
                  return (
                    <select
                      key={f.key}
                      value={normalizeProjectCategory(String(editing[f.key] || ''))}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="input-f"
                    >
                      {PROJECT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  );
                }

                return f.type === 'textarea' ? (
                  <textarea key={f.key} placeholder={f.label} value={editing[f.key] || ''} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="input-f sm:col-span-2" rows={2} />
                ) : (
                  <input key={f.key} type={f.type || 'text'} placeholder={f.label} value={editing[f.key] || ''} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="input-f" />
                );
              })}
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={save} className="px-5 py-2 rounded-full bg-[#0066B3] text-white text-sm font-semibold">Save</button>
              <button onClick={() => setEditing(null)} className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-4 shadow-sm border border-[#CDEFEF] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-[#003A70] truncate">{r.title || r.frame_code || r.name || r.subject || r.note || 'Item'}</div>
                <div className="text-xs text-slate-500 truncate">{tab === 'projects' && r.category ? normalizeProjectCategory(String(r.category)) : r.category || r.email || r.status || r.location || ''}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasPublish && (
                  <button onClick={() => togglePublish(r)} className="p-2 text-slate-500 hover:text-[#0066B3]" title="Publish/Unpublish">
                    {r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                )}
                {editable && <button onClick={() => setEditing(r)} className="px-3 py-1.5 rounded-lg bg-[#E8F8F7] text-[#0066B3] text-xs font-semibold">Edit</button>}
                <button onClick={() => del(r.id)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="text-slate-400 text-sm">No items.</p>}
        </div>
      </div>
    </div>
  );
}
