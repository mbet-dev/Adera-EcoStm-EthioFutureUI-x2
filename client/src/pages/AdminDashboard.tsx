import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function AdminDashboard() {
  const { t } = useLanguage();

  const kpis = [
    {
      label: "Total Parcels",
      value: "0",
      change: "+0%",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Total Orders",
      value: "0",
      change: "+0%",
      icon: ShoppingBag,
      color: "text-chart-2",
    },
    {
      label: "Active Users",
      value: "0",
      change: "+0%",
      icon: Users,
      color: "text-chart-4",
    },
    {
      label: "Revenue",
      value: "ETB 0",
      change: "+0%",
      icon: DollarSign,
      color: "text-chart-5",
    },
    {
      label: "Partners",
      value: "0",
      change: "+0%",
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      label: "Disputes",
      value: "0",
      change: "0",
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("admin")} {t("dashboard")}
          </h1>
          <p className="text-muted-foreground">
            System-wide metrics and management
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className={`w-5 h-5 ${kpi.color}`} />
                      <span className="text-xs text-muted-foreground">{kpi.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Volume</CardTitle>
              <CardDescription>Parcels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Income analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">User management coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                View and manage all users, partners, drivers, and personnel
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
