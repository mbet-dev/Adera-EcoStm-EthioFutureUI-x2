import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, QrCode, MapPin, TrendingUp, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function DriverDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const stats = [
    {
      label: "Today's Deliveries",
      value: "0",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Total Distance",
      value: "0 km",
      icon: MapPin,
      color: "text-chart-4",
    },
    {
      label: t("earnings"),
      value: "ETB 0",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ];

  return (
    <DashboardLayout role="driver">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("driver")} {t("dashboard")}
          </h1>
          <p className="text-muted-foreground">
            Manage your deliveries and routes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Deliveries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Deliveries</CardTitle>
              <Button size="sm" onClick={() => setLocation("/scan-qr")} data-testid="button-scan-qr">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR
              </Button>
            </div>
            <CardDescription>Your assigned parcels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No active deliveries</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                New parcels will appear here when assigned to you
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Route Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-chart-4" />
              Delivery Route
            </CardTitle>
            <CardDescription>Optimized route for your deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Map will be shown here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
