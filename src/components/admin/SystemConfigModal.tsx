import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/api/AxiosInstance";
import { isAxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define types based on backend interfaces
interface IUrls {
  webHomepage: string;
  waitlistPage: string;
}

interface IPoints {
  referral: number;
  signup: number;
  premium: number;
}

// Define subscription plan interface
interface ISubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  description?: string[];
}

interface AppSettings {
  name: string;
  supportEmail: string;
  urls: IUrls;
  points: IPoints;
  subscriptionPlans: ISubscriptionPlan[];
}

interface ISettings {
  app: AppSettings;
}

export function SystemConfigModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [newPlan, setNewPlan] = useState<ISubscriptionPlan>({
    name: "",
    price: 0,
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const { toast } = useToast();

  // Fetch current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/settings");
      console.log("Raw settings response:", response.data);

      // Handle both response formats: {data: {app: {...}}} or {app: {...}}
      // Initialize any missing structures in the settings
      let settingsData;

      if (response.data.data && response.data.data.app) {
        // Format: {success: true, data: {app: {...}}, message: '...'}
        settingsData = response.data.data;
        console.log("Using nested data format");
      } else {
        // Format: {app: {...}}
        settingsData = response.data || {};
        console.log("Using direct data format");
      }

      // Create minimal structure only if app doesn't exist
      if (!settingsData.app) {
        settingsData.app = {
          name: "",
          supportEmail: "",
          subscriptionPlans: [],
          urls: {
            webHomepage: "",
            waitlistPage: "",
          },
          points: {
            referral: 0,
            signup: 0,
            premium: 0,
          },
        };
      }

      // Ensure nested objects exist, but don't set default values
      if (!settingsData.app.urls) {
        settingsData.app.urls = {
          webHomepage: "",
          waitlistPage: "",
        };
      }

      if (!settingsData.app.points) {
        settingsData.app.points = {
          referral: 0,
          signup: 0,
          premium: 0,
        };
      }

      setSettings(settingsData);
      console.log("Current settings:", settingsData);
    } catch (error) {
      console.error("Error fetching settings:", error);

      // Set minimal default structure on error
      setSettings({
        app: {
          name: "",
          supportEmail: "",
          subscriptionPlans: [],
          urls: {
            webHomepage: "",
            waitlistPage: "",
          },
          points: {
            referral: 0,
            signup: 0,
            premium: 0,
          },
        },
      });

      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message || "Failed to load settings"
          : "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!settings) {
        toast({
          title: "Error",
          description: "No settings data available to save",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      // Get current settings first to preserve any data we don't have in our form
      let currentSettings;
      try {
        const response = await axiosInstance.get("/settings");
        // Handle both response formats: {data: {app: {...}}} or {app: {...}}
        currentSettings = response.data.data || response.data;
        console.log("Current settings for save:", currentSettings);
      } catch (error) {
        console.error("Error fetching current settings:", error);
        currentSettings = {};
      }

      // Build payload with form values, not defaults
      const payload = {
        app: {
          // Use form values directly
          name: settings.app.name,
          supportEmail: settings.app.supportEmail,

          // For nested objects, preserve current values but update with form values
          urls: {
            ...(currentSettings?.app?.urls || {}),
            webHomepage: settings.app.urls.webHomepage,
            waitlistPage: settings.app.urls.waitlistPage,
          },

          points: {
            ...(currentSettings?.app?.points || {}),
            referral: settings.app.points.referral,
            signup: settings.app.points.signup,
            premium: settings.app.points.premium,
          },

          // Keep subscription plans intact
          subscriptionPlans:
            settings.app.subscriptionPlans ||
            currentSettings?.app?.subscriptionPlans ||
            [],
        },
      };

      console.log("Saving settings payload:", payload);
      await axiosInstance.patch("/settings", payload);

      toast({
        title: "Success",
        description: "System settings updated successfully",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: isAxiosError(error)
          ? error.response?.data?.message || "Failed to update settings"
          : "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a subscription plan by index
  const handleDeleteSubscriptionPlan = (index: number) => {
    setSettings((prev) => {
      if (!prev) return prev;

      // Create a deep copy to avoid mutation issues
      const updatedSettings = JSON.parse(JSON.stringify(prev)) as ISettings;

      // Filter out the subscription plan at the specified index
      if (updatedSettings.app.subscriptionPlans) {
        updatedSettings.app.subscriptionPlans =
          updatedSettings.app.subscriptionPlans.filter((_, i) => i !== index);
      }

      return updatedSettings;
    });

    // Show confirmation toast
    toast({
      title: "Subscription Plan Removed",
      description:
        "The subscription plan has been removed. Save changes to confirm.",
    });
  };

  // Function to add a feature to the new plan
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    setNewPlan((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  // Function to remove a feature from the new plan
  const handleRemoveFeature = (index: number) => {
    setNewPlan((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Function to add a new subscription plan
  const handleAddSubscriptionPlan = () => {
    if (!newPlan.name) {
      toast({
        title: "Error",
        description: "Plan name is required",
        variant: "destructive",
      });
      return;
    }

    setSettings((prev) => {
      if (!prev) return prev;

      // Create a deep copy
      const updatedSettings = JSON.parse(JSON.stringify(prev)) as ISettings;

      // Initialize the subscriptionPlans array if it doesn't exist
      if (!updatedSettings.app.subscriptionPlans) {
        updatedSettings.app.subscriptionPlans = [];
      }

      // Add the new plan
      updatedSettings.app.subscriptionPlans.push({ ...newPlan });

      return updatedSettings;
    });

    // Reset the form
    setNewPlan({
      name: "",
      price: 0,
      features: [],
    });
    setShowAddPlanForm(false);

    toast({
      title: "Plan Added",
      description:
        "New subscription plan has been added. Save changes to confirm.",
    });
  };

  const handleInputChange = (
    section: keyof ISettings,
    subsection: string,
    value: string | number
  ) => {
    setSettings((prev) => {
      // If prev is null, create a base structure
      if (!prev) {
        const newSettings: ISettings = {
          app: {
            name: "",
            supportEmail: "",
            subscriptionPlans: [],
            urls: {
              webHomepage: "",
              waitlistPage: "",
            },
            points: {
              referral: 0,
              signup: 0,
              premium: 0,
            },
          },
        };

        // Set the value based on the path
        if (subsection.includes(".")) {
          const [nestedSection, nestedProperty] = subsection.split(".");
          if (nestedSection && nestedProperty && section === "app") {
            newSettings.app[nestedSection] = {
              ...newSettings.app[nestedSection],
              [nestedProperty]: value,
            };
          }
        } else {
          if (section === "app") {
            newSettings.app[subsection] = value;
          }
        }

        return newSettings;
      }

      // Create a deep copy to avoid mutation issues
      const updatedSettings = JSON.parse(JSON.stringify(prev)) as ISettings;

      // Make sure app object exists
      if (!updatedSettings.app) {
        updatedSettings.app = {
          name: "",
          supportEmail: "",
          subscriptionPlans: [],
          urls: { webHomepage: "", waitlistPage: "" },
          points: { referral: 0, signup: 0, premium: 0 },
        };
      }

      if (subsection.includes(".")) {
        // Handle nested properties like 'urls.webHomepage'
        const [nestedSection, nestedProperty] = subsection.split(".");

        // Ensure the nested section exists
        if (!updatedSettings[section][nestedSection]) {
          updatedSettings[section][nestedSection] = {};
        }

        updatedSettings[section][nestedSection][nestedProperty] = value;
      } else {
        // Handle direct properties like 'name'
        updatedSettings[section][subsection] = value;
      }

      return updatedSettings;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Manage System Configuration</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Configuration</DialogTitle>
          <DialogDescription>
            Configure core system settings for your application
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-3">Loading settings...</span>
          </div>
        ) : !settings ? (
          <div className="text-center p-6">
            <p>No settings data available. Try refreshing.</p>
            <Button onClick={fetchSettings} variant="outline" className="mt-4">
              Refresh Settings
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Application Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={settings?.app?.name || ""}
                    onChange={(e) =>
                      handleInputChange("app", "name", e.target.value)
                    }
                    placeholder="Application Name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings?.app?.supportEmail || ""}
                    onChange={(e) =>
                      handleInputChange("app", "supportEmail", e.target.value)
                    }
                    placeholder="support@example.com"
                  />
                </div>
              </div>
            </div>

            {/* URLs Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Application URLs</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="web-homepage">Website Homepage</Label>
                  <Input
                    id="web-homepage"
                    value={settings?.app?.urls?.webHomepage || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "app",
                        "urls.webHomepage",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="waitlist-page">Waitlist Page</Label>
                  <Input
                    id="waitlist-page"
                    value={settings?.app?.urls?.waitlistPage || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "app",
                        "urls.waitlistPage",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/waitlist"
                  />
                </div>
              </div>
            </div>

            {/* Points Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reward Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="referral-points">Referral Points</Label>
                  <Input
                    id="referral-points"
                    type="number"
                    value={settings?.app?.points?.referral || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "app",
                        "points.referral",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-points">Signup Points</Label>
                  <Input
                    id="signup-points"
                    type="number"
                    value={settings?.app?.points?.signup || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "app",
                        "points.signup",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="premium-points">Premium Points</Label>
                  <Input
                    id="premium-points"
                    type="number"
                    value={settings?.app?.points?.premium || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "app",
                        "points.premium",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Subscription Plans</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPlanForm(!showAddPlanForm)}
                >
                  {showAddPlanForm ? "Cancel" : "Add Plan"}
                </Button>
              </div>

              {/* Form for adding new subscription plan */}
              {showAddPlanForm && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <h4 className="text-md font-medium mb-3">
                    Add New Subscription Plan
                  </h4>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={newPlan.name}
                        onChange={(e) =>
                          setNewPlan((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Premium Plan"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="plan-price">Price</Label>
                      <Input
                        id="plan-price"
                        type="number"
                        value={newPlan.price}
                        onChange={(e) =>
                          setNewPlan((prev) => ({
                            ...prev,
                            price: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="99.99"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="plan-type">Plan Type</Label>
                      <Select
                        onValueChange={(value) => {
                          // Add a hidden marker feature based on the selected plan type
                          const newFeatures = [...newPlan.features];
                          // Remove any existing markers
                          const filteredFeatures = newFeatures.filter(
                            (f) => f !== "[ORGANIZATION]" && f !== "[TALENT]"
                          );

                          // Add the appropriate marker
                          if (value === "organization") {
                            filteredFeatures.push("[ORGANIZATION]");
                          } else if (value === "talent") {
                            filteredFeatures.push("[TALENT]");
                          }

                          setNewPlan((prev) => ({
                            ...prev,
                            features: filteredFeatures,
                          }));
                        }}
                        defaultValue="both"
                      >
                        <SelectTrigger id="plan-type">
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="organization">
                            Organization Only
                          </SelectItem>
                          <SelectItem value="talent">Talent Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select whether this plan is for organizations, talent,
                        or both.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="plan-features">Features</Label>
                      <div className="flex gap-2">
                        <Input
                          id="plan-features"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Unlimited access"
                          className="flex-1"
                        />
                        <Button onClick={handleAddFeature} type="button">
                          Add
                        </Button>
                      </div>

                      {newPlan.features.length > 0 && (
                        <div className="mt-2">
                          <ul className="space-y-1">
                            {newPlan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded border"
                              >
                                <span>{feature}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(index)}
                                  className="h-7 w-7 p-0"
                                >
                                  ✕
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleAddSubscriptionPlan}
                      className="mt-2"
                    >
                      Save Plan
                    </Button>
                  </div>
                </div>
              )}

              {/* List of existing plans */}
              {settings?.app?.subscriptionPlans &&
              settings.app.subscriptionPlans.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {settings.app.subscriptionPlans.map((plan, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-500">
                            Price: ${plan.price}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSubscriptionPlan(index)}
                          data-testid={`delete-plan-${plan.name.toLowerCase()}`}
                        >
                          Delete
                        </Button>
                      </div>

                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Features:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {plan.features
                              .filter(
                                (feature) =>
                                  !feature.includes("[ORGANIZATION]") &&
                                  !feature.includes("[TALENT]")
                              )
                              .map((feature, featureIndex) => (
                                <li key={featureIndex}>{feature}</li>
                              ))}
                          </ul>

                          {/* Plan type indicator */}
                          <div className="mt-2">
                            {plan.features.some(
                              (f) => f === "[ORGANIZATION]"
                            ) && (
                              <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                                Organization Plan
                              </Badge>
                            )}
                            {plan.features.some((f) => f === "[TALENT]") && (
                              <Badge className="bg-green-100 text-green-800 border border-green-300 ml-2">
                                Talent Plan
                              </Badge>
                            )}
                            {!plan.features.some(
                              (f) => f === "[ORGANIZATION]"
                            ) &&
                              !plan.features.some((f) => f === "[TALENT]") && (
                                <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
                                  Universal Plan
                                </Badge>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No subscription plans configured.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
