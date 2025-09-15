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
    id: "freemium",
    name: "Freemium",
    price: 0,
    description: "Basic access for organizations getting started",
    features: [
      "Up to 2 job posts per month",
      "Limited talent search",
      "Community support",
      "Basic dashboard",
      "7-day history",
    ],
    popular: false,
    isFree: true,
    forOrganization: true,
    order: 0,
  },
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
    forOrganization: true,
    order: 1,
  },
  {
    id: "intermediate",
    name: "Intermediate",
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
    forOrganization: true,
    order: 2,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 199,
    description: "For large organizations with complex hiring requirements",
    features: [
      "Everything in Intermediate",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Advanced security features",
      "Custom reporting",
      "API access",
    ],
    popular: false,
    forOrganization: true,
    order: 3,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<{
    plan: string;
    status: string;
    nextBillingDate?: string;
    amount?: number;
    isFree?: boolean;
  } | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [planOrder, setPlanOrder] = useState<string[]>([]); // Store plan order

  // Helper function to get current plan details
  const getPlanDetails = (planId: string) => {
    const plan = plans.find(
      (p) =>
        p.id.toLowerCase() === planId.toLowerCase() ||
        p.name.toLowerCase() === planId.toLowerCase()
    );

    if (plan) {
      return {
        name: plan.name,
        price: plan.price,
        isFree: plan.isFree || plan.price === 0,
      };
    }

    // Handle free/freemium plans specially
    if (
      planId.toLowerCase() === "free" ||
      planId.toLowerCase() === "freemium"
    ) {
      return {
        name: planId.toLowerCase() === "freemium" ? "Freemium" : "Free",
        price: 0,
        isFree: true,
      };
    }
    return {
      name: planId,
      price: 0,
      isFree: false,
    };
  };

  // Fetch subscription plans from settings
  useEffect(() => {
    // Fetch current subscription
    const fetchCurrentSubscription = async () => {
      setIsLoadingSubscription(true);
      try {
        // Try first from user endpoint as it might have subscription info
        const userResponse = await axiosInstance.get("/users");

        if (
          userResponse.data &&
          userResponse.data.data &&
          userResponse.data.data.subscription
        ) {
          const subInfo = userResponse.data.data.subscription;
          const planDetails = getPlanDetails(subInfo.plan || "free");

          setCurrentSubscription({
            plan: subInfo.plan || "FREE",
            status: subInfo.status || "ACTIVE",
            nextBillingDate: subInfo.nextBillingDate,
            amount: subInfo.amount || planDetails.price,
            isFree: planDetails.isFree,
          });

          // Also set the selected plan to match current subscription
          setSelectedPlan(subInfo.plan?.toLowerCase() || "free");
        } else {
          // Try alternate subscription endpoint if available
          try {
            const subResponse = await axiosInstance.get(
              "/subscriptions/current"
            );
            if (subResponse.data && subResponse.data.data) {
              const subInfo = subResponse.data.data;
              const planDetails = getPlanDetails(subInfo.plan || "free");

              setCurrentSubscription({
                plan: subInfo.plan || "FREE",
                status: subInfo.status || "ACTIVE",
                nextBillingDate: subInfo.nextBillingDate,
                amount: subInfo.amount || planDetails.price,
                isFree: planDetails.isFree,
              });

              // Also set the selected plan to match current subscription
              setSelectedPlan(subInfo.plan?.toLowerCase() || "free");
            } else {
              // Default to free plan if no subscription found
              setCurrentSubscription({
                plan: "FREE",
                status: "ACTIVE",
                isFree: true,
              });
              setSelectedPlan("free");
            }
          } catch (subError) {
            console.log("No specific subscription endpoint available");
            // Default to free plan
            setCurrentSubscription({
              plan: "FREE",
              status: "ACTIVE",
              isFree: true,
            });
            setSelectedPlan("free");
          }
        }
      } catch (error) {
        console.error("Error fetching current subscription:", error);
        // Default to free plan on error
        setCurrentSubscription({
          plan: "FREE",
          status: "ACTIVE",
          isFree: true,
        });
        setSelectedPlan("free");
      } finally {
        setIsLoadingSubscription(false);
      }
    };

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
          // Filter for ONLY organization plans
          const organizationPlans = settingsData.app.subscriptionPlans.filter(
            (plan) => {
              // Specific check for organization plans by keywords
              if (plan.id && typeof plan.id === "string") {
                const planId = plan.id.toLowerCase();
                // If it's explicitly marked as an organization plan by ID
                if (planId.includes("org") || planId.includes("organization")) {
                  return true;
                }

                // Check for specific plan IDs we know are organization plans
                if (
                  planId === "freemium" ||
                  planId === "basic" ||
                  planId === "intermediate" ||
                  planId === "advanced" ||
                  planId === "orgfree" ||
                  planId === "orgbasic" ||
                  planId === "freemiumorg" ||
                  planId === "freeorg" ||
                  planId === "basicorg" ||
                  planId === "organizationfree" ||
                  planId === "organizationbasic"
                ) {
                  return true;
                }
              }

              // Check for plan name matching our keywords
              if (plan.name && typeof plan.name === "string") {
                const name = plan.name.toLowerCase();
                if (
                  name === "freemium" ||
                  name === "basic" ||
                  name === "intermediate" ||
                  name === "advanced"
                ) {
                  return true;
                }
              }

              // Strategy 1: Check for organization-specific plan type
              if (plan.type && typeof plan.type === "string") {
                const type = plan.type.toLowerCase();
                if (
                  type === "organization" ||
                  type === "org" ||
                  type.includes("organization") ||
                  type.includes("employer") ||
                  type.includes("company") ||
                  type.includes("business")
                ) {
                  return true;
                }
              }

              // Strategy 2: Check for organization-specific markers in features
              if (
                plan.features &&
                Array.isArray(plan.features) &&
                plan.features.some(
                  (f) =>
                    f === "[ORGANIZATION]" ||
                    (typeof f === "string" &&
                      (f.includes("Organization") ||
                        f.includes("organization") ||
                        f.includes("ORGANIZATION") ||
                        f.includes("[ORG]") ||
                        f.includes("[Org]")))
                )
              ) {
                return true;
              }

              // Strategy 3: Check for organization-specific names
              if (plan.name && typeof plan.name === "string") {
                const name = plan.name.toLowerCase();
                if (
                  name.includes("organization") ||
                  name.includes("business") ||
                  name.includes("corporate") ||
                  name.includes("company") ||
                  name.includes("enterprise") ||
                  name.includes("employer") ||
                  name === "org free" ||
                  name === "org basic"
                ) {
                  return true;
                }
              }

              // Strategy 4: Check for organization-specific features
              if (plan.features && Array.isArray(plan.features)) {
                const hasOrgFeatures = plan.features.some(
                  (f) =>
                    typeof f === "string" &&
                    (f.includes("job post") ||
                      f.includes("recruitment") ||
                      f.includes("hiring") ||
                      f.includes("candidate") ||
                      f.includes("employer") ||
                      f.includes("posting") ||
                      f.includes("recruiter"))
                );
                if (hasOrgFeatures) return true;
              }

              // Special handling for free plans - check if it's marked as organization freemium
              if (
                (plan.isFree ||
                  plan.price === 0 ||
                  (plan.name &&
                    typeof plan.name === "string" &&
                    plan.name.toLowerCase().includes("free"))) &&
                plan.forOrganization === true
              ) {
                return true;
              }

              // Special handling for basic plans - check if it's marked as organization basic
              if (
                plan.name &&
                typeof plan.name === "string" &&
                plan.name.toLowerCase().includes("basic") &&
                plan.forOrganization === true
              ) {
                return true;
              }

              return false; // Skip if no organization-specific markers
            }
          );

          console.log("Found organization plans:", organizationPlans);

          // If no organization plans were found, use default plans
          const plansToProcess =
            organizationPlans.length > 0 ? organizationPlans : defaultPlans;

          // Transform API subscription plans to match our UI format
          let formattedPlans = plansToProcess.map((plan, index) => {
            // Start with a base plan from defaults to ensure we have all fields
            const basePlan =
              defaultPlans[index % defaultPlans.length] || defaultPlans[0];

            const planId =
              plan.name?.toLowerCase()?.replace(/\s+/g, "") || `plan-${index}`;

            // Properly detect free plans
            const isFree =
              planId === "free" ||
              plan.price === 0 ||
              (plan.name && plan.name.toLowerCase().includes("free"));

            return {
              id: planId,
              name: plan.name || `Plan ${index + 1}`,
              price: isFree ? 0 : plan.price || 0, // Ensure free plans show $0
              description:
                Array.isArray(plan.description) && plan.description.length > 0
                  ? plan.description[0]
                  : plan.description || basePlan.description,
              features: plan.features || [],
              popular: !isFree && index === 1, // Mark second paid plan as popular
              isFree: isFree,
              order: plan.order || index, // Use order if available or default to index
            };
          });

          // Ensure we have a free plan
          const hasFree = formattedPlans.some((p) => p.isFree);
          if (!hasFree) {
            formattedPlans.unshift({
              id: "free",
              name: "Free",
              price: 0,
              description: "Basic access for organizations getting started",
              features: [
                "Up to 2 job posts per month",
                "Limited talent search",
                "Community support",
                "Basic dashboard",
                "7-day history",
              ],
              popular: false,
              isFree: true,
              order: -1, // Always put free first by default
            });
          }

          // Sort plans by price (lowest to highest)
          formattedPlans.sort((a, b) => a.price - b.price);

          console.log("Using organization plans:", formattedPlans);
          setPlans(formattedPlans);
        } else {
          console.log(
            "No subscription plans found in settings, using defaults"
          );
          // Still ensure default plans are in the right order
          const sortedDefaults = [...defaultPlans].sort((a, b) => {
            if ((a as any).order && (b as any).order) {
              return (a as any).order - (b as any).order;
            }
            return 0; // Keep original order
          });

          setPlans(sortedDefaults);
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

    fetchSubscriptionPlans();
    fetchCurrentSubscription();
  }, []);

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
                {isLoadingSubscription ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-orange-500 rounded-full animate-spin mr-2"></div>
                    <p className="text-slate-300">
                      Loading subscription info...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Current Plan:{" "}
                        {currentSubscription?.plan === "FREE"
                          ? "Free Tier"
                          : getPlanDetails(currentSubscription?.plan || "")
                              .name}
                      </h2>

                      {currentSubscription?.nextBillingDate &&
                        !currentSubscription.isFree && (
                          <p className="text-slate-300 mb-4">
                            Your subscription{" "}
                            {currentSubscription?.status?.toLowerCase() ===
                            "active"
                              ? "renews"
                              : "would renew"}{" "}
                            on{" "}
                            {new Date(
                              currentSubscription.nextBillingDate
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}

                      {currentSubscription?.isFree && (
                        <p className="text-slate-300 mb-4">
                          Free tier with limited features
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <Badge
                          className={`${
                            currentSubscription?.status === "ACTIVE" ||
                            currentSubscription?.status === "active"
                              ? "bg-emerald-600"
                              : currentSubscription?.status === "PENDING" ||
                                currentSubscription?.status === "pending"
                              ? "bg-amber-600"
                              : "bg-red-600"
                          } text-white`}
                        >
                          {currentSubscription?.status === "ACTIVE" ||
                          currentSubscription?.status === "active"
                            ? "Active"
                            : currentSubscription?.status || "Inactive"}
                        </Badge>
                        <span className="text-2xl font-bold text-white">
                          {currentSubscription?.isFree
                            ? currentSubscription?.plan === "FREEMIUM" ||
                              currentSubscription?.plan === "freemium"
                              ? "Freemium"
                              : "Free"
                            : `$${currentSubscription?.amount || 0}/month`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* Button removed as paid plans are not available */}
                      <div className="text-sm text-slate-400">
                        Premium plans coming soon
                      </div>

                      {!currentSubscription?.isFree &&
                        currentSubscription?.amount && (
                          <p className="text-sm text-slate-400">
                            Next billing: $
                            {currentSubscription.amount.toFixed(2)}
                          </p>
                        )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organization Plans Section - Currently only showing Free Tier */}
            <div id="plans-section">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Organization Plan
                </h2>
              </div>

              {isLoadingPlans ? (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-900 border border-slate-700 rounded-lg">
                  <div className="w-10 h-10 border-2 border-slate-600 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">Loading subscription info...</p>
                </div>
              ) : (
                <div className="p-8 bg-slate-900 border border-slate-700 rounded-lg text-center">
                  <div className="flex flex-col items-center justify-center mb-8">
                    <Badge className="mb-4 bg-emerald-600 text-white py-1 px-3">
                      Current Plan
                    </Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Free Tier
                    </h3>
                    <p className="text-slate-400 max-w-lg mx-auto">
                      Basic access for organizations getting started with
                      Propellant. Additional plan options will be available
                      soon.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-800/50 rounded-lg p-6 mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Features include:
                    </h4>
                    <ul className="space-y-2 text-left">
                      {defaultPlans[0].features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-slate-400 text-sm">
                    Premium organization plans will be available soon. Contact
                    support for more information.
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method - Simplified for Free Tier */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Payment Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  No payment required for Free Tier
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    You're on the Free Tier
                  </h3>
                  <p className="text-slate-400 max-w-md">
                    No payment information is required for your current plan.
                    When premium plans become available, payment options will be
                    accessible here.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing History - Simplified for Free Tier */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Billing History
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Transaction records will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    No Billing History
                  </h3>
                  <p className="text-slate-400 max-w-md">
                    You're on the Free Tier with no billing history. When
                    premium plans become available, your transaction records
                    will appear here.
                  </p>
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
