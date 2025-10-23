import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ShoppingCart, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import type { Item } from "@shared/schema";

export default function Marketplace() {
  const { t, language } = useLanguage();
  const { user, isGuest } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all items
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
    queryFn: async () => {
      const response = await fetch("/api/items", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Home & Garden",
    "Books",
    "Beauty & Health",
  ];

  return (
    <DashboardLayout role={user?.role || "guest"}>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">{t("marketplace")}</h1>
            {!isGuest && (
              <Button variant="outline" size="icon" data-testid="button-cart">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={`${t("search")} products...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover-elevate px-4 py-2"
                data-testid={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Featured Products</h2>
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">{t("loading")}</div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No products available yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Partner shops will add their products soon. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((item) => (
                <Card key={item.id} className="hover-elevate overflow-hidden" data-testid={`card-item-${item.id}`}>
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Store className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">ETB {item.price}</span>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-chart-2 text-chart-2" />
                          <span>{Number(item.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" size="sm" disabled={isGuest} data-testid={`button-add-cart-${item.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
