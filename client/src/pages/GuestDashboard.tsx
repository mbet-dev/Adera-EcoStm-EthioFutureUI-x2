import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function GuestDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout role="guest">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {t("welcome")} {t("guest")}!
          </h1>
          <p className="text-muted-foreground">
            Browse shops and explore Adera services
          </p>
        </div>

        {/* Limited Features */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Limited Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account to send parcels, make purchases, and access all features
                  </p>
                </div>
              </div>
              <Button onClick={() => setLocation("/role-selection")} data-testid="button-create-account">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Browse Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/marketplace")} data-testid="card-browse-shops">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-chart-2" />
                Browse Marketplace
              </CardTitle>
              <CardDescription>
                Explore products from local businesses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-view-partners">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                View Partner Locations
              </CardTitle>
              <CardDescription>
                Find pickup and dropoff points near you
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
