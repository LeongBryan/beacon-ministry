import { LogOut } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut size={14} /> Sign out
        </Button>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
