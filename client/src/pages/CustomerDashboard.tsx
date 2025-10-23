import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag, Wallet, Bell, MessageSquare, Settings, MapPin, QrCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import type { Parcel, Order } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("ptp");
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's parcels
  const { data: parcels = [], isLoading: parcelsLoading } = useQuery<Parcel[]>({
    queryKey: ["/api/parcels/sender", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/parcels/sender/${user?.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch parcels");
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Fetch user's orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/customer", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/customer/${user?.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const quickActions = [
    {
      icon: Package,
      label: t("sendParcel"),
      color: "bg-primary/10 text-primary",
      path: "/create-parcel",
    },
    {
      icon: QrCode,
      label: t("trackParcel"),
      color: "bg-chart-4/10 text-chart-4",
      path: "/track-parcel",
    },
    {
      icon: ShoppingBag,
      label: t("shopNow"),
      color: "bg-chart-2/10 text-chart-2",
      path: "/marketplace",
    },
    {
      icon: Wallet,
      label: t("wallet"),
      color: "bg-chart-5/10 text-chart-5",
      path: "/wallet",
    },
  ];

  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your parcels and shop from local businesses
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.label}
                className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setLocation(action.path)}
                data-testid={`card-action-${action.label.toLowerCase().replace(" ", "-")}`}
              >
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs for PTP and Shops */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ptp" data-testid="tab-ptp">
              <Package className="w-4 h-4 mr-2" />
              Adera-PTP
            </TabsTrigger>
            <TabsTrigger value="shops" data-testid="tab-shops">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Adera-Shops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ptp" className="space-y-6 mt-6">
            {/* Recent Parcels */}
            <Card>
              <CardHeader>
                <CardTitle>{t("myParcels")}</CardTitle>
                <CardDescription>Track your recent deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                {parcelsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">{t("loading")}</div>
                ) : parcels.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No parcels yet"
                    description="Send your first parcel to get started"
                    action={
                      <Button onClick={() => setLocation("/create-parcel")} data-testid="button-send-first-parcel">
                        {t("sendParcel")}
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {parcels.slice(0, 5).map((parcel) => (
                      <Card key={parcel.id} className="hover-elevate cursor-pointer" onClick={() => setLocation(`/track-parcel?id=${parcel.trackingId}`)} data-testid={`card-parcel-${parcel.id}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground font-mono text-sm">{parcel.trackingId}</p>
                            <p className="text-sm text-muted-foreground">{parcel.recipientName}</p>
                          </div>
                          <Badge variant={parcel.status === 'delivered' ? 'default' : 'secondary'} data-testid={`badge-status-${parcel.id}`}>
                            {t(parcel.status as any) || parcel.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops" className="space-y-6 mt-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>{t("orders")}</CardTitle>
                <CardDescription>Your shopping history</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">{t("loading")}</div>
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingBag}
                    title="No orders yet"
                    description="Start shopping from local businesses"
                    action={
                      <Button onClick={() => setLocation("/marketplace")} data-testid="button-start-shopping">
                        {t("shopNow")}
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <Card key={order.id} className="hover-elevate" data-testid={`card-order-${order.id}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">ETB {order.totalPrice}</p>
                          </div>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} data-testid={`badge-order-status-${order.id}`}>
                            {t(order.status as any) || order.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
