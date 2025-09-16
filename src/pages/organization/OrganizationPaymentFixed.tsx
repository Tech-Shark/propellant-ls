import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  Star,
  Download,
  Calendar,
  AlertCircle,
  XCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import { toast } from "sonner";
import { format } from "date-fns";

// Default plans to use as fallback if API fails
// Default organization-specific subscription plans
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
  },
  {
    id: "basic",
    name: "Basic",
    price: 149,
    description: "Perfect for small organizations getting started",
    features: [
      "Up to 10 job posts per month",
      "Basic talent search & matching",
      "Email support",
      "Standard analytics dashboard",
      "Basic candidate management",
      "Single user account",
    ],
    popular: false,
    forOrganization: true,
  },
  {
    id: "intermediate",
    name: "Intermediate",
    price: 299,
    description: "Ideal for growing companies with regular hiring needs",
    features: [
      "Unlimited job posts",
      "Advanced talent search & AI matching",
      "Priority support",
      "Advanced analytics & reporting",
      "Complete candidate management",
      "Up to 5 user accounts",
      "Verified talent pool access",
      "Interview scheduling tools",
    ],
    popular: true,
    forOrganization: true,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 599,
    description: "For large organizations with complex hiring requirements",
    features: [
      "Everything in Intermediate",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Advanced security features",
      "Custom reporting",
      "Unlimited user accounts",
      "API access",
      "Talent pipeline automation",
      "Bulk hiring tools",
    ],
    popular: false,
    forOrganization: true,
  },
];

