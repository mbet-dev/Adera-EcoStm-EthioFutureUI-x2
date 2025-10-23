import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, QrCode, Users, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useLocation } from "wouter";

export default function PersonnelDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const stats = [
    {
      label: "Parcels at Hub",
      value: "0",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Scanned Today",
      value: "0",
      icon: QrCode,
      color: "text-chart-4",
    },
    {
      label: "Issues Reported",
      value: "0",
      icon: AlertCircle,
      color: "text-chart-3",
    },
  ];

  return (
    <DashboardLayout role="personnel">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("personnel")} {t("dashboard")}
          </h1>
          <p className="text-muted-foreground">
            Sorting facility operations
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
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/scan-qr")} data-testid="card-scan-parcel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Scan & Verify
              </CardTitle>
              <CardDescription>
                Scan parcels at sorting center
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/assign-driver")} data-testid="card-assign-driver">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-chart-4" />
                Assign Drivers
              </CardTitle>
              <CardDescription>
                Assign parcels to drivers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Parcels List */}
        <Card>
          <CardHeader>
            <CardTitle>Parcels at Hub</CardTitle>
            <CardDescription>Manage parcels at sorting facility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No parcels at hub</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Parcels will appear here when they arrive at the sorting facility
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
