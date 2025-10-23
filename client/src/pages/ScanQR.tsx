import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Camera, Keyboard, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function ScanQR() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [manualCode, setManualCode] = useState("");

  return (
    <DashboardLayout role={user?.role || "partner"}>
      <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(-1)}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scan Parcel</h1>
            <p className="text-muted-foreground">Scan or enter QR code</p>
          </div>
        </div>

        <Tabs defaultValue="camera">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" data-testid="tab-camera">
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="manual" data-testid="tab-manual">
              <Keyboard className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Camera Scanner</CardTitle>
                <CardDescription>Point your camera at the QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square max-w-md mx-auto bg-muted rounded-lg flex flex-col items-center justify-center gap-4 border-2 border-dashed">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera will activate here</p>
                  <Button data-testid="button-activate-camera">Activate Camera</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>Enter the tracking code manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter tracking code..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  data-testid="input-tracking-code"
                  className="text-center text-lg font-mono"
                />
                <Button className="w-full" data-testid="button-verify-code">
                  Verify Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your scan history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No scans yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Scanned parcels will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
