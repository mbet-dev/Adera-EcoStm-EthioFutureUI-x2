import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, History, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function Wallet() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState("");

  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${user?.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Add funds mutation
  const addFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("User not authenticated");
      
      return await apiRequest("POST", "/api/transactions", {
        userId: user.id,
        amount: amount.toString(),
        type: "deposit",
        method: "wallet",
        description: "Wallet top-up",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Funds added to your wallet",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions", user?.id] });
      setCustomAmount("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add funds",
        variant: "destructive",
      });
    },
  });

  const handleQuickAmount = (amount: number) => {
    addFundsMutation.mutate(amount);
  };

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      addFundsMutation.mutate(amount);
    }
  };

  return (
    <DashboardLayout role={user?.role || "customer"}>
      <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t("wallet")}</h1>
          <p className="text-muted-foreground">Manage your balance and transactions</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5" />
                <span className="text-sm opacity-90">{t("balance")}</span>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold">
                  ETB {Number(user?.walletBalance || 0).toFixed(2)}
                </p>
                <p className="text-sm opacity-75">Available balance</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  data-testid="button-add-funds"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("addFunds")}
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  data-testid="button-withdraw"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Funds Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("addFunds")}</CardTitle>
            <CardDescription>Top up your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="font-semibold"
                  onClick={() => handleQuickAmount(amount)}
                  disabled={addFundsMutation.isPending}
                  data-testid={`button-amount-${amount}`}
                >
                  {amount}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                data-testid="input-custom-amount"
              />
              <Button 
                className="w-full" 
                onClick={handleCustomAmount}
                disabled={!customAmount || addFundsMutation.isPending}
                data-testid="button-add-custom"
              >
                {addFundsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Funds
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Payment methods: {t("telebirr")}, Chapa, ArifPay (Demo mode)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              {t("transactionHistory")}
            </CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">{t("loading")}</div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <WalletIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border" data-testid={`transaction-${transaction.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-chart-2/10' : 'bg-muted'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDownRight className="w-5 h-5 text-chart-2" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'deposit' ? 'text-chart-2' : 'text-foreground'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}ETB {transaction.amount}
                      </p>
                      <Badge variant="outline" className="text-xs">{transaction.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
