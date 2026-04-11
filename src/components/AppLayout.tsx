import { useState } from "react";
import { Users, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpeg";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-6 py-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <img src={logo} alt="BCC" className="w-10 h-10 rounded-lg object-cover" />
        <div>
          <h1 className="text-base font-semibold text-sidebar-foreground leading-tight">Bethesda CC</h1>
          <p className="text-xs text-sidebar-foreground/60">Planning Hub</p>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
