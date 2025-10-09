import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Settings2, RefreshCw, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface for organization NFT data
interface OrganizationNFTData {
  id: string;
  name: string;
  plan: string;
  nftCount: number;
  nftLimit: number;
  lastResetDate: string | null;
}

export const NFTManagement = () => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<OrganizationNFTData[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationNFTData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    plan: "",
    nftCount: 0,
  });

  // In a real implementation, this would fetch from the backend
  // Here we're simulating by retrieving from localStorage for all known orgs
  useEffect(() => {
    // This is a mock function that simulates fetching org data
    // In a real implementation, you would fetch from an API
    const fetchOrgData = () => {
      // For demo purposes, create some sample organizations
      // In production, this would come from your backend
      const sampleOrgs: OrganizationNFTData[] = [
        {
          id: "org1",
          name: "Acme Corp",
          plan: localStorage.getItem("org_plan") || "FREE",
          nftCount: Number(localStorage.getItem("org_nft_count")) || 0,
          nftLimit: getPlanLimit(localStorage.getItem("org_plan") || "FREE"),
          lastResetDate: localStorage.getItem("org_last_reset_date"),
        },
        {
          id: "org2",
          name: "TechCorp",
          plan: "BASIC",
          nftCount: 12,
          nftLimit: 20,
          lastResetDate: "2025-08-15",
        },
        {
          id: "org3",
          name: "GlobalTech",
          plan: "PREMIUM",
          nftCount: 38,
          nftLimit: 50,
          lastResetDate: "2025-09-01",
        },
      ];

      setOrganizations(sampleOrgs);
    };

    fetchOrgData();
  }, []);

  // Get plan limit based on plan name
  const getPlanLimit = (plan: string): number => {
    switch (plan) {
      case "BASIC":
        return 20;
      case "PREMIUM":
        return 50;
      case "ENTERPRISE":
        return -1; // Unlimited
      default:
        return 30; // FREE
    }
  };

  // Calculate usage percentage
  const getUsagePercentage = (count: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited plan
    return Math.min(Math.round((count / limit) * 100), 100);
  };

  // Handle selecting an organization to edit
  const handleSelectOrg = (org: OrganizationNFTData) => {
    setSelectedOrg(org);
    setEditValues({
      plan: org.plan,
      nftCount: org.nftCount,
    });
    setIsEditing(true);
  };

  // Handle saving changes to an organization
  const handleSaveChanges = () => {
    if (!selectedOrg) return;

    // Update the local state
    const updatedOrgs = organizations.map((org) => {
      if (org.id === selectedOrg.id) {
        const nftLimit = getPlanLimit(editValues.plan);
        return {
          ...org,
          plan: editValues.plan,
          nftCount: editValues.nftCount,
          nftLimit,
          lastResetDate: new Date().toISOString().split("T")[0],
        };
      }
      return org;
    });

    setOrganizations(updatedOrgs);

    // If this is the current organization in localStorage, update it
    if (selectedOrg.id === "org1") {
      // Assuming org1 is the current org
      localStorage.setItem("org_plan", editValues.plan);
      localStorage.setItem("org_nft_count", editValues.nftCount.toString());
      localStorage.setItem(
        "org_last_reset_date",
        new Date().toISOString().split("T")[0]
      );
    }

    toast({
      title: "Changes saved",
      description: `Updated ${selectedOrg.name}'s NFT settings`,
    });

    setIsEditing(false);
    setSelectedOrg(null);
  };

  // Handle resetting NFT counter for an organization
  const handleResetCounter = (orgId: string) => {
    const updatedOrgs = organizations.map((org) => {
      if (org.id === orgId) {
        return {
          ...org,
          nftCount: 0,
          lastResetDate: new Date().toISOString().split("T")[0],
        };
      }
      return org;
    });

    setOrganizations(updatedOrgs);

    // If this is the current organization in localStorage, update it
    if (orgId === "org1") {
      // Assuming org1 is the current org
      localStorage.setItem("org_nft_count", "0");
      localStorage.setItem(
        "org_last_reset_date",
        new Date().toISOString().split("T")[0]
      );
    }

    toast({
      title: "Counter reset",
      description: `Reset NFT counter for ${
        organizations.find((o) => o.id === orgId)?.name
      }`,
    });
  };

  // Determine progress color based on usage percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">NFT Limits Management</CardTitle>
            <CardDescription>
              Manage organization NFT credential issuance limits
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Admin Control
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organizations Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>NFT Usage</TableHead>
                <TableHead>Last Reset</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => {
                const usagePercentage = getUsagePercentage(
                  org.nftCount,
                  org.nftLimit
                );
                return (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{org.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>
                            {org.nftCount} /{" "}
                            {org.nftLimit === -1 ? "∞" : org.nftLimit}
                          </span>
                          <span>{usagePercentage}%</span>
                        </div>
                        <Progress
                          value={usagePercentage}
                          className="h-2 bg-slate-200"
                        >
                          <div
                            className={`h-full ${getProgressColor(
                              usagePercentage
                            )}`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </Progress>
                      </div>
                    </TableCell>
                    <TableCell>
                      {org.lastResetDate ? org.lastResetDate : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetCounter(org.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectOrg(org)}
                        >
                          <Settings2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Edit Organization NFT Settings */}
          {isEditing && selectedOrg && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  Edit {selectedOrg.name}'s NFT Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="plan">Subscription Plan</Label>
                    <Select
                      value={editValues.plan}
                      onValueChange={(value) =>
                        setEditValues({ ...editValues, plan: value })
                      }
                    >
                      <SelectTrigger id="plan">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">
                          Free Tier (30 NFTs)
                        </SelectItem>
                        <SelectItem value="BASIC">
                          Basic Tier (20 NFTs)
                        </SelectItem>
                        <SelectItem value="PREMIUM">
                          Premium Tier (50 NFTs)
                        </SelectItem>
                        <SelectItem value="ENTERPRISE">
                          Enterprise Tier (Unlimited)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="nftCount">Current NFT Count</Label>
                    <Input
                      id="nftCount"
                      type="number"
                      min="0"
                      value={editValues.nftCount}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          nftCount: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedOrg(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
            <Database className="h-5 w-5 text-blue-500 mr-2" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">About NFT Limits Storage</p>
              <p className="mt-1">
                Currently, NFT limits are stored in the browser's localStorage.
                This means that if a user clears their browser data, the NFT
                counts will be reset. For production use, we recommend
                implementing server-side storage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
