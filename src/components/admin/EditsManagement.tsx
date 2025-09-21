import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  CreditCard,
  Users,
  FileText,
  Edit3,
  Plus,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cardTypes } from "@/utils/constant";
import axiosInstance from "@/api/AxiosInstance.ts";
import { isAxiosError } from "axios";
import { SystemConfigModal } from "./SystemConfigModal";

// Types for payment methods that match the backend
interface PaymentMethod {
  _id?: string;
  name: string; // Must be one of PaymentProvidersEnum values
  description?: string | string[]; // Can be a string or array of strings
  fee?: number | string; // Can be either number or string to match backend expectations
  active: boolean | string; // Can be either boolean or string to match backend expectations
  imageUrl?: string;
  isDeleted?: boolean;
} // PaymentProvidersEnum should match the backend
enum PaymentProvidersEnum {
  paystack = "paystack",
  flutterwave = "flutterwave",
  vpay = "vpay",
}

// Types for subscription plans
interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

const editButtons = [
  { id: "subscription", label: "Subscription Model", icon: CreditCard },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "users", label: "User Settings", icon: Users },
  { id: "content", label: "Content Management", icon: FileText },
  { id: "system", label: "System Config", icon: Settings },
];

// Mock subscription plans data with list-based descriptions
const initialSubscriptionPlans = [
  {
    id: 1,
    name: "Free",
    amount: "₦0",
    description: [
      "Basic profile creation",
      "Upload up to 5 credentials",
      "Basic CV generator",
      "1 CV download per month",
      "Email support",
    ],
  },
  {
    id: 2,
    name: "Professional",
    amount: "₦29",
    description: [
      "Enhanced profile with portfolio",
      "Unlimited credential uploads",
      "AI-powered CV optimization",
      "Unlimited CV downloads",
      "NFT skill badges",
      "Priority verification",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    id: 3,
    name: "Premium",
    amount: "₦59",
    description: [
      "Everything in Professional",
      "Personal brand building tools",
      "Advanced recommendation engine",
      "Multiple CV templates",
      "Interview preparation tools",
      "Career coaching sessions",
      "Premium support",
      "API access",
    ],
  },
];

// Mock payment methods data
const initialPaymentMethods = [
  {
    id: 1,
    name: "Credit Card",
    description: [
      "Visa, MasterCard, American Express",
      "Secure payment processing",
      "Instant payment confirmation",
    ],
    isActive: true,
  },
  {
    id: 2,
    name: "PayPal",
    description: [
      "PayPal account payments",
      "Buyer protection included",
      "Easy refund process",
    ],
    isActive: false,
  },
  {
    id: 3,
    name: "Stripe",
    description: [
      "Stripe payment gateway",
      "Multiple currency support",
      "Advanced fraud protection",
    ],
    isActive: false,
  },
];

export function EditsManagement() {
  const [selectedEdit, setSelectedEdit] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    amount: "",
    description: [""],
  });
  const [newPlanDescriptionItems, setNewPlanDescriptionItems] = useState([""]);
  const [editPlanDescriptionItems, setEditPlanDescriptionItems] = useState<
    string[]
  >([]);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingPaymentMethod, setEditingPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [debugData, setDebugData] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    name: string;
    description: string[];
    fee?: string | number;
    active?: boolean | string;
  }>({
    name: "",
    description: [""],
    fee: "0", // Initialize as string to match backend expectation
    active: "false", // Initialize as string to match backend expectation
  });
  const [newPaymentDescriptionItems, setNewPaymentDescriptionItems] = useState([
    "",
  ]);
  const [editPaymentDescriptionItems, setEditPaymentDescriptionItems] =
    useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<{
    paymentMethods: boolean;
    subscriptionPlans: boolean;
  }>({
    paymentMethods: false,
    subscriptionPlans: false,
  });

  const { toast } = useToast();

  // Fetch data when the selected edit changes
  useEffect(() => {
    if (selectedEdit === "payment") {
      fetchPaymentMethods();
    } else if (selectedEdit === "subscription") {
      fetchSubscriptionPlans();
    }
  }, [selectedEdit]);

  // Helper function to refresh payment methods with a delay and error handling
  const refreshPaymentMethods = async () => {
    try {
      // Wait a moment to allow backend to process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchPaymentMethods();
    } catch (error) {
      console.error("Error during payment methods refresh:", error);
      // Silently handle refresh errors - the user already sees the success message
      // from the original operation, so we don't want to confuse them with refresh errors
    }
  };

  // Fetch payment methods from the backend
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, paymentMethods: true }));

      // Make a clean request without any query parameters
      const response = await axiosInstance.get("/payment/admin");

      // Log the entire response to understand its structure
      console.log("Payment API response:", response.data);

      if (response.data && response.data.data) {
        // In pagination responses, the actual data might be in data.data
        let methodsArray;

        if (Array.isArray(response.data.data)) {
          methodsArray = response.data.data;
        } else if (
          response.data.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          // Handle nested data structure (pagination response)
          methodsArray = response.data.data.data;
        } else if (response.data.data) {
          // Handle single object response
          methodsArray = [response.data.data];
        } else {
          methodsArray = [];
        }

        console.log("Payment methods extracted:", methodsArray);

        // Filter out any methods without a name and add detailed logging
        const validMethods = methodsArray.filter((method) => {
          if (!method) {
            console.warn("Found undefined payment method", method);
            return false;
          }

          if (!method.name) {
            console.warn("Found payment method without name:", method);
            return false;
          }

          return true;
        });

        if (methodsArray.length !== validMethods.length) {
          console.warn(
            `Found ${
              methodsArray.length - validMethods.length
            } payment methods with missing names`
          );
        }
        setPaymentMethods(validMethods);
      } else {
        // Set empty array if no data received
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);

      // More detailed error logging
      if (isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        // Only show a toast for non-401 errors (401s are handled by the axios interceptor)
        if (error.response?.status !== 401) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message || "Failed to load payment methods",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load payment methods",
          variant: "destructive",
        });
      }

      // Set empty array on error
      setPaymentMethods([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  // Fetch subscription plans from the backend
  const fetchSubscriptionPlans = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, subscriptionPlans: true }));
      const response = await axiosInstance.get("/settings");
      console.log("Settings response for subscription plans:", response.data);

      // Check for the nested structure (data.app) first, then fall back to direct structure (app)
      const appData = response.data.data?.app || response.data.app;

      if (
        appData &&
        appData.subscriptionPlans &&
        appData.subscriptionPlans.length > 0
      ) {
        // Transform subscription plans to match our UI format
        const plans = appData.subscriptionPlans.map((plan: any) => ({
          ...plan,
          id: plan.name, // Use name as ID since backend doesn't have IDs for plans
          amount: `₦${plan.price}`, // Format price for UI using Naira symbol
        }));
        setSubscriptionPlans(plans);
      } else {
        // If no plans found, set empty array
        console.log(
          "No subscription plans found in settings response:",
          response.data
        );
        setSubscriptionPlans([]);
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);

      // Create empty plans array when there's an error
      setSubscriptionPlans([]);

      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message || "Failed to load subscription plans"
          : "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, subscriptionPlans: false }));
    }
  };

  const scrollLeft = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const addNewDescriptionItem = (isEdit = false) => {
    if (isEdit) {
      setEditPlanDescriptionItems((prev) => [...prev, ""]);
    } else {
      setNewPlanDescriptionItems((prev) => [...prev, ""]);
    }
  };

  const removeDescriptionItem = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditPlanDescriptionItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewPlanDescriptionItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateDescriptionItem = (
    index: number,
    value: string,
    isEdit = false
  ) => {
    if (isEdit) {
      setEditPlanDescriptionItems((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    } else {
      setNewPlanDescriptionItems((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    }
  };

  // Payment method description management functions
  const addNewPaymentDescriptionItem = (isEdit = false) => {
    if (isEdit) {
      setEditPaymentDescriptionItems((prev) => [...prev, ""]);
    } else {
      setNewPaymentDescriptionItems((prev) => [...prev, ""]);
    }
  };

  const removePaymentDescriptionItem = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditPaymentDescriptionItems((prev) =>
        prev.filter((_, i) => i !== index)
      );
    } else {
      setNewPaymentDescriptionItems((prev) =>
        prev.filter((_, i) => i !== index)
      );
    }
  };

  const updatePaymentDescriptionItem = (
    index: number,
    value: string,
    isEdit = false
  ) => {
    if (isEdit) {
      setEditPaymentDescriptionItems((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    } else {
      setNewPaymentDescriptionItems((prev) =>
        prev.map((item, i) => (i === index ? value : item))
      );
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan({ ...plan });
    setEditPlanDescriptionItems(plan.features || []);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingPlan) {
      try {
        // Get current settings first
        const settingsResponse = await axiosInstance.get("/settings");
        // Handle both response formats: {data: {app: {...}}} or {app: {...}}
        const currentSettings =
          settingsResponse.data.data || settingsResponse.data;

        // Format the updated plan
        const updatedPlanData = {
          name: editingPlan.name,
          price: parseFloat(editingPlan.amount.replace(/[^0-9.]/g, "")),
          features: editPlanDescriptionItems.filter(
            (item) => item.trim() !== ""
          ),
        };

        // Check if app and subscriptionPlans exist
        if (!currentSettings.app?.subscriptionPlans) {
          throw new Error("No subscription plans found to update");
        }

        // Update the plan in the existing plans array
        const updatedPlans = currentSettings.app.subscriptionPlans.map(
          (plan: any) =>
            plan.name === updatedPlanData.name ? updatedPlanData : plan
        );

        // Ensure all required fields and objects are included
        const defaultUrls = {
          webHomepage: "https://propellanthr.com",
          waitlistPage: "https://propellanthr.com",
        };

        const defaultPoints = {
          referral: 1,
          signup: 3,
          premium: 5,
        };

        // Update settings with updated plans
        await axiosInstance.patch("/settings", {
          app: {
            ...(currentSettings.app || {}), // Use empty object if app doesn't exist
            name: currentSettings.app?.name || "Propellant", // Ensure app name is included
            supportEmail:
              currentSettings.app?.supportEmail || "support@propellanthr.com", // Ensure supportEmail is included
            urls: currentSettings.app?.urls || defaultUrls, // Ensure urls is included
            points: currentSettings.app?.points || defaultPoints, // Ensure points is included
            subscriptionPlans: updatedPlans,
          },
        });

        // Refresh subscription plans list
        fetchSubscriptionPlans();

        setIsEditModalOpen(false);
        setEditingPlan(null);
        setEditPlanDescriptionItems([]);

        toast({
          title: "Success",
          description: "Plan updated successfully",
        });
      } catch (error) {
        console.error("Error updating subscription plan:", error);
        toast({
          title: "Error",
          description: isAxiosError(error)
            ? error.response?.data?.message ||
              "Failed to update subscription plan"
            : "Failed to update subscription plan",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddPlan = async () => {
    const filteredDescription = newPlanDescriptionItems.filter(
      (item) => item.trim() !== ""
    );
    if (newPlan.name && newPlan.amount && filteredDescription.length > 0) {
      try {
        // Get current settings first
        const settingsResponse = await axiosInstance.get("/settings");
        // Handle both response formats: {data: {app: {...}}} or {app: {...}}
        const currentSettings =
          settingsResponse.data.data || settingsResponse.data;

        // Format the new plan
        const newPlanData = {
          name: newPlan.name.toUpperCase(),
          price: parseFloat(newPlan.amount.replace(/[^0-9.]/g, "")),
          features: filteredDescription,
        };

        console.log("Adding new subscription plan:", newPlanData);
        console.log("Current settings structure:", currentSettings);

        // Check if app and subscriptionPlans exist, create if not
        const existingPlans = currentSettings.app?.subscriptionPlans || [];

        // Add new plan to existing plans
        const updatedPlans = [...existingPlans, newPlanData];

        // Ensure all required fields and objects are included
        const defaultUrls = {
          webHomepage: "https://propellanthr.com",
          waitlistPage: "https://propellanthr.com",
        };

        const defaultPoints = {
          referral: 1,
          signup: 3,
          premium: 5,
        };

        const payload = {
          app: {
            ...(currentSettings.app || {}), // Use empty object if app doesn't exist
            name: currentSettings.app?.name || "Propellant HR", // Ensure app name is included
            supportEmail:
              currentSettings.app?.supportEmail || "support@propellanthr.com", // Ensure supportEmail is included
            urls: currentSettings.app?.urls || defaultUrls, // Ensure urls is included
            points: currentSettings.app?.points || defaultPoints, // Ensure points is included
            subscriptionPlans: updatedPlans,
          },
        };

        console.log("Updating settings with payload:", payload);

        // Update settings with new plans
        const updateResponse = await axiosInstance.patch("/settings", payload);
        console.log("Update response:", updateResponse.data);

        // Refresh subscription plans list with a slight delay to ensure data is updated
        setTimeout(() => {
          console.log("Refreshing subscription plans after adding new plan");
          fetchSubscriptionPlans();
        }, 500);

        // Reset form and close modal
        setNewPlan({ name: "", amount: "", description: [""] });
        setNewPlanDescriptionItems([""]);
        setIsAddModalOpen(false);

        toast({
          title: "Success",
          description: "New plan added successfully",
        });
      } catch (error) {
        console.error("Error adding subscription plan:", error);
        toast({
          title: "Error",
          description: isAxiosError(error)
            ? error.response?.data?.message || "Failed to add subscription plan"
            : "Failed to add subscription plan",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description:
          "Please fill in all fields including at least one description item",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planName: string) => {
    try {
      // Get current settings first
      const settingsResponse = await axiosInstance.get("/settings");
      // Handle both response formats: {data: {app: {...}}} or {app: {...}}
      const currentSettings =
        settingsResponse.data.data || settingsResponse.data;

      // Check if app and subscriptionPlans exist
      if (!currentSettings.app?.subscriptionPlans) {
        throw new Error("No subscription plans found to delete");
      }

      // Remove plan from existing plans
      const updatedPlans = currentSettings.app.subscriptionPlans.filter(
        (plan: any) => plan.name !== planName
      );

      // Ensure all required fields and objects are included
      const defaultUrls = {
        webHomepage: "https://propellanthr.com",
        waitlistPage: "https://propellanthr.com",
      };

      const defaultPoints = {
        referral: 1,
        signup: 3,
        premium: 5,
      };

      // Update settings with updated plans
      await axiosInstance.patch("/settings", {
        app: {
          ...(currentSettings.app || {}), // Use empty object if app doesn't exist
          name: currentSettings.app?.name || "Propellant", // Ensure app name is included
          supportEmail:
            currentSettings.app?.supportEmail || "support@propellanthr.com", // Ensure supportEmail is included
          urls: currentSettings.app?.urls || defaultUrls, // Ensure urls is included
          points: currentSettings.app?.points || defaultPoints, // Ensure points is included
          subscriptionPlans: updatedPlans,
        },
      });

      // Refresh subscription plans list
      fetchSubscriptionPlans();

      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message ||
            "Failed to delete subscription plan"
          : "Failed to delete subscription plan",
        variant: "destructive",
      });
    }
  };

  // Payment Methods handlers
  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingPaymentMethod({ ...method });
    // Split description string into array if it's a string from the backend
    const descriptionItems =
      typeof method.description === "string"
        ? method.description.split(",").map((item) => item.trim())
        : method.description || [];
    setEditPaymentDescriptionItems(descriptionItems);
    setIsEditPaymentModalOpen(true);
  };

  const handleSavePaymentEdit = async () => {
    console.log(
      "Save Payment Edit - Current editing method:",
      editingPaymentMethod
    );

    if (editingPaymentMethod && editingPaymentMethod._id) {
      try {
        const filteredDescription = editPaymentDescriptionItems.filter(
          (item) => item.trim() !== ""
        );
        const updatedMethod = {
          name: editingPaymentMethod.name,
          description: filteredDescription.join(", "), // Join as string for backend
          fee: (editingPaymentMethod.fee || 0).toString(), // Send as string to match backend expectation
          active: editingPaymentMethod.active === true ? "true" : "false", // Send as string to match backend expectation
        };

        console.log("Sending updated method to backend:", {
          endpoint: `/payment/${editingPaymentMethod._id}`,
          data: updatedMethod,
        });

        // Add a loading state indicator
        toast({
          title: "Processing",
          description: "Updating payment method...",
        });

        const response = await axiosInstance.patch(
          `/payment/${editingPaymentMethod._id}`,
          updatedMethod
        );

        console.log("Payment method update response:", response.data);

        // Refresh payment methods list
        fetchPaymentMethods();

        setIsEditPaymentModalOpen(false);
        setEditingPaymentMethod(null);
        setEditPaymentDescriptionItems([]);

        toast({
          title: "Success",
          description: "Payment method updated successfully",
        });
      } catch (error) {
        console.error("Error updating payment method:", error);
        // Detailed error logging
        if (isAxiosError(error)) {
          console.error("Axios error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
        toast({
          title: "Error",
          description: isAxiosError(error)
            ? error.response?.data?.message || "Failed to update payment method"
            : "Failed to update payment method",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddPaymentMethod = async () => {
    const filteredDescription = newPaymentDescriptionItems.filter(
      (item) => item.trim() !== ""
    );
    console.log("Add Payment Method - Validation check:", {
      name: newPaymentMethod.name,
      descriptionLength: filteredDescription.length,
    });

    if (newPaymentMethod.name && filteredDescription.length > 0) {
      try {
        // Format payment data for backend - adjust to match DTO requirements
        const paymentData = {
          name: newPaymentMethod.name, // Using the proper enum value
          description: filteredDescription.join(", "), // Join as string for backend
          fee: (newPaymentMethod.fee || 0).toString(), // Send as string to match backend expectation
          active: "true", // Send as string to match backend expectation
        };

        console.log("Sending payment data to backend:", paymentData);

        try {
          // Check if payment method already exists
          const existingMethods = await axiosInstance.get("/payment/admin");

          // Make sure we have data
          if (existingMethods.data?.data) {
            const methodsArray = Array.isArray(existingMethods.data.data)
              ? existingMethods.data.data
              : existingMethods.data.data.data || [];

            const existingMethod = methodsArray.find(
              (method) =>
                method.name.toLowerCase() ===
                newPaymentMethod.name.toLowerCase()
            );

            if (existingMethod) {
              // If it exists, just show a success message
              toast({
                title: "Payment Method Already Exists",
                description: `${newPaymentMethod.name} payment method is already configured.`,
              });

              // Reset form and close modal
              setNewPaymentMethod({
                name: "",
                description: [""],
                fee: "0",
                active: "false",
              });
              setNewPaymentDescriptionItems([""]);
              setIsAddPaymentModalOpen(false);

              // Refresh payment methods to make sure the UI is up to date
              refreshPaymentMethods();
              return;
            }
          }
        } catch (checkError) {
          console.error("Error checking existing payment methods:", checkError);
          // Continue with adding payment method anyway
        }

        // Add a loading state indicator
        toast({
          title: "Processing",
          description: "Adding payment method...",
        });

        const response = await axiosInstance.post("/payment", paymentData);
        console.log("Payment method add response:", response.data);

        // Show success message
        toast({
          title: "Success",
          description: `${newPaymentMethod.name} payment method added successfully!`,
          variant: "default",
        });

        // Refresh payment methods list
        await refreshPaymentMethods();

        // Reset form and close modal
        setNewPaymentMethod({
          name: "",
          description: [""],
          fee: "0",
          active: "false",
        });
        setNewPaymentDescriptionItems([""]);
        setIsAddPaymentModalOpen(false);
      } catch (error) {
        console.error("Error adding payment method:", error);
        // Detailed error logging
        if (isAxiosError(error)) {
          console.error("Axios error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          });
        }
        // Improved error message handling
        let errorMessage = "Failed to add payment method";

        if (isAxiosError(error) && error.response?.data) {
          console.log("Full error response:", error.response.data);

          // Handle different error response formats
          if (typeof error.response.data.message === "string") {
            errorMessage = error.response.data.message;
          } else if (Array.isArray(error.response.data.message)) {
            // Handle validation errors which are typically an array of messages
            errorMessage = error.response.data.message[0] || errorMessage;
          } else if (
            error.response.data.data &&
            error.response.data.data.message
          ) {
            // Handle nested error format
            errorMessage = error.response.data.data.message;
          }

          // Handle specific error cases with user-friendly messages
          if (errorMessage.includes("fee")) {
            errorMessage = "Fee must be a valid number";
          } else if (errorMessage.includes("active")) {
            errorMessage = "Active status must be a valid value (true/false)";
          } else if (errorMessage.includes("already exists")) {
            // If the payment method already exists, we'll treat this as a successful operation
            toast({
              title: "Payment Method Already Configured",
              description: `The ${newPaymentMethod.name} payment method is already set up in the system.`,
              variant: "default",
            });

            // Reset form and close modal
            setNewPaymentMethod({
              name: "",
              description: [""],
              fee: "0",
              active: "false",
            });
            setNewPaymentDescriptionItems([""]);
            setIsAddPaymentModalOpen(false);

            // Refresh payment methods to make sure UI is up to date
            refreshPaymentMethods();

            // Return early since this isn't a real error
            return;
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description:
          "Please fill in all fields including at least one description item",
        variant: "destructive",
      });
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      await axiosInstance.delete(`/payment/${methodId}`);

      // Refresh payment methods list
      fetchPaymentMethods();

      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete payment method"
          : "Failed to delete payment method",
        variant: "destructive",
      });
    }
  };

  const togglePaymentMethodActive = async (methodId: string) => {
    try {
      const method = paymentMethods.find((m) => m._id === methodId);
      if (!method) return;

      // Add loading state
      toast({
        title: "Processing",
        description: "Updating payment method status...",
      });

      console.log("Toggling payment method status:", {
        methodId,
        currentActive: method.active,
        newActive: !method.active,
      });

      await axiosInstance.patch(`/payment/${methodId}`, {
        active: (!method.active).toString(), // Send as string to match backend expectation
      });

      // Refresh payment methods list
      fetchPaymentMethods();

      toast({
        title: "Success",
        description: "Payment method status updated",
      });
    } catch (error) {
      console.error("Error updating payment method status:", error);
      // Detailed error logging
      if (isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message ||
            "Failed to update payment method status"
          : "Failed to update payment method status",
        variant: "destructive",
      });
    }
  };

  const renderSubscriptionModel = () => (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          Subscription Plans Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading.subscriptionPlans ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span>Loading subscription plans...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : subscriptionPlans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No subscription plans found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptionPlans.map((plan) => (
                  <TableRow key={plan.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {plan.name === "FREE" ? "Free" : plan.name}
                        {plan.name === "FREE" && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₦{plan.price}
                      {plan.name !== "FREE" && (
                        <span className="text-xs text-muted-foreground">
                          /month
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {Array.isArray(plan.features) &&
                          plan.features.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        {Array.isArray(plan.features) &&
                          plan.features.length > 3 && (
                            <li className="text-xs italic">
                              +{plan.features.length - 3} more features...
                            </li>
                          )}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() =>
                            handleEditPlan({
                              ...plan,
                              amount: `₦${plan.price}`,
                            })
                          }
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePlan(plan.name)}
                          disabled={plan.name === "FREE"} // Prevent deleting the Free plan
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Subscription Plan</DialogTitle>
                <DialogDescription>
                  Enter details for the new subscription plan
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={newPlan.name}
                    onChange={(e) =>
                      setNewPlan((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-amount">Amount</Label>
                  <Input
                    id="plan-amount"
                    value={newPlan.amount}
                    onChange={(e) =>
                      setNewPlan((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="e.g. ₦29 or ₦0"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Plan Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addNewDescriptionItem(false)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newPlanDescriptionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updateDescriptionItem(index, e.target.value, false)
                          }
                          placeholder="Enter plan feature"
                          className="flex-1"
                        />
                        {newPlanDescriptionItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDescriptionItem(index, false)}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddPlan} className="flex-1">
                    Add Plan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Plan Modal */}
        {/* Debug Modal */}
        <Dialog open={isDebugModalOpen} onOpenChange={setIsDebugModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Debug Payment Methods Data</DialogTitle>
              <DialogDescription>
                Raw payment methods data for debugging purposes
              </DialogDescription>
            </DialogHeader>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto max-h-[500px]">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsDebugModalOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Subscription Plan</DialogTitle>
              <DialogDescription>
                Modify the details of the existing subscription plan
              </DialogDescription>
            </DialogHeader>
            {editingPlan && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-plan-name">Plan Name</Label>
                  <Input
                    id="edit-plan-name"
                    value={editingPlan.name}
                    onChange={(e) =>
                      setEditingPlan((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-plan-amount">Amount</Label>
                  <Input
                    id="edit-plan-amount"
                    value={editingPlan.amount}
                    onChange={(e) =>
                      setEditingPlan((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="e.g. ₦29 or ₦0"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Plan Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addNewDescriptionItem(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editPlanDescriptionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updateDescriptionItem(index, e.target.value, true)
                          }
                          placeholder="Enter plan feature"
                          className="flex-1"
                        />
                        {editPlanDescriptionItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDescriptionItem(index, true)}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          Payment Methods Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDebugData(paymentMethods);
              setIsDebugModalOpen(true);
            }}
            className="text-xs"
          >
            Debug Payment Methods
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading.paymentMethods ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      <span>Loading payment methods...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !Array.isArray(paymentMethods) ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p>Invalid payment methods data received.</p>
                      <Button
                        onClick={fetchPaymentMethods}
                        variant="outline"
                        size="sm"
                      >
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paymentMethods.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No payment methods found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paymentMethods.map((method) => (
                  <TableRow key={method._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {method.name ? (
                          method.name.charAt(0).toUpperCase() +
                          method.name.slice(1)
                        ) : (
                          <span className="text-orange-500 font-medium">
                            Unknown Method (ID: {method._id || "No ID"})
                          </span>
                        )}{" "}
                        {/* Capitalize first letter */}
                        {method.active && (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-500"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {typeof method.description === "string" ? (
                          // Handle string description from backend
                          method.description.split(",").map((item, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary mt-1">•</span>
                              <span>{item.trim()}</span>
                            </li>
                          ))
                        ) : method.description ? (
                          // Handle array description
                          method.description.map((item, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="italic text-sm">
                            No description provided
                          </li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell>{method.fee || 0}%</TableCell>
                    <TableCell>
                      <Button
                        variant={method.active ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          togglePaymentMethodActive(method._id as string)
                        }
                      >
                        {method.active ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleEditPaymentMethod(method)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-700"
                          onClick={() =>
                            handleDeletePaymentMethod(method._id as string)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Dialog
            open={isAddPaymentModalOpen}
            onOpenChange={setIsAddPaymentModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Payment Method</DialogTitle>
                <DialogDescription>
                  Enter details for the new payment method
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-name">Payment Provider</Label>
                  <Select
                    value={newPaymentMethod.name}
                    onValueChange={(value) =>
                      setNewPaymentMethod((prev) => ({ ...prev, name: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">PayStack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                      <SelectItem value="vpay">VPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment-fee">Transaction Fee (%)</Label>
                  <Input
                    id="payment-fee"
                    type="number"
                    value={newPaymentMethod.fee?.toString() || "0"}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        fee: e.target.value, // Store as string directly
                      }))
                    }
                    placeholder="Enter fee percentage (e.g. 2.5)"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Method Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addNewPaymentDescriptionItem(false)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newPaymentDescriptionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updatePaymentDescriptionItem(
                              index,
                              e.target.value,
                              false
                            )
                          }
                          placeholder="Enter method feature"
                          className="flex-1"
                        />
                        {newPaymentDescriptionItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removePaymentDescriptionItem(index, false)
                            }
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddPaymentMethod();
                    }}
                    className="flex-1"
                  >
                    Add Method
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAddPaymentModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Payment Method Modal */}
        <Dialog
          open={isEditPaymentModalOpen}
          onOpenChange={setIsEditPaymentModalOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
              <DialogDescription>
                Modify the details of the existing payment method
              </DialogDescription>
            </DialogHeader>
            {editingPaymentMethod && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-payment-name">Payment Provider</Label>
                  <Select
                    value={editingPaymentMethod.name}
                    onValueChange={(value) =>
                      setEditingPaymentMethod((prev) => ({
                        ...prev,
                        name: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">PayStack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                      <SelectItem value="vpay">VPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-payment-fee">Transaction Fee (%)</Label>
                  <Input
                    id="edit-payment-fee"
                    type="number"
                    value={editingPaymentMethod.fee?.toString() || "0"}
                    onChange={(e) =>
                      setEditingPaymentMethod((prev) => ({
                        ...prev,
                        fee: e.target.value, // Store as string directly
                      }))
                    }
                    placeholder="Enter fee percentage (e.g. 2.5)"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Method Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addNewPaymentDescriptionItem(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editPaymentDescriptionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updatePaymentDescriptionItem(
                              index,
                              e.target.value,
                              true
                            )
                          }
                          placeholder="Enter method feature"
                          className="flex-1"
                        />
                        {editPaymentDescriptionItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removePaymentDescriptionItem(index, true)
                            }
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSavePaymentEdit();
                    }}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditPaymentModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  const renderSelectedContent = () => {
    switch (selectedEdit) {
      case "subscription":
        return renderSubscriptionModel();
      case "payment":
        return renderPaymentMethods();
      case "users":
        return (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                User Settings Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>User settings management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        );
      case "content":
        return (
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <p>Content management tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        );
      case "system":
        return (
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Manage core application settings including name, support
                  email, URLs, and point values.
                </p>
                <div className="flex flex-col items-center">
                  <SystemConfigModal />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                Platform Edits & Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Edit3 className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p>
                  Select an edit category from the buttons above to get started
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Horizontally scrolling buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Edit Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="overflow-hidden flex-1 relative">
                <div
                  className="scroll-container flex gap-3 overflow-x-auto scrollbar-hide"
                  style={{
                    scrollBehavior: "smooth",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {/* Duplicate buttons for infinite scroll effect */}
                  {[...editButtons, ...editButtons].map((button, index) => {
                    const IconComponent = button.icon;
                    const actualId = button.id;
                    return (
                      <Button
                        key={`${button.id}-${index}`}
                        variant={
                          selectedEdit === actualId ? "default" : "outline"
                        }
                        onClick={() => setSelectedEdit(actualId)}
                        className="flex-shrink-0 whitespace-nowrap"
                        style={{ scrollSnapAlign: "start" }}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {button.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected content */}
      {renderSelectedContent()}
    </div>
  );
}
