
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthScreen, { AuthUser } from "./components/app/AuthScreen";

const queryClient = new QueryClient();
const AUTH_URL = "https://functions.poehali.dev/41206671-d349-4cf5-b4b0-d5183af25981";

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setChecking(false); return; }
    fetch(`${AUTH_URL}?action=me`, { headers: { "X-Auth-Token": token } })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else localStorage.removeItem("auth_token");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #FFF9E6, #FFF0F5)" }}>
        <div className="text-4xl animate-float">🌟</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={(u, t) => { localStorage.setItem("auth_token", t); setUser(u); }} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={() => { localStorage.removeItem("auth_token"); setUser(null); }} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;