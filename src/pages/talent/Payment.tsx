import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Star, Shield, Zap } from "lucide-react";
import { PaymentMethod } from "@/utils/global";
import axiosInstance from "@/api/AxiosInstance.ts";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "Forever",
    features: [
      "Basic profile creation",
      "Upload up to 5 credentials",
      "Basic CV generator",
      "1 CV download per month",
      "Email support",
    ],
    limitations: [
      "Limited verification requests",
      "No priority support",
      "Basic analytics",
    ],
    buttonText: "Current Plan",
    isCurrentPlan: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    period: "per month",
    features: [
      "Enhanced profile with portfolio",
      "Unlimited credential uploads",
      "AI-powered CV optimization",
      "Unlimited CV downloads",
      "NFT skill badges",
      "Priority verification",
      "Advanced analytics",
      "Priority support",
    ],
    buttonText: "Upgrade Now",
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 59,
    period: "per month",
    features: [
      "Everything in Professional",
      "Personal brand building tools",
      "Advanced recommendation engine",
      "Multiple CV templates",
      "Interview preparation tools",
      "Career coaching sessions",
      "Premium support",
      "API access",
    ],
    buttonText: "Upgrade Now",
  },
];

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axiosInstance.get("/payment");
        console.log(response.data);
        console.log(response.data.data);
        setPaymentMethods(response.data.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId.toUpperCase() as "PROFESSIONAL" | "PREMIUM");
  };

  const handlePayment = async () => {
    setIsUpgrading(true);

    try {
      // The backend only needs the plan information
      const response = await axiosInstance.post("premium", {
        plan: selectedPlan.toUpperCase() as "PROFESSIONAL" | "PREMIUM" | "FREE",
      });

      // Check if response contains a payment URL
      if (
        response.data &&
        typeof response.data === "string" &&
        response.data.startsWith("http")
      ) {
        // Redirect to payment gateway
        window.location.href = response.data;
      } else if (selectedPlan.toUpperCase() === "FREE") {
        // For free plan, no redirection is needed
        toast.success("Successfully switched to Free plan");
      } else {
        toast.error("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      if (isAxiosError(error)) {
        toast.error(
          `${
            error.response?.data?.message ||
            error.message ||
            "Payment failed. Please try again."
          }`
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
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

          <Badge
            variant="secondary"
            className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
          >
            Free Plan Active
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Current Subscription */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Current Subscription</CardTitle>
            <CardDescription className="text-slate-400">
              Your active subscription details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                <p className="text-slate-400">Active since January 2024</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">$0</p>
                <p className="text-slate-400">Forever</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Upgrade Your Plan</CardTitle>
            <CardDescription className="text-slate-400">
              Choose a plan that fits your professional needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-lg border transition-all duration-300 ${
                    plan.isPopular
                      ? "border-blue-500 bg-blue-500/10"
                      : plan.isCurrentPlan
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-700 bg-slate-800/50"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-slate-400 ml-1">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() =>
                      !plan.isCurrentPlan && handleUpgrade(plan.id)
                    }
                    disabled={plan.isCurrentPlan}
                    className={`w-full ${
                      plan.isPopular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : plan.isCurrentPlan
                        ? "bg-emerald-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    } text-white flex items-center gap-2`}
                  >
                    {(plan.id.toUpperCase() as "PROFESSIONAL" | "PREMIUM") ===
                      selectedPlan && <Check className="w-4 h-4" />}
                    {(plan.id.toUpperCase() as "PROFESSIONAL" | "PREMIUM") ===
                    selectedPlan
                      ? "Selected Plan"
                      : plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {selectedPlan !== "free" && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your payment details to complete the subscription
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/*<div>*/}
              {/*    <Label className="text-slate-300">Payment Method</Label>*/}
              {/*    <Select value={paymentMethod} onValueChange={setPaymentMethod}>*/}
              {/*        <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2">*/}
              {/*            <SelectValue placeholder="Select payment method"/>*/}
              {/*        </SelectTrigger>*/}
              {/*        <SelectContent className="bg-slate-800 border-slate-600">*/}
              {/*            {*/}
              {/*                paymentMethods.map((method) => (*/}
              {/*                    <SelectItem*/}
              {/*                        key={method._id}*/}
              {/*                        value={method._id}*/}
              {/*                        className="text-white hover:bg-slate-700"*/}
              {/*                    >*/}
              {/*                        {method.name}*/}
              {/*                    </SelectItem>*/}
              {/*                ))*/}
              {/*            }*/}
              {/*        </SelectContent>*/}
              {/*    </Select>*/}
              {/*</div>*/}

              <div className="space-y-4">
                <div className="p-6 bg-slate-800 rounded-lg text-slate-300 text-center">
                  <p className="mb-4">
                    You'll be redirected to our secure payment provider to
                    complete your payment.
                  </p>
                  <p>
                    After completing payment, you'll be automatically returned
                    to your account with your new plan activated.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                  <div className="p-2 bg-blue-800 rounded-full">
                    <Shield className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-200">
                      Secure Payment
                    </h4>
                    <p className="text-sm text-blue-300">
                      Your payment will be processed securely by our payment
                      provider
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-slate-800 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Your payment information is encrypted and secure
                </span>
              </div>

              <Button
                disabled={isUpgrading}
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpgrading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

const plan = [
  {
    id: 1,
    name: "Free",
    price: 0,
    features: [
      "Basic profile creation",
      "Upload up to 5 credentials",
      "Basic CV generator",
      "1 CV download per month",
      "Email support",
    ],
    isCurrentPlan: true,
  },
  {
    id: 2,
    name: "Professional",
    price: 1,
    period: "per month",
    features: [
      "Enhanced profile with portfolio",
      "Unlimited credential uploads",
      "AI-powered CV optimization",
      "Unlimited CV downloads",
      "NFT skill badges",
      "Priority verification",
      "Advanced analytics",
      "Priority support",
    ],
    isCurrentPlan: false,
  },
  {
    id: 3,
    name: "Premium",
    price: 59,
    period: "per month",
    features: [
      "Everything in Professional",
      "Personal brand building tools",
      "Advanced recommendation engine",
      "Multiple CV templates",
      "Interview preparation tools",
      "Career coaching sessions",
      "Premium support",
      "API access",
    ],
    isCurrentPlan: false,
  },
];
