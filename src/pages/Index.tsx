
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0FCFC]">
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </div>
  );
};

export default Index;
