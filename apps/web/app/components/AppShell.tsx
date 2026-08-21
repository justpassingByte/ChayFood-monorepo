'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';
import { ChatAgent } from './chat/chat-agent';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF9] text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Main Top Navigation */}
      <Navbar />

      {/* Page Content with top clearance */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Luxury Editorial Footer */}
      <Footer />

      {/* AI Culinary Assistant */}
      <ChatAgent />
    </div>
  );
}
