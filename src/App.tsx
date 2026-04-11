import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import PeopleMap from "@/pages/PeopleMap";
import RoomBooking from "@/pages/RoomBooking";
import Schedule from "@/pages/Schedule";
import MySchedule from "@/pages/MySchedule";
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
          <Route path="/people" element={<AppLayout><PeopleMap /></AppLayout>} />
          <Route path="/rooms" element={<AppLayout><RoomBooking /></AppLayout>} />
          <Route path="/schedule" element={<AppLayout><Schedule /></AppLayout>} />
          <Route path="/my-schedule" element={<AppLayout><MySchedule /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
