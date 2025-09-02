import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  CreditCard, 
  Users, 
  FileText,
  Edit3
} from "lucide-react";

const editButtons = [
  { id: "subscription", label: "Subscription Model", icon: CreditCard },
  { id: "users", label: "User Settings", icon: Users },
  { id: "content", label: "Content Management", icon: FileText },
  { id: "system", label: "System Config", icon: Settings },
];

// Mock subscription plans data
const subscriptionPlans = [
  {
    id: 1,
    name: "Free",
    amount: "$0",
    description: "Basic profile creation, Upload up to 5 credentials, Basic CV generator, 1 CV download per month, Email support"
  },
  {
    id: 2,
    name: "Professional", 
    amount: "$29",
    description: "Enhanced profile with portfolio, Unlimited credential uploads, AI-powered CV optimization, Unlimited CV downloads, NFT skill badges, Priority verification, Advanced analytics, Priority support"
  },
  {
    id: 3,
    name: "Premium",
    amount: "$59", 
    description: "Everything in Professional, Personal brand building tools, Advanced recommendation engine, Multiple CV templates, Interview preparation tools, Career coaching sessions, Premium support, API access"
  }
];

export function EditsManagement() {
  const [selectedEdit, setSelectedEdit] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const scrollRight = () => {
    setScrollPosition(scrollPosition + 200);
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
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {plan.name}
                      {plan.name === "Free" && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {plan.amount}
                    {plan.name !== "Free" && (
                      <span className="text-xs text-muted-foreground">/month</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      {plan.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add New Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSelectedContent = () => {
    switch (selectedEdit) {
      case "subscription":
        return renderSubscriptionModel();
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
                <p>Select an edit category from the buttons above to get started</p>
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
              
              <div className="overflow-hidden flex-1">
                <div 
                  className="flex gap-3 transition-transform duration-300"
                  style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                  {editButtons.map((button) => {
                    const IconComponent = button.icon;
                    return (
                      <Button
                        key={button.id}
                        variant={selectedEdit === button.id ? "default" : "outline"}
                        onClick={() => setSelectedEdit(button.id)}
                        className="flex-shrink-0 whitespace-nowrap"
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