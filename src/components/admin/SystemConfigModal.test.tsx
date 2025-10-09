import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SystemConfigModal } from "./SystemConfigModal";
import axiosInstance from "@/api/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import { AxiosResponse } from "axios";

// Mock axios instance
vi.mock("@/api/AxiosInstance", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock the useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("SystemConfigModal", () => {
  const mockToast = {
    toast: vi.fn(),
  };

  const mockSettings = {
    app: {
      name: "Propellant HR",
      supportEmail: "support@propellanthr.com",
      subscriptionPlans: [
        {
          id: "plan1",
          name: "FREE",
          price: 0,
          features: ["Feature 1", "Feature 2"],
        },
      ],
      urls: {
        webHomepage: "https://propellanthr.com",
        waitlistPage: "https://propellanthr.com/waitlist",
      },
      points: {
        referral: 1,
        signup: 3,
        premium: 5,
      },
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Cast the mocked functions to the appropriate mock types
    (axiosInstance.get as any).mockResolvedValue({ data: mockSettings });
    (axiosInstance.patch as any).mockResolvedValue({});
  });

  it("renders the button correctly", () => {
    render(<SystemConfigModal />);
    expect(screen.getByText("Manage System Configuration")).toBeInTheDocument();
  });

  it("fetches settings when opened and displays them correctly", async () => {
    render(<SystemConfigModal />);

    // Open the modal
    fireEvent.click(screen.getByText("Manage System Configuration"));

    // Wait for the settings to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/settings");
    });

    // Verify settings are displayed
    await waitFor(() => {
      expect(screen.getByLabelText("Application Name")).toHaveValue(
        "Propellant HR"
      );
      expect(screen.getByLabelText("Support Email")).toHaveValue(
        "support@propellanthr.com"
      );
      expect(screen.getByLabelText("Website Homepage")).toHaveValue(
        "https://propellanthr.com"
      );
      expect(screen.getByLabelText("Waitlist Page")).toHaveValue(
        "https://propellanthr.com/waitlist"
      );
      expect(screen.getByLabelText("Referral Points")).toHaveValue("1");
      expect(screen.getByLabelText("Signup Points")).toHaveValue("3");
      expect(screen.getByLabelText("Premium Points")).toHaveValue("5");
    });
  });

  it("updates settings when save button is clicked", async () => {
    render(<SystemConfigModal />);

    // Open the modal
    fireEvent.click(screen.getByText("Manage System Configuration"));

    // Wait for the settings to load
    await waitFor(() => {
      expect(screen.getByLabelText("Application Name")).toBeInTheDocument();
    });

    // Update a field
    fireEvent.change(screen.getByLabelText("Application Name"), {
      target: { value: "New App Name" },
    });

    // Click save
    fireEvent.click(screen.getByText("Save Settings"));

    // Verify API was called correctly
    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith("/settings", {
        app: {
          name: "New App Name",
          supportEmail: "support@propellanthr.com",
          urls: {
            webHomepage: "https://propellanthr.com",
            waitlistPage: "https://propellanthr.com/waitlist",
          },
          points: {
            referral: 1,
            signup: 3,
            premium: 5,
          },
          subscriptionPlans: mockSettings.app.subscriptionPlans,
        },
      });
    });

    // Verify toast was shown
    expect(mockToast.toast).toHaveBeenCalledWith({
      title: "Success",
      description: "System settings updated successfully",
    });
  });

  it("shows error toast when API fails", async () => {
    const error: any = new Error("API Error");
    error.response = { data: { message: "Failed to update settings" } };
    (axiosInstance.patch as any).mockRejectedValue(error);

    render(<SystemConfigModal />);

    // Open the modal
    fireEvent.click(screen.getByText("Manage System Configuration"));

    // Wait for the settings to load
    await waitFor(() => {
      expect(screen.getByLabelText("Application Name")).toBeInTheDocument();
    });

    // Click save
    fireEvent.click(screen.getByText("Save Settings"));

    // Verify error toast was shown
    await waitFor(() => {
      const toastFn = vi.mocked(useToast().toast);
      expect(toastFn).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    });
  });

  it("allows deleting subscription plans", async () => {
    render(<SystemConfigModal />);

    // Open the modal
    fireEvent.click(screen.getByText("Manage System Configuration"));

    // Wait for the settings to load
    await waitFor(() => {
      expect(screen.getByLabelText("Application Name")).toBeInTheDocument();
    });

    // Find and click delete button for subscription plan
    const deleteButton = await screen.findByTestId("delete-plan-free");
    fireEvent.click(deleteButton);

    // Verify the toast notification was shown
    await waitFor(() => {
      const toastFn = vi.mocked(useToast().toast);
      expect(toastFn).toHaveBeenCalledWith({
        title: "Subscription Plan Removed",
        description:
          "The subscription plan has been removed. Save changes to confirm.",
      });
    });

    // Click save settings button
    fireEvent.click(screen.getByText("Save Settings"));

    // Verify API was called with updated subscription plans (empty array)
    await waitFor(() => {
      expect(axiosInstance.patch as any).toHaveBeenCalled();
      const calls = (axiosInstance.patch as any).mock.calls;
      const lastCallData = calls[calls.length - 1][1];
      expect(lastCallData.app.subscriptionPlans).toEqual([]);
    });
  });
});
