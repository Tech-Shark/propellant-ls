import {useState} from 'react';
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {TalentSidebar} from "@/components/TalentSidebar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CreditCard, Check, Star, Shield, Zap} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'Forever',
        features: [
            'Basic profile creation',
            'Upload up to 5 credentials',
            'Basic CV generator',
            '1 CV download per month',
            'Email support'
        ],
        limitations: [
            'Limited verification requests',
            'No priority support',
            'Basic analytics'
        ],
        buttonText: 'Current Plan',
        isCurrentPlan: true
    },
    {
        id: 'professional',
        name: 'Professional',
        price: 29,
        period: 'per month',
        features: [
            'Enhanced profile with portfolio',
            'Unlimited credential uploads',
            'AI-powered CV optimization',
            'Unlimited CV downloads',
            'NFT skill badges',
            'Priority verification',
            'Advanced analytics',
            'Priority support'
        ],
        buttonText: 'Upgrade Now',
        isPopular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 59,
        period: 'per month',
        features: [
            'Everything in Professional',
            'Personal brand building tools',
            'Advanced recommendation engine',
            'Multiple CV templates',
            'Interview preparation tools',
            'Career coaching sessions',
            'Premium support',
            'API access'
        ],
        buttonText: 'Upgrade Now'
    }
];

export default function Payment() {
    const {toast} = useToast();
    const [selectedPlan, setSelectedPlan] = useState('professional');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [billingInfo, setBillingInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: '',
        email: '',
        address: '',
        city: '',
        country: ''
    });

    const handleUpgrade = (planId: string) => {
        setSelectedPlan(planId);
        toast({
            title: "Plan Selected",
            description: `You've selected the ${plans.find(p => p.id === planId)?.name} plan.`,
        });
    };

    const handlePayment = () => {
        toast({
            title: "Payment Processed",
            description: "Your subscription has been activated successfully!",
        });
    };

    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-slate-400 hover:text-white"/>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Subscription & Billing</h1>
                            <p className="text-slate-400">Manage your subscription and payment methods</p>
                        </div>
                    </div>

                    <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                        Free Plan Active
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Current Subscription */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Current Subscription</CardTitle>
                        <CardDescription className="text-slate-400">
                            Your active subscription details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                                <p className="text-slate-400">Active since January 2024</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">$0</p>
                                <p className="text-slate-400">Forever</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Plans */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Upgrade Your Plan</CardTitle>
                        <CardDescription className="text-slate-400">
                            Choose a plan that fits your professional needs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative p-6 rounded-lg border transition-all duration-300 ${
                                        plan.isPopular
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : plan.isCurrentPlan
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-slate-700 bg-slate-800/50'
                                    }`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-blue-600 text-white">
                                                <Star className="w-3 h-3 mr-1"/>
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold text-white">${plan.price}</span>
                                            <span className="text-slate-400 ml-1">/{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-slate-300">
                                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => !plan.isCurrentPlan && handleUpgrade(plan.id)}
                                        disabled={plan.isCurrentPlan}
                                        className={`w-full ${
                                            plan.isPopular
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : plan.isCurrentPlan
                                                    ? 'bg-emerald-600'
                                                    : 'bg-slate-700 hover:bg-slate-600'
                                        } text-white`}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Information */}
                {selectedPlan !== 'free' && (
                    <Card className="bg-slate-900 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-400"/>
                                Payment Information
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Enter your payment details to complete the subscription
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-slate-300">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-2">
                                        <SelectValue placeholder="Select payment method"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        <SelectItem value="card" className="text-white hover:bg-slate-700">Credit/Debit
                                            Card</SelectItem>
                                        <SelectItem value="paypal"
                                                    className="text-white hover:bg-slate-700">PayPal</SelectItem>
                                        <SelectItem value="crypto"
                                                    className="text-white hover:bg-slate-700">Cryptocurrency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-300">Card Number</Label>
                                            <Input
                                                value={billingInfo.cardNumber}
                                                onChange={(e) => setBillingInfo({
                                                    ...billingInfo,
                                                    cardNumber: e.target.value
                                                })}
                                                placeholder="1234 5678 9012 3456"
                                                className="bg-slate-800 border-slate-600 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-300">Cardholder Name</Label>
                                            <Input
                                                value={billingInfo.name}
                                                onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
                                                placeholder="John Doe"
                                                className="bg-slate-800 border-slate-600 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-300">Expiry Date</Label>
                                            <Input
                                                value={billingInfo.expiryDate}
                                                onChange={(e) => setBillingInfo({
                                                    ...billingInfo,
                                                    expiryDate: e.target.value
                                                })}
                                                placeholder="MM/YY"
                                                className="bg-slate-800 border-slate-600 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-300">CVV</Label>
                                            <Input
                                                value={billingInfo.cvv}
                                                onChange={(e) => setBillingInfo({...billingInfo, cvv: e.target.value})}
                                                placeholder="123"
                                                className="bg-slate-800 border-slate-600 text-white mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-300">Email</Label>
                                            <Input
                                                value={billingInfo.email}
                                                onChange={(e) => setBillingInfo({
                                                    ...billingInfo,
                                                    email: e.target.value
                                                })}
                                                placeholder="john@example.com"
                                                className="bg-slate-800 border-slate-600 text-white mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-slate-300">Country</Label>
                                            <Select value={billingInfo.country}
                                                    onValueChange={(value) => setBillingInfo({
                                                        ...billingInfo,
                                                        country: value
                                                    })}>
                                                <SelectTrigger
                                                    className="bg-slate-800 border-slate-600 text-white mt-2">
                                                    <SelectValue placeholder="Select country"/>
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-600">
                                                    <SelectItem value="us" className="text-white hover:bg-slate-700">United
                                                        States</SelectItem>
                                                    <SelectItem value="uk" className="text-white hover:bg-slate-700">United
                                                        Kingdom</SelectItem>
                                                    <SelectItem value="ca"
                                                                className="text-white hover:bg-slate-700">Canada</SelectItem>
                                                    <SelectItem value="au"
                                                                className="text-white hover:bg-slate-700">Australia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2 p-4 bg-slate-800 rounded-lg">
                                <Shield className="w-5 h-5 text-emerald-400"/>
                                <span className="text-sm text-slate-300">
                      Your payment information is encrypted and secure
                    </span>
                            </div>

                            <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                <Zap className="w-4 h-4 mr-2"/>
                                Complete Payment
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
