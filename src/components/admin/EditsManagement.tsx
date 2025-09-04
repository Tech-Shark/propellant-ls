import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Edit3,
  Plus,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cardTypes } from "@/utils/constant";

const editButtons = [
  { id: "subscription", label: "Subscription Model", icon: CreditCard },
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
      "Email support"
    ],
    paymentMethod: "VISA"
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
      "Priority support"
    ],
    paymentMethod: "MASTER_CARD"
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
      "API access"
    ],
    paymentMethod: "VERVE"
  }
];

export function EditsManagement() {
  const [selectedEdit, setSelectedEdit] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState(initialSubscriptionPlans);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ 
    name: "", 
    amount: "", 
    description: [""], 
    paymentMethod: "" 
  });
  const [newPlanDescriptionItems, setNewPlanDescriptionItems] = useState([""]);
  const [editPlanDescriptionItems, setEditPlanDescriptionItems] = useState<string[]>([]);
  const { toast } = useToast();

  const scrollLeft = () => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const addNewDescriptionItem = (isEdit = false) => {
    if (isEdit) {
      setEditPlanDescriptionItems(prev => [...prev, ""]);
    } else {
      setNewPlanDescriptionItems(prev => [...prev, ""]);
    }
  };

  const removeDescriptionItem = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditPlanDescriptionItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewPlanDescriptionItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDescriptionItem = (index: number, value: string, isEdit = false) => {
    if (isEdit) {
      setEditPlanDescriptionItems(prev => prev.map((item, i) => i === index ? value : item));
    } else {
      setNewPlanDescriptionItems(prev => prev.map((item, i) => i === index ? value : item));
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan({ ...plan });
    setEditPlanDescriptionItems([...plan.description]);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPlan) {
      const updatedPlan = {
        ...editingPlan,
        description: editPlanDescriptionItems.filter(item => item.trim() !== "")
      };
      setSubscriptionPlans(plans => 
        plans.map(plan => 
          plan.id === updatedPlan.id ? updatedPlan : plan
        )
      );
      setIsEditModalOpen(false);
      setEditingPlan(null);
      setEditPlanDescriptionItems([]);
      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
    }
  };

  const handleAddPlan = () => {
    const filteredDescription = newPlanDescriptionItems.filter(item => item.trim() !== "");
    if (newPlan.name && newPlan.amount && filteredDescription.length > 0 && newPlan.paymentMethod) {
      const newId = Math.max(...subscriptionPlans.map(p => p.id)) + 1;
      const planToAdd = {
        ...newPlan,
        description: filteredDescription,
        id: newId
      };
      setSubscriptionPlans(plans => [...plans, planToAdd]);
      setNewPlan({ name: "", amount: "", description: [""], paymentMethod: "" });
      setNewPlanDescriptionItems([""]);
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "New plan added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields including at least one description item",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = (planId: number) => {
    setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
    toast({
      title: "Success",
      description: "Plan deleted successfully",
    });
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
                <TableHead>Payment Method</TableHead>
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
                  <TableCell>
                    <Badge variant="outline">
                      {cardTypes.find(type => type.value === plan.paymentMethod)?.name || plan.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {plan.description.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {plan.description.length > 3 && (
                        <li className="text-xs italic">
                          +{plan.description.length - 3} more features...
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
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePlan(plan.id)}
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
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-amount">Amount</Label>
                  <Input
                    id="plan-amount"
                    value={newPlan.amount}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. $29 or $0"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-payment-method">Payment Method</Label>
                  <Select value={newPlan.paymentMethod} onValueChange={(value) => setNewPlan(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map((cardType) => (
                        <SelectItem key={cardType.id} value={cardType.value}>
                          {cardType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          onChange={(e) => updateDescriptionItem(index, e.target.value, false)}
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
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
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
                    onChange={(e) => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-plan-amount">Amount</Label>
                  <Input
                    id="edit-plan-amount"
                    value={editingPlan.amount}
                    onChange={(e) => setEditingPlan(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. $29 or $0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-plan-payment-method">Payment Method</Label>
                  <Select value={editingPlan.paymentMethod} onValueChange={(value) => setEditingPlan(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map((cardType) => (
                        <SelectItem key={cardType.id} value={cardType.value}>
                          {cardType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          onChange={(e) => updateDescriptionItem(index, e.target.value, true)}
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
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
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
              
              <div className="overflow-hidden flex-1 relative">
                <div 
                  className="scroll-container flex gap-3 overflow-x-auto scrollbar-hide"
                  style={{ 
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory'
                  }}
                >
                  {/* Duplicate buttons for infinite scroll effect */}
                  {[...editButtons, ...editButtons].map((button, index) => {
                    const IconComponent = button.icon;
                    const actualId = button.id;
                    return (
                      <Button
                        key={`${button.id}-${index}`}
                        variant={selectedEdit === actualId ? "default" : "outline"}
                        onClick={() => setSelectedEdit(actualId)}
                        className="flex-shrink-0 whitespace-nowrap"
                        style={{ scrollSnapAlign: 'start' }}
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