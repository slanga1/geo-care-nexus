import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from './ui/sonner';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} HealthLink Inc. All rights reserved.
        </div>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
};
