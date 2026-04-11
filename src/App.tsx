import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MinistryFiles from "@/pages/MinistryFiles";
import ServingRoster from "@/pages/ServingRoster";
import MySchedule from "@/pages/MySchedule";
import Announcements from "@/pages/Announcements";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/files" element={<AppLayout><MinistryFiles /></AppLayout>} />
          <Route path="/roster" element={<AppLayout><ServingRoster /></AppLayout>} />
          <Route path="/my-schedule" element={<AppLayout><MySchedule /></AppLayout>} />
          <Route path="/announcements" element={<AppLayout><Announcements /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
