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

// Types for payment methods that match the backend
interface PaymentMethod {
  _id?: string;
  name: string; // Must be one of PaymentProvidersEnum values
  description?: string | string[]; // Can be a string or array of strings
  fee?: number;
  active: boolean;
  imageUrl?: string;
  isDeleted?: boolean;
}

// PaymentProvidersEnum should match the backend
enum PaymentProvidersEnum {
  PAYSTACK = "paystack",
  FLUTTERWAVE = "flutterwave",
  VPAY = "vpay",
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
    amount: "$0",
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
    amount: "$29",
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
    amount: "$59",
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
  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    name: string;
    description: string[];
    fee?: number;
    active?: boolean;
  }>({
    name: "",
    description: [""],
    fee: 0,
    active: false,
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

  // Fetch payment methods from the backend
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, paymentMethods: true }));
      const response = await axiosInstance.get("/payment/admin");
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message || "Failed to load payment methods"
          : "Failed to load payment methods",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  // Fetch subscription plans from the backend
  const fetchSubscriptionPlans = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, subscriptionPlans: true }));
      const response = await axiosInstance.get("/settings");
      if (
        response.data &&
        response.data.app &&
        response.data.app.subscriptionPlans
      ) {
        // Transform subscription plans to match our UI format
        const plans = response.data.app.subscriptionPlans.map((plan: any) => ({
          ...plan,
          id: plan.name, // Use name as ID since backend doesn't have IDs for plans
          amount: `$${plan.price}`, // Format price for UI
        }));
        setSubscriptionPlans(plans);
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
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
        const currentSettings = settingsResponse.data;

        // Format the updated plan
        const updatedPlanData = {
          name: editingPlan.name,
          price: parseFloat(editingPlan.amount.replace(/[^0-9.]/g, "")),
          features: editPlanDescriptionItems.filter(
            (item) => item.trim() !== ""
          ),
        };

        // Update the plan in the existing plans array
        const updatedPlans = currentSettings.app.subscriptionPlans.map(
          (plan: any) =>
            plan.name === updatedPlanData.name ? updatedPlanData : plan
        );

        // Update settings with updated plans
        await axiosInstance.patch("/settings", {
          app: {
            ...currentSettings.app,
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
        const currentSettings = settingsResponse.data;

        // Format the new plan
        const newPlanData = {
          name: newPlan.name.toUpperCase(),
          price: parseFloat(newPlan.amount.replace(/[^0-9.]/g, "")),
          features: filteredDescription,
        };

        // Add new plan to existing plans
        const updatedPlans = [
          ...currentSettings.app.subscriptionPlans,
          newPlanData,
        ];

        // Update settings with new plans
        await axiosInstance.patch("/settings", {
          app: {
            ...currentSettings.app,
            subscriptionPlans: updatedPlans,
          },
        });

        // Refresh subscription plans list
        fetchSubscriptionPlans();

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
      const currentSettings = settingsResponse.data;

      // Remove plan from existing plans
      const updatedPlans = currentSettings.app.subscriptionPlans.filter(
        (plan: any) => plan.name !== planName
      );

      // Update settings with updated plans
      await axiosInstance.patch("/settings", {
        app: {
          ...currentSettings.app,
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
    if (editingPaymentMethod && editingPaymentMethod._id) {
      try {
        const filteredDescription = editPaymentDescriptionItems.filter(
          (item) => item.trim() !== ""
        );
        const updatedMethod = {
          ...editingPaymentMethod,
          description: filteredDescription.join(", "), // Join as string for backend
        };

        await axiosInstance.patch(
          `/payment/${editingPaymentMethod._id}`,
          updatedMethod
        );

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
    if (newPaymentMethod.name && filteredDescription.length > 0) {
      try {
        // Format payment data for backend
        const paymentData = {
          name: newPaymentMethod.name,
          description: filteredDescription.join(", "), // Join as string for backend
          fee: newPaymentMethod.fee || 0,
          active: newPaymentMethod.active || false,
        };

        await axiosInstance.post("/payment", paymentData);

        // Refresh payment methods list
        fetchPaymentMethods();

        // Reset form and close modal
        setNewPaymentMethod({
          name: "",
          description: [""],
          fee: 0,
          active: false,
        });
        setNewPaymentDescriptionItems([""]);
        setIsAddPaymentModalOpen(false);

        toast({
          title: "Success",
          description: "New payment method added successfully",
        });
      } catch (error) {
        console.error("Error adding payment method:", error);
        toast({
          title: "Error",
          description: isAxiosError(error)
            ? error.response?.data?.message || "Failed to add payment method"
            : "Failed to add payment method",
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

      await axiosInstance.patch(`/payment/${methodId}`, {
        active: !method.active,
      });

      // Refresh payment methods list
      fetchPaymentMethods();

      toast({
        title: "Success",
        description: "Payment method status updated",
      });
    } catch (error) {
      console.error("Error updating payment method status:", error);
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
                      ${plan.price}
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
                              amount: `$${plan.price}`,
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
                    placeholder="e.g. $29 or $0"
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
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Subscription Plan</DialogTitle>
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
                    placeholder="e.g. $29 or $0"
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
                        {method.name.charAt(0).toUpperCase() +
                          method.name.slice(1)}{" "}
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
                      <SelectItem value={PaymentProvidersEnum.PAYSTACK}>
                        PayStack
                      </SelectItem>
                      <SelectItem value={PaymentProvidersEnum.FLUTTERWAVE}>
                        Flutterwave
                      </SelectItem>
                      <SelectItem value={PaymentProvidersEnum.VPAY}>
                        VPay
                      </SelectItem>
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
                        fee: parseFloat(e.target.value) || 0,
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
                  <Button onClick={handleAddPaymentMethod} className="flex-1">
                    Add Method
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddPaymentModalOpen(false)}
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
                      <SelectItem value={PaymentProvidersEnum.PAYSTACK}>
                        PayStack
                      </SelectItem>
                      <SelectItem value={PaymentProvidersEnum.FLUTTERWAVE}>
                        Flutterwave
                      </SelectItem>
                      <SelectItem value={PaymentProvidersEnum.VPAY}>
                        VPay
                      </SelectItem>
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
                        fee: parseFloat(e.target.value) || 0,
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
                  <Button onClick={handleSavePaymentEdit} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditPaymentModalOpen(false)}
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
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <p>System configuration panel coming soon...</p>
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
