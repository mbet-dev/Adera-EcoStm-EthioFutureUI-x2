import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Onboarding from "@/pages/Onboarding";
import RoleSelection from "@/pages/RoleSelection";
import Auth from "@/pages/Auth";
import CustomerDashboard from "@/pages/CustomerDashboard";
import PartnerDashboard from "@/pages/PartnerDashboard";
import DriverDashboard from "@/pages/DriverDashboard";
import PersonnelDashboard from "@/pages/PersonnelDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import GuestDashboard from "@/pages/GuestDashboard";
import CreateParcel from "@/pages/CreateParcel";
import Marketplace from "@/pages/Marketplace";
import ScanQR from "@/pages/ScanQR";
import Wallet from "@/pages/Wallet";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/auth" component={Auth} />
      
      {/* Dashboards */}
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/partner-dashboard" component={PartnerDashboard} />
      <Route path="/driver-dashboard" component={DriverDashboard} />
      <Route path="/personnel-dashboard" component={PersonnelDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/guest-dashboard" component={GuestDashboard} />
      
      {/* Feature Pages */}
      <Route path="/create-parcel" component={CreateParcel} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/scan-qr" component={ScanQR} />
      <Route path="/wallet" component={Wallet} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
