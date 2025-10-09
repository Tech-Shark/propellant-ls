import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

// Define plan limits for NFTs
const PLAN_NFT_LIMITS = {
  FREE: 30, // Free tier: 30 NFTs
  BASIC: 20, // Basic tier: 20 NFTs
  PREMIUM: 50, // Premium tier: 50 NFTs
  ENTERPRISE: -1, // Enterprise tier: unlimited (-1)
};

interface NFTLimitsContextType {
  nftCount: number;
  nftLimit: number;
  currentPlan: string;
  incrementNFTCount: () => void;
  resetNFTCount: () => void;
  canCreateNFT: boolean;
  remainingNFTs: number;
  usagePercentage: number;
  changePlan: (plan: string) => void;
  lastResetDate: string | null;
}

const NFTLimitsContext = createContext<NFTLimitsContextType | undefined>(
  undefined
);

export const NFTLimitsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nftCount, setNFTCount] = useState<number>(0);
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");
  const [nftLimit, setNFTLimit] = useState<number>(PLAN_NFT_LIMITS.FREE);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);

  // Check if a month has passed since the last reset
  const shouldResetMonthly = () => {
    const lastReset = localStorage.getItem("org_last_reset_date");
    if (!lastReset) return false;

    const lastResetDate = new Date(lastReset);
    const currentDate = new Date();

    // Check if it's a different month or year
    const monthDiff =
      currentDate.getMonth() -
      lastResetDate.getMonth() +
      12 * (currentDate.getFullYear() - lastResetDate.getFullYear());

    return monthDiff >= 1;
  };

  // Get user from auth context
  const { user } = useAuth();

  // Load stored values from localStorage on component mount
  useEffect(() => {
    const storedNFTCount = localStorage.getItem("org_nft_count");
    // Try to get plan from user object first, fallback to localStorage
    const userPlan = user?.plan;
    const storedPlan = userPlan || localStorage.getItem("org_plan");
    const storedLastResetDate = localStorage.getItem("org_last_reset_date");

    // Set the last reset date
    if (storedLastResetDate) {
      setLastResetDate(storedLastResetDate);
    } else {
      // If there's no last reset date, set it to today
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("org_last_reset_date", today);
      setLastResetDate(today);
    }

    // Check if we need to do a monthly reset
    if (shouldResetMonthly()) {
      // Reset the counter if a month has passed
      localStorage.setItem("org_nft_count", "0");
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("org_last_reset_date", today);
      setLastResetDate(today);
      setNFTCount(0);
      console.log("Monthly NFT counter reset performed");
    } else if (storedNFTCount) {
      // Otherwise use the stored count
      setNFTCount(parseInt(storedNFTCount, 10));
    }

    if (storedPlan) {
      setCurrentPlan(storedPlan);
      // Set limit based on the stored plan
      switch (storedPlan) {
        case "BASIC":
          setNFTLimit(PLAN_NFT_LIMITS.BASIC);
          break;
        case "PREMIUM":
          setNFTLimit(PLAN_NFT_LIMITS.PREMIUM);
          break;
        case "ENTERPRISE":
          setNFTLimit(PLAN_NFT_LIMITS.ENTERPRISE);
          break;
        default:
          setNFTLimit(PLAN_NFT_LIMITS.FREE);
      }
    }
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("org_nft_count", nftCount.toString());
    localStorage.setItem("org_plan", currentPlan);
  }, [nftCount, currentPlan]);

  // Update plan when user changes
  useEffect(() => {
    if (user?.plan && user.plan !== currentPlan) {
      console.log("Updating NFT limits based on user plan:", user.plan);
      changePlan(user.plan);
    }
  }, [user?.plan]);

  // Calculate if more NFTs can be created
  const canCreateNFT = nftLimit === -1 || nftCount < nftLimit;

  // Calculate remaining NFTs
  const remainingNFTs = nftLimit === -1 ? -1 : nftLimit - nftCount;

  // Calculate usage percentage
  const usagePercentage =
    nftLimit === -1
      ? 0
      : Math.min(Math.round((nftCount / nftLimit) * 100), 100);

  // Function to increment NFT count
  const incrementNFTCount = () => {
    setNFTCount((prevCount) => prevCount + 1);
  };

  // Function to reset NFT count
  const resetNFTCount = () => {
    setNFTCount(0);
    // Update the last reset date
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("org_last_reset_date", today);
    setLastResetDate(today);
  };

  // Function to change plan
  const changePlan = (plan: string) => {
    setCurrentPlan(plan);

    // Update the NFT limit based on the new plan
    switch (plan) {
      case "BASIC":
        setNFTLimit(PLAN_NFT_LIMITS.BASIC);
        break;
      case "PREMIUM":
        setNFTLimit(PLAN_NFT_LIMITS.PREMIUM);
        break;
      case "ENTERPRISE":
        setNFTLimit(PLAN_NFT_LIMITS.ENTERPRISE);
        break;
      default:
        setNFTLimit(PLAN_NFT_LIMITS.FREE);
    }
  };

  return (
    <NFTLimitsContext.Provider
      value={{
        nftCount,
        nftLimit,
        currentPlan,
        incrementNFTCount,
        resetNFTCount,
        canCreateNFT,
        remainingNFTs,
        usagePercentage,
        changePlan,
        lastResetDate,
      }}
    >
      {children}
    </NFTLimitsContext.Provider>
  );
};

// Custom hook for using the NFT limits context
export const useNFTLimits = () => {
  const context = useContext(NFTLimitsContext);
  if (context === undefined) {
    throw new Error("useNFTLimits must be used within an NFTLimitsProvider");
  }
  return context;
};