// Transaction interface based on the backend schema
interface Transaction {
  _id: string;
  user: string | any;
  reference: string;
  type:
    | "SUBSCRIPTION"
    | "ACCOUNT_CREATION"
    | "CREDENTIAL_ISSUANCE"
    | "CREDENTIAL_VERIFICATION"
    | "CREDENTIAL_REVOCATION";
  plan: string;
  description?: string;
  totalAmount: number;
  paymentMethod?: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "CONFIRMED"
    | "FAILED"
    | "Failed";
  errorMessage?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Bill history item interface for UI
interface BillingHistoryItem {
  date: string;
  amount: string;
  status: string;
  invoice: string;
  reference: string;
  description?: string;
  errorMessage?: string;
}

const OrganizationPayment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [plans, setPlans] = useState(defaultPlans);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    []
  );
  const [allTransactions, setAllTransactions] = useState<BillingHistoryItem[]>(
    []
  );
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [selectedTransaction, setSelectedTransaction] =
    useState<BillingHistoryItem | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const transactionsPerPage = 5;

  // Current user subscription info
  interface UserSubscription {
    plan: string;
    status: string;
    nextBillingDate?: string;
    amount?: number;
    createdAt?: string;
    updatedAt?: string;
  }

  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Helper function to get plan info based on subscription
  const getPlanInfo = (plan: string | undefined) => {
    if (!plan || plan === "FREE" || plan === "FREEMIUM") {
      return {
        name: plan === "FREEMIUM" ? "Freemium" : "Free Tier",
        price: 0,
        description: "Basic access with limited features",
        isFree: true,
      };
    }

    // Try to find matching plan in our plans array
    const matchedPlan = plans.find(
      (p) =>
        p.id.toLowerCase() === plan.toLowerCase() ||
        p.name.toLowerCase() === plan.toLowerCase()
    );

    if (matchedPlan) {
      return {
        name: matchedPlan.name,
        price: matchedPlan.price,
        description: matchedPlan.description,
        isFree: false,
      };
    }

    // Return the plan name as-is if we can't match it
    return {
      name: plan,
      price: currentSubscription?.amount || 0,
      description: "Custom plan",
      isFree: false,
    };
  };

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
          // ONLY look for organization-specific plans
          const orgPlans = settingsData.app.subscriptionPlans.filter((plan) => {
            // Strategy 1: Check for organization-specific markers
            if (
              plan.features &&
              Array.isArray(plan.features) &&
              plan.features.some(
                (f) =>
                  f === "[ORGANIZATION]" ||
                  f.includes("Organization") ||
                  f.includes("organization") ||
                  f.includes("ORGANIZATION")
              )
            ) {
              return true;
            }

            // Strategy 2: Check for organization-specific names
            if (plan.name && typeof plan.name === "string") {
              const name = plan.name.toLowerCase();
              if (
                name.includes("organization") ||
                name.includes("business") ||
                name.includes("corporate") ||
                name.includes("company") ||
                name.includes("enterprise")
              ) {
                return true;
              }
            }

            // Strategy 3: Check for organization-specific features
            if (
              plan.features &&
              Array.isArray(plan.features) &&
              plan.features.some(
                (f) =>
                  typeof f === "string" &&
                  (f.includes("job post") ||
                    f.includes("recruitment") ||
                    f.includes("hiring") ||
                    f.includes("candidate") ||
                    f.includes("employer"))
              )
            ) {
              return true;
            }

            return false; // Skip if no organization-specific markers
          });

          // Always use the defaults if no organization plans found
          const plansToUse = orgPlans.length > 0 ? orgPlans : defaultPlans;

          // Transform API subscription plans to match our UI format
          const formattedPlans = plansToUse.map((plan, index) => {
            // Start with a base plan from defaults to ensure we have all fields
            const basePlan =
              defaultPlans[index % defaultPlans.length] || defaultPlans[0];

            // Clean up any markers from the features list that we don't want to show to users
            const cleanedFeatures =
              plan.features && Array.isArray(plan.features)
                ? plan.features.filter(
                    (feature) =>
                      typeof feature === "string" &&
                      !feature.includes("[") &&
                      !feature.includes("]")
                  )
                : basePlan.features;

            return {
              id:
                plan.name && typeof plan.name === "string"
                  ? plan.name.toLowerCase().replace(/\s+/g, "")
                  : `plan-${index}`,
              name:
                plan.name && typeof plan.name === "string"
                  ? plan.name
                  : `Plan ${index + 1}`,
              price: plan.price || basePlan.price,
              description:
                Array.isArray(plan.description) && plan.description.length > 0
                  ? plan.description[0]
                  : typeof plan.description === "string"
                  ? plan.description
                  : basePlan.description,
              features: cleanedFeatures,
              popular: index === 1, // Mark second plan as popular
            };
          });

          // Sort the plans by price (lowest to highest)
          formattedPlans.sort((a, b) => a.price - b.price);

          console.log(
            "Using organization subscription plans (sorted by price):",
            formattedPlans
          );
          setPlans(formattedPlans);
        } else {
          console.log(
            "No subscription plans found in settings, using defaults"
          );
          // Sort default plans by price (lowest to highest)
          const sortedDefaults = [...defaultPlans].sort(
            (a, b) => a.price - b.price
          );
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
        // Sort default plans by price (lowest to highest)
        const sortedDefaults = [...defaultPlans].sort(
          (a, b) => a.price - b.price
        );
        setPlans(sortedDefaults);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    // Fetch current subscription information
    const fetchCurrentSubscription = async () => {
      setIsLoadingSubscription(true);
      try {
        // Try first from user endpoint as it might have subscription info
        const userResponse = await axiosInstance.get("/users");
        console.log("User info:", userResponse.data);

        if (
          userResponse.data &&
          userResponse.data.data &&
          userResponse.data.data.subscription
        ) {
          const subInfo = userResponse.data.data.subscription;
          setCurrentSubscription({
            plan: subInfo.plan || "FREE",
            status: subInfo.status || "ACTIVE",
            nextBillingDate: subInfo.nextBillingDate,
            amount: subInfo.amount || 0,
            createdAt: subInfo.createdAt,
            updatedAt: subInfo.updatedAt,
          });
        } else {
          // Try alternate subscription endpoint if available
          try {
            const subResponse = await axiosInstance.get(
              "/subscriptions/current"
            );
            if (subResponse.data && subResponse.data.data) {
              setCurrentSubscription(subResponse.data.data);
            } else {
              // Set to default free plan if no subscription found
              setCurrentSubscription({
                plan: "FREE",
                status: "ACTIVE",
              });
            }
          } catch (subError) {
            console.log("No specific subscription endpoint available");
            // Set to default free plan
            setCurrentSubscription({
              plan: "FREE",
              status: "ACTIVE",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching current subscription:", error);
        // Set to default free plan on error
        setCurrentSubscription({
          plan: "FREE",
          status: "ACTIVE",
        });
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    // Fetch transaction history for billing history
    const fetchTransactionHistory = async () => {
      setIsLoadingTransactions(true);
      try {
        const response = await axiosInstance.get("/transactions/all");
        console.log("Transaction history:", response.data);

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Format transactions for the billing history UI
          const formattedHistory = response.data.data.map(
            (transaction: Transaction) => {
              // Format the date - handle both string and Date objects
              let dateStr = transaction.approvedAt || transaction.createdAt;
              let formattedDate = "";

              try {
                formattedDate = format(new Date(dateStr), "yyyy-MM-dd");
              } catch (e) {
                formattedDate = dateStr ? dateStr.substring(0, 10) : "N/A";
              }

              // Format amount with currency symbol
              const amount = `$${transaction.totalAmount.toFixed(2)}`;

              // Map transaction status to UI status
              let status = "";
              switch (transaction.status) {
                case "COMPLETED":
                case "CONFIRMED":
                  status = "Paid";
                  break;
                case "PENDING":
                case "PROCESSING":
                  status = "Pending";
                  break;
                case "FAILED":
                case "Failed":
                  status = "Failed";
                  break;
                default:
                  status = transaction.status;
              }

              return {
                date: formattedDate,
                amount: amount,
                status: status,
                invoice: transaction.reference, // Use reference as invoice ID
                reference: transaction.reference,
                description:
                  transaction.description ||
                  `${transaction.type} - ${transaction.plan}`,
                errorMessage: transaction.errorMessage,
              };
            }
          );

          // Sort by date, newest first
          formattedHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setAllTransactions(formattedHistory);

          // Set total pages and transactions count
          setTotalTransactions(formattedHistory.length);
          setTotalPages(
            Math.ceil(formattedHistory.length / transactionsPerPage)
          );

          // Set current page transactions
          const indexOfLastTransaction = currentPage * transactionsPerPage;
          const indexOfFirstTransaction =
            indexOfLastTransaction - transactionsPerPage;
          setBillingHistory(
            formattedHistory.slice(
              indexOfFirstTransaction,
              indexOfLastTransaction
            )
          );
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        toast("Could not load billing history", {
          description: "Please try again later or contact support.",
        });
        // Use empty array if there's an error
        setBillingHistory([]);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchCurrentSubscription();
    fetchSubscriptionPlans();
    fetchTransactionHistory();
  }, []);

  // Handle plan selection and payment
  const handleUpgrade = (planId: string) => {
    // Check if this is the current plan
    if (
      currentSubscription &&
      currentSubscription.plan &&
      currentSubscription.plan.toLowerCase() === planId.toLowerCase()
    ) {
      toast("This is your current plan", {
        description: "You are already subscribed to this plan.",
      });
      return;
    }

    setSelectedPlan(planId);

    // Scroll to payment section
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter transactions by status
  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes

    let filtered;
    if (status === "all") {
      filtered = allTransactions;
    } else {
      filtered = allTransactions.filter((transaction) => {
        if (status === "paid") return transaction.status === "Paid";
        if (status === "pending") return transaction.status === "Pending";
        if (status === "failed") return transaction.status === "Failed";
        return true;
      });
    }

    setTotalTransactions(filtered.length);
    setTotalPages(Math.ceil(filtered.length / transactionsPerPage));

    // Get current page transactions
    const indexOfLastTransaction = 1 * transactionsPerPage;
    const indexOfFirstTransaction =
      indexOfLastTransaction - transactionsPerPage;
    setBillingHistory(
      filtered.slice(indexOfFirstTransaction, indexOfLastTransaction)
    );
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Get filtered transactions first
    let filtered;
    if (statusFilter === "all") {
      filtered = allTransactions;
    } else {
      filtered = allTransactions.filter((transaction) => {
        if (statusFilter === "paid") return transaction.status === "Paid";
        if (statusFilter === "pending") return transaction.status === "Pending";
        if (statusFilter === "failed") return transaction.status === "Failed";
        return true;
      });
    }

    // Get current page transactions
    const indexOfLastTransaction = page * transactionsPerPage;
    const indexOfFirstTransaction =
      indexOfLastTransaction - transactionsPerPage;
    setBillingHistory(
      filtered.slice(indexOfFirstTransaction, indexOfLastTransaction)
    );
  };

  // Handle transaction click to view details
  const handleTransactionClick = (transaction: BillingHistoryItem) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };
  const handlePayment = async () => {
    setIsUpgrading(true);

    try {
      // Send the plan information to the backend
      const response = await axiosInstance.post("/premium", {
        plan: selectedPlan.toUpperCase(),
      });

      // Add detailed logging for debugging
      console.log("Premium API response:", response);
      console.log("Response data type:", typeof response.data);
      console.log("Response data:", response.data);

      // Check if response contains a payment URL in any of the expected formats
      if (
        response.data &&
        typeof response.data === "string" &&
        response.data.startsWith("http")
      ) {
        // Case 1: Direct URL string response
        console.log("Opening payment URL in new window:", response.data);
        window.open(response.data, "_blank");
      }
      // Case 2: URL in data property as string (THIS IS THE ACTUAL FORMAT FROM YOUR SERVER)
      else if (
        response.data &&
        response.data.data &&
        typeof response.data.data === "string" &&
        response.data.data.startsWith("http")
      ) {
        console.log(
          "Opening payment URL from data property in new window:",
          response.data.data
        );
        window.open(response.data.data, "_blank");
      }
      // Case 3: Various other possible formats
      else if (
        response.data?.paymentUrl &&
        response.data.paymentUrl.startsWith("http")
      ) {
        console.log(
          "Opening payment URL from paymentUrl property in new window:",
          response.data.paymentUrl
        );
        window.open(response.data.paymentUrl, "_blank");
      } else if (response.data?.url && response.data.url.startsWith("http")) {
        console.log(
          "Opening URL from url property in new window:",
          response.data.url
        );
        window.open(response.data.url, "_blank");
      } else if (
        response.data?.authorization_url &&
        response.data.authorization_url.startsWith("http")
      ) {
        console.log(
          "Opening authorization_url in new window:",
          response.data.authorization_url
        );
        window.open(response.data.authorization_url, "_blank");
      } else {
        toast("Subscription updated successfully", {
          description: "Your account has been updated with the new plan.",
        });

        // Refresh subscription info to show the new plan
        try {
          setIsLoadingSubscription(true);
          const userResponse = await axiosInstance.get("/users");

          if (
            userResponse.data &&
            userResponse.data.data &&
            userResponse.data.data.subscription
          ) {
            const subInfo = userResponse.data.data.subscription;
            setCurrentSubscription({
              plan: subInfo.plan || selectedPlan,
              status: subInfo.status || "ACTIVE",
              nextBillingDate: subInfo.nextBillingDate,
              amount:
                subInfo.amount ||
                plans.find((p) => p.id === selectedPlan)?.price ||
                0,
              createdAt: subInfo.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (refreshError) {
          console.error("Error refreshing subscription info:", refreshError);
        } finally {
          setIsLoadingSubscription(false);
        }
      }
    } catch (error) {
      console.error("Payment initialization error:", error);

      // Enhanced error logging
      if (isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        // If we have a specific error message from the API, show it
        if (error.response?.data?.message) {
          const errorMessage = error.response.data.message;

          // If it's about already being on this plan, treat as success
          if (errorMessage.includes("already")) {
            toast("Already Subscribed", {
              description: "You are already subscribed to this plan.",
            });
          } else {
            toast("Payment Failed", {
              description: errorMessage,
            });
          }
        } else {
          toast("Payment Failed", {
            description: "Please try again or contact support.",
          });
        }
      } else {
        toast("Payment Failed", {
          description: "Please try again or contact support.",
        });
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  const fetchTransactionHistory = async (
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) {
      event.preventDefault();
    }

    setIsLoadingTransactions(true);
    try {
      const response = await axiosInstance.get("/transactions/all");
      console.log("Transaction history:", response.data);

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // Format transactions for the billing history UI
        const formattedHistory = response.data.data.map(
          (transaction: Transaction) => {
            // Format the date - handle both string and Date objects
            let dateStr = transaction.approvedAt || transaction.createdAt;
            let formattedDate = "";

            try {
              formattedDate = format(new Date(dateStr), "yyyy-MM-dd");
            } catch (e) {
              formattedDate = dateStr ? dateStr.substring(0, 10) : "N/A";
            }

            // Format amount with currency symbol
            const amount = `$${transaction.totalAmount.toFixed(2)}`;

            // Map transaction status to UI status
            let status = "";
            switch (transaction.status) {
              case "COMPLETED":
              case "CONFIRMED":
                status = "Paid";
                break;
              case "PENDING":
              case "PROCESSING":
                status = "Pending";
                break;
              case "FAILED":
              case "Failed":
                status = "Failed";
                break;
              default:
                status = transaction.status;
            }

            return {
              date: formattedDate,
              amount: amount,
              status: status,
              invoice: transaction.reference, // Use reference as invoice ID
              reference: transaction.reference,
              description:
                transaction.description ||
                `${transaction.type} - ${transaction.plan}`,
              errorMessage: transaction.errorMessage,
            };
          }
        );

        // Sort by date, newest first
        formattedHistory.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAllTransactions(formattedHistory);

        // Apply current filters
        let filtered = formattedHistory;
        if (statusFilter !== "all") {
          filtered = formattedHistory.filter((transaction) => {
            if (statusFilter === "paid") return transaction.status === "Paid";
            if (statusFilter === "pending")
              return transaction.status === "Pending";
            if (statusFilter === "failed")
              return transaction.status === "Failed";
            return true;
          });
        }

        // Set total pages and transactions count
        setTotalTransactions(filtered.length);
        setTotalPages(Math.ceil(filtered.length / transactionsPerPage));

        // Set current page transactions
        const indexOfLastTransaction = currentPage * transactionsPerPage;
        const indexOfFirstTransaction =
          indexOfLastTransaction - transactionsPerPage;
        setBillingHistory(
          filtered.slice(indexOfFirstTransaction, indexOfLastTransaction)
        );

        toast("Transaction history refreshed", {
          description: "Latest transaction data has been loaded.",
        });
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast("Could not load billing history", {
        description: "Please try again later or contact support.",
      });
      // Use empty array if there's an error
      setBillingHistory([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        {/* Transaction Details Modal */}
        <Dialog
          open={isTransactionModalOpen}
          onOpenChange={setIsTransactionModalOpen}
        >
          <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Transaction Details
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete information about this transaction
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Transaction ID</div>
                  <div className="font-mono text-slate-300 text-sm">
                    {selectedTransaction.reference}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Date</div>
                  <div className="text-slate-300">
                    {selectedTransaction.date}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Amount</div>
                  <div className="text-slate-300 font-semibold">
                    {selectedTransaction.amount}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Status</div>
                  <Badge
                    variant="outline"
                    className={`${
                      selectedTransaction.status === "Paid"
                        ? "border-emerald-600/30 text-emerald-400"
                        : selectedTransaction.status === "Failed"
                        ? "border-red-600/30 text-red-400"
                        : "border-amber-600/30 text-amber-400"
                    }`}
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>

                {selectedTransaction.description && (
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Description</div>
                    <div className="p-2 bg-slate-800 rounded text-slate-300 text-sm">
                      {selectedTransaction.description}
                    </div>
                  </div>
                )}

                {selectedTransaction.errorMessage && (
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Error Message</div>
                    <div className="p-2 bg-red-900/20 border border-red-900/30 rounded text-red-400 text-sm">
                      {selectedTransaction.errorMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              {selectedTransaction && selectedTransaction.status === "Paid" && (
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              )}
              <Button
                onClick={() => setIsTransactionModalOpen(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-2xl">
                  <Star className="w-5 h-5 text-amber-400" />
                  Current Subscription
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Your active organization subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {isLoadingSubscription ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="w-8 h-8 border-2 border-slate-600 border-t-orange-500 rounded-full animate-spin mr-2"></div>
                    <p className="text-slate-300">
                      Loading subscription info...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-white">
                        Free Tier
                      </h2>

                      <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-600 text-white px-3 py-1 text-sm font-medium">
                          Active
                        </Badge>
                        <span className="text-3xl font-bold text-white">
                          Free
                        </span>
                      </div>

                      {currentSubscription?.createdAt && (
                        <div className="text-sm text-slate-400">
                          Registered since{" "}
                          {format(
                            new Date(currentSubscription.createdAt),
                            "MMMM d, yyyy"
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mt-4 md:mt-0">
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-slate-300 text-sm">
                          Premium plans with advanced features will be available
                          soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Plans */}
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
                <div className="flex justify-center">
                  <Card className="relative bg-slate-900 border-slate-700 max-w-xl w-full">
                    <div className="absolute -top-3 right-3">
                      <Badge className="bg-emerald-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Current Plan
                      </Badge>
                    </div>

                    <CardHeader className="text-center">
                      <CardTitle className="text-white text-xl">
                        Free Tier
                      </CardTitle>
                      <div className="text-3xl font-bold text-white">
                        $0
                        <span className="text-lg font-normal text-slate-400">
                          /month
                        </span>
                      </div>
                      <CardDescription className="text-slate-400">
                        Basic access for organizations getting started
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
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

                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mt-4 text-center">
                        <p className="text-slate-300">
                          Premium plans will be available soon with advanced
                          features for growing organizations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Continue to Payment section - removed */}
            </div>

            {/* Billing History */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Billing History
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Your billing information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-slate-400 mb-2">
                    No billing history available
                  </p>
                  <p className="text-sm text-slate-500">
                    You are currently on the free tier with no payment required.
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
