import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Check,
  Star,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import { toast } from "sonner";

// Default plans to use as fallback if API fails
const defaultPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Perfect for small organizations getting started",
    features: [
      "Up to 5 job posts per month",
      "Basic talent search",
      "Email support",
      "Standard analytics",
      "Basic messaging",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "Ideal for growing companies with regular hiring needs",
    features: [
      "Unlimited job posts",
      "Advanced talent search & filters",
      "Priority support",
      "Advanced analytics & reporting",
      "Unlimited messaging",
      "Verified talent pool access",
      "AI-powered matching",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "For large organizations with complex hiring requirements",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Advanced security features",
      "Custom reporting",
      "API access",
    ],
    popular: false,
  },
];

const billingHistory = [
  {
    date: "2024-01-01",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2024-001",
  },
  {
    date: "2023-12-01",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2023-012",
  },
  {
    date: "2023-11-01",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2023-011",
  },
  {
    date: "2023-10-01",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2023-010",
  },
];

const OrganizationPayment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [plans, setPlans] = useState(defaultPlans);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Fetch subscription plans from settings
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await axiosInstance.get("/settings");

        // Handle both response formats
        let settingsData;
        if (response.data.data && response.data.data.app) {
          settingsData = response.data.data;
        } else {
          settingsData = response.data || {};
        }

        // Check if we have subscription plans in the settings
        if (
          settingsData.app?.subscriptionPlans &&
          Array.isArray(settingsData.app.subscriptionPlans) &&
          settingsData.app.subscriptionPlans.length > 0
        ) {
          // Filter plans for organizations
          // Use one of these strategies for filtering:
          // 1. Look for organization-specific markers in features
          // 2. Filter by name patterns
          // 3. Filter by price ranges (organization plans typically cost more)

          const orgPlans = settingsData.app.subscriptionPlans.filter((plan) => {
            // Strategy 1: Check for organization-specific markers
            if (
              plan.features.some(
                (f) =>
                  f === "[ORGANIZATION]" ||
                  f.includes("for organizations") ||
                  f.includes("For Organizations")
              )
            ) {
              return true;
            }

            // Strategy 2: Check for organization-specific names
            const orgPlanNames = [
              "basic",
              "advanced",
              "enterprise",
              "business",
              "corporate",
            ];
            if (
              orgPlanNames.some((name) =>
                plan.name.toLowerCase().includes(name)
              )
            ) {
              return true;
            }

            // Strategy 3: If no explicit org plans found, don't use talent plans
            if (
              plan.features.some(
                (f) =>
                  f === "[TALENT]" ||
                  f.includes("for talent") ||
                  f.includes("For Talent")
              )
            ) {
              return false;
            }

            // Strategy 4: Use job posting related features
            if (
              plan.features.some(
                (f) =>
                  f.includes("job post") ||
                  f.includes("hiring") ||
                  f.includes("recruit")
              )
            ) {
              return true;
            }

            // Default: Use higher-priced plans for organizations if no other indicators
            return plan.price >= 49;
          });

          // If no organization-specific plans found, fall back to defaults
          const plansToUse =
            orgPlans.length > 0 ? orgPlans : settingsData.app.subscriptionPlans;

          // Transform API subscription plans to match our UI format
          const formattedPlans = plansToUse.map((plan, index) => {
            // Start with a base plan from defaults to ensure we have all fields
            const basePlan =
              defaultPlans[index % defaultPlans.length] || defaultPlans[0];

            // Clean up any markers from the features list that we don't want to show to users
            const cleanedFeatures = plan.features.filter(
              (feature) =>
                !feature.includes("[ORGANIZATION]") &&
                !feature.includes("[TALENT]")
            );

            return {
              id:
                plan.name?.toLowerCase()?.replace(/\s+/g, "") ||
                `plan-${index}`,
              name: plan.name || `Plan ${index + 1}`,
              price: plan.price || 0,
              description:
                Array.isArray(plan.description) && plan.description.length > 0
                  ? plan.description[0]
                  : basePlan.description,
              features: cleanedFeatures,
              popular: index === 1, // Mark second plan as popular
            };
          });

          console.log("Using organization subscription plans:", formattedPlans);
          setPlans(formattedPlans);
        } else {
          console.log(
            "No subscription plans found in settings, using defaults"
          );
        }
      } catch (error) {
        console.error(
          "Error fetching subscription plans from settings:",
          error
        );
        toast("Could not load subscription plans, using defaults", {
          description: "Please try again later or contact support.",
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    // Fetch payment methods and subscription plans
    const fetchPaymentMethods = async () => {
      try {
        const response = await axiosInstance.get("/payment");
        console.log("Payment methods:", response.data);
        if (response.data && response.data.data) {
          setPaymentMethods(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
    fetchSubscriptionPlans();
  }, []);

  // Handle plan selection and payment
  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    setIsUpgrading(true);

    try {
      // Send the plan information to the backend
      const response = await axiosInstance.post("/premium", {
        plan: selectedPlan.toUpperCase(),
      });

      // Check if response contains a payment URL
      if (
        response.data &&
        typeof response.data === "string" &&
        response.data.startsWith("http")
      ) {
        // Redirect to payment gateway
        window.location.href = response.data;
      } else {
        toast("Subscription updated successfully", {
          description: "Your account has been updated with the new plan.",
        });
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast("Payment failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Subscription & Billing
                  </h1>
                  <p className="text-slate-400">
                    Manage your subscription and payment methods
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Current Plan */}
            <Card className="bg-gradient-to-r from-orange-600/20 to-emerald-600/20 border-orange-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Current Plan: Professional
                    </h2>
                    <p className="text-slate-300 mb-4">
                      Your subscription renews on January 15, 2024
                    </p>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-emerald-600 text-white">
                        Active
                      </Badge>
                      <span className="text-2xl font-bold text-white">
                        $99/month
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="outline"
                      className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white mb-2"
                    >
                      Manage Subscription
                    </Button>
                    <p className="text-sm text-slate-400">
                      Next billing: $99.00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Choose Your Plan
              </h2>

              {isLoadingPlans ? (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-900 border border-slate-700 rounded-lg">
                  <div className="w-10 h-10 border-2 border-slate-600 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">
                    Loading subscription plans...
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative bg-slate-900 border-slate-700 ${
                        plan.popular
                          ? "border-orange-500 shadow-lg shadow-orange-500/20"
                          : ""
                      } ${
                        selectedPlan === plan.id ? "ring-2 ring-orange-500" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-orange-600 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center">
                        <CardTitle className="text-white text-xl">
                          {plan.name}
                        </CardTitle>
                        <div className="text-3xl font-bold text-white">
                          ${plan.price}
                          <span className="text-lg font-normal text-slate-400">
                            /month
                          </span>
                        </div>
                        <CardDescription className="text-slate-400">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`w-full ${
                            selectedPlan === plan.id
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-slate-700 hover:bg-slate-600"
                          } text-white`}
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {selectedPlan === plan.id
                            ? "Selected"
                            : "Select Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Continue to Payment button */}
              {selectedPlan && (
                <div className="mt-6 flex justify-center">
                  <Button
                    disabled={isUpgrading}
                    onClick={handlePayment}
                    className="px-8 py-6 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold"
                  >
                    {isUpgrading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-sm text-slate-400">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-600/30 text-emerald-400"
                  >
                    Default
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-white">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate" className="text-white">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard" className="text-white">
                      Name on Card
                    </Label>
                    <Input
                      id="nameOnCard"
                      placeholder="John Doe"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Billing History
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your recent payments and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingHistory.map((bill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {bill.amount}
                          </p>
                          <p className="text-sm text-slate-400">{bill.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="border-emerald-600/30 text-emerald-400"
                        >
                          {bill.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationPayment;
