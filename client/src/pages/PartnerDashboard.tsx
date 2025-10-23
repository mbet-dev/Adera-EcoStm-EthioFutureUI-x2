import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, QrCode, TrendingUp, DollarSign, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function PartnerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const stats = [
    {
      label: t("earnings"),
      value: "ETB 0",
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Products",
      value: "0",
      icon: ShoppingBag,
      color: "text-chart-4",
    },
    {
      label: "Rating",
      value: "0.0",
      icon: Star,
      color: "text-chart-5",
    },
  ];

  return (
    <DashboardLayout role="partner">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("partner")} {t("dashboard")}
          </h1>
          <p className="text-muted-foreground">
            Manage your shop and pickup/dropoff services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/manage-shop")} data-testid="card-manage-shop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-chart-2" />
                {t("myShop")}
              </CardTitle>
              <CardDescription>
                Manage products and inventory
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/scan-qr")} data-testid="card-scan-parcel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Scan Parcel
              </CardTitle>
              <CardDescription>
                Scan QR codes for pickup/dropoff
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest orders and parcels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Start by adding products to your shop or accepting parcels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
