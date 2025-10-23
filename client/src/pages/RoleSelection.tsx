import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Store, Truck, Users, Shield, UserCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import patternBg from "@assets/generated_images/Ethiopian_geometric_pattern_design_be15b984.png";

const roles = [
  {
    value: "customer" as const,
    icon: Package,
    color: "bg-primary/10 text-primary",
  },
  {
    value: "partner" as const,
    icon: Store,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    value: "driver" as const,
    icon: Truck,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    value: "personnel" as const,
    icon: Users,
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    value: "admin" as const,
    icon: Shield,
    color: "bg-chart-3/10 text-chart-3",
  },
];

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { setIsGuest } = useAuth();

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("selectedRole", role);
    setLocation("/auth");
  };

  const handleGuestMode = () => {
    setIsGuest(true);
    setLocation("/guest-dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Pattern */}
      <div className="relative h-32 md:h-40 overflow-hidden">
        <img
          src={patternBg}
          alt="Ethiopian pattern"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
      </div>

      <div className="px-6 py-8 md:px-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("selectRole")}
            </h1>
            <p className="text-muted-foreground">
              {t("welcome")}
            </p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.value}
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => handleRoleSelect(role.value)}
                  data-testid={`card-role-${role.value}`}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
                    <div className={`w-16 h-16 rounded-xl ${role.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {t(role.value)}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Guest Mode */}
          <Card className="border-2 border-dashed">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-foreground">{t("guest")}</h3>
                  <p className="text-sm text-muted-foreground">Browse without creating an account</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleGuestMode}
                data-testid="button-guest-mode"
              >
                {t("continueAsGuest")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
