import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";

const parcelSchema = z.object({
  recipientName: z.string().min(2, "Name is required"),
  recipientPhone: z.string().min(9, "Phone number is required"),
  weight: z.string().min(1, "Weight is required"),
  pickupPartnerId: z.string().optional(),
  dropoffPartnerId: z.string().optional(),
  description: z.string().optional(),
  paymentMethod: z.enum(["wallet", "cash_on_delivery"]),
});

type ParcelForm = z.infer<typeof parcelSchema>;

export default function CreateParcel() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ParcelForm>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      recipientName: "",
      recipientPhone: "",
      weight: "",
      description: "",
      paymentMethod: "wallet",
    },
  });

  const createParcelMutation = useMutation({
    mutationFn: async (data: ParcelForm) => {
      if (!user) throw new Error("User not authenticated");
      
      return await apiRequest("POST", "/api/parcels", {
        ...data,
        senderId: user.id,
        weight: data.weight,
        price: "50.00", // Dynamic pricing to be implemented
        isPaid: false,
      });
    },
    onSuccess: (parcel) => {
      toast({
        title: "Success!",
        description: `Parcel created with tracking ID: ${parcel.trackingId}`,
      });
      // Invalidate parcels cache to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/parcels/sender", user?.id] });
      setLocation("/customer-dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create parcel",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ParcelForm) => {
    createParcelMutation.mutate(data);
  };

  return (
    <DashboardLayout role="customer">
      <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/customer-dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("sendParcel")}</h1>
            <p className="text-muted-foreground">Create a new parcel delivery</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("parcelDetails")}</CardTitle>
            <CardDescription>Fill in the delivery information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Recipient Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">{t("recipient")} Information</h3>
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Recipient name" data-testid="input-recipient-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder="+251 9XX XXX XXX" data-testid="input-recipient-phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Parcel Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Parcel Information</h3>
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("weight")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="2.5" data-testid="input-weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the contents..."
                            data-testid="input-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Locations
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select pickup and dropoff partners from the map
                    </p>
                    <div className="aspect-video bg-background rounded-lg flex items-center justify-center border">
                      <p className="text-sm text-muted-foreground">Interactive map will be shown here</p>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {t("uploadPhotos")}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover-elevate"
                        data-testid={`upload-photo-${i}`}
                      >
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paymentMethod")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wallet" data-testid="option-wallet">Wallet</SelectItem>
                          <SelectItem value="cash_on_delivery" data-testid="option-cod">{t("cashOnDelivery")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Estimate */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Estimated Price</span>
                      <span className="text-2xl font-bold text-primary">ETB 0.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Price will be calculated based on distance and weight
                    </p>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg" disabled={createParcelMutation.isPending} data-testid="button-create-parcel">
                  {createParcelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Parcel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
