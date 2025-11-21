import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TournamentProvider } from "./contexts/TournamentContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import EventSelection from "./pages/EventSelection";
import AdminDashboard from "./pages/AdminDashboard";
import LiveCourts from "./pages/LiveCourts";
import UmpirePanel from "./pages/UmpirePanel";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Community from "./pages/Community";
import ClubView from "./pages/ClubView";
import CourtBooking from "./pages/CourtBooking";
import CreateClub from "./pages/CreateClub";
import Committee from "./pages/Committee";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Admin route guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/admin-login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TournamentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventSelection />} />
              <Route path="/community" element={<Community />} />
              <Route path="/club/:clubId" element={<ClubView />} />
              <Route path="/court-booking" element={<CourtBooking />} />
              <Route path="/create-club" element={<CreateClub />} />
              <Route path="/courts" element={<LiveCourts />} />
              <Route path="/umpire" element={<UmpirePanel />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/committee"
                element={
                  <AdminRoute>
                    <Committee />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </TournamentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
