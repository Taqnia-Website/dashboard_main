import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Reviews from "./pages/Reviews";
import Clients from "./pages/Clients";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Articles from "./pages/Articles";
import SocialLinks from "./pages/SocialLinks";
import Emails from "./pages/Emails";
import SiteSettings from "./pages/SiteSettings";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="taqnia-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/dashboard/projects" element={<DashboardLayout><Projects /></DashboardLayout>} />
              <Route path="/dashboard/reviews" element={<DashboardLayout><Reviews /></DashboardLayout>} />
              <Route path="/dashboard/clients" element={<DashboardLayout><Clients /></DashboardLayout>} />
              <Route path="/dashboard/chat" element={<DashboardLayout><Chat /></DashboardLayout>} />
              <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="/dashboard/users" element={<DashboardLayout><Users /></DashboardLayout>} />
              <Route path="/dashboard/articles" element={<DashboardLayout><Articles /></DashboardLayout>} />
              <Route path="/dashboard/social-links" element={<DashboardLayout><SocialLinks /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><SiteSettings /></DashboardLayout>} />
              <Route path="/dashboard/emails" element={<DashboardLayout><Emails /></DashboardLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
