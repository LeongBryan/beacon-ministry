import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PasscodeGate from "@/components/PasscodeGate";
import AppLayout from "@/components/AppLayout";
import PeopleMap from "@/pages/PeopleMap";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PasscodeGate>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/people" replace />} />
            <Route path="/people" element={<AppLayout><PeopleMap /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PasscodeGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
