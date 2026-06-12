import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import OurRoots from '@/pages/OurRoots';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/pages/ProjectDetails';
import Achievements from '@/pages/Achievements';
import AdoptFrame from '@/pages/AdoptFrame';
import Contact from '@/pages/Contact';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';

// Full Hinnavaru Blue Initiative app: ocean-inspired NGO site with
// dynamic Supabase content, coral frame adoption and admin dashboard.
export default function AppLayout() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F0FCFC]">
        <ScrollToTop />
        <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-roots" element={<OurRoots />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/adopt-a-frame" element={<AdoptFrame />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
