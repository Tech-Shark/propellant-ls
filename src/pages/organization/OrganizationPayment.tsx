
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Check, Star, Download, Calendar, DollarSign } from "lucide-react";

const OrganizationPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 49,
      description: "Perfect for small organizations getting started",
      features: [
        "Up to 5 job posts per month",
        "Basic talent search",
        "Email support",
        "Standard analytics",
        "Basic messaging"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: 99,
      description: "Ideal for growing companies with regular hiring needs",
      features: [
        "Unlimited job posts",
        "Advanced talent search & filters",
        "Priority support",
        "Advanced analytics & reporting",
        "Unlimited messaging",
        "Verified talent pool access",
        "AI-powered matching"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      description: "For large organizations with complex hiring requirements",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "Advanced security features",
        "Custom reporting",
        "API access"
      ],
      popular: false
    }
  ];

  const billingHistory = [
    { date: "2024-01-01", amount: "$99.00", status: "Paid", invoice: "INV-2024-001" },
    { date: "2023-12-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-012" },
    { date: "2023-11-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-011" },
    { date: "2023-10-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-010" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
                  <p className="text-slate-400">Manage your subscription and payment methods</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Current Plan */}
            <Card className="bg-gradient-to-r from-orange-600/20 to-emerald-600/20 border-orange-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Current Plan: Professional
                    </h2>
                    <p className="text-slate-300 mb-4">
                      Your subscription renews on January 15, 2024
                    </p>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-emerald-600 text-white">Active</Badge>
                      <span className="text-2xl font-bold text-white">$99/month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white mb-2">
                      Manage Subscription
                    </Button>
                    <p className="text-sm text-slate-400">Next billing: $99.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative bg-slate-900 border-slate-700 ${
                      plan.popular ? 'border-orange-500 shadow-lg shadow-orange-500/20' : ''
                    } ${selectedPlan === plan.id ? 'ring-2 ring-orange-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-orange-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-white">
                        ${plan.price}
                        <span className="text-lg font-normal text-slate-400">/month</span>
                      </div>
                      <CardDescription className="text-slate-400">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full ${
                          selectedPlan === plan.id 
                            ? 'bg-orange-600 hover:bg-orange-700' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        } text-white`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-slate-400">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                    Default
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate" className="text-white">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">CVV</Label>
                    <Input id="cvv" placeholder="123" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="nameOnCard" className="text-white">Name on Card</Label>
                    <Input id="nameOnCard" placeholder="John Doe" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Billing History
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your recent payments and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingHistory.map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{bill.amount}</p>
                          <p className="text-sm text-slate-400">{bill.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                          {bill.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
