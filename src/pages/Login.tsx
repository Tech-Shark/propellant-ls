import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {UserRole} from '@/types/user';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Zap, Users, Building2, Shield, ArrowLeft} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {Label} from "@/components/ui/label"
import {useOTPContext} from "@/context/OTPContext.tsx";
import {toast} from "sonner";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import PhoneInputComponent from "@/components/PhoneInputComponent.tsx";

const Login = () => {
    const navigate = useNavigate();

    const {email, setEmail} = useOTPContext();

    const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('TALENT');
    const [isSignUp, setIsSignUp] = useState(false);
    const {login, register, isLoading} = useAuth();

    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

    const googleLogin = async () => {
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        console.log('email:', email);

        setIsLoadingGoogle(true);

        const promise = axiosInstance.post('/auth/google', {email});

        toast.promise(promise, {
            loading: 'Loading...',
            success: (response) => {
                return response?.data.message;
            },
            error: (error) => {
                if (axios.isAxiosError(error)) {
                    console.log(error)
                    return error.response?.data.message;
                } else {
                    return "Something went wrong. Please try again later.";
                }
            },
            finally: () => {
                setIsLoadingGoogle(false);
            }
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('email:', email, 'password:', password, 'role:', role.toUpperCase() as UserRole);

        const formatedPhoneNumber = phone.startsWith("0")
            ? phone.replace(/^0/, "+")
            : "+" + phone;
        console.log('phone:', formatedPhoneNumber);

        try {
            if (isSignUp) {
                const status = await register(formatedPhoneNumber, email, password, termsAndConditionsAccepted, role.toUpperCase() as UserRole);

                if (status) {
                    setIsSignUp(false);
                }
            } else {
                const {status} = await login(email, password, role);

                if (status) {
                    navigate(`/${role.toLowerCase()}`);
                }
            }
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const getRoleIcon = (selectedRole: UserRole) => {
        switch (selectedRole) {
            case 'TALENT':
                return <Users className="w-5 h-5 text-blue-400"/>;
            case 'ORGANIZATION':
                return <Building2 className="w-5 h-5 text-emerald-400"/>;
            case 'ADMIN':
                return <Shield className="w-5 h-5 text-orange-400"/>;
            default:
                return <Users className="w-5 h-5 text-blue-400"/>;
        }
    };

    const getRoleColor = (selectedRole: UserRole) => {
        switch (selectedRole) {
            case 'TALENT':
                return 'border-blue-600 bg-blue-600/10';
            case 'ORGANIZATION':
                return 'border-emerald-600 bg-emerald-600/10';
            case 'ADMIN':
                return 'border-orange-600 bg-orange-600/10';
            default:
                return 'border-blue-600 bg-blue-600/10';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10"/>

            <div className="w-full max-w-md relative">
                <Link to="/"
                      className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4"/>
                    Back to Home
                </Link>

                <Card className="bg-slate-900 border-slate-700 shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <Zap className="w-7 h-7 text-white"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Propellant</h1>
                        </div>
                        <CardTitle className="text-2xl text-white">
                            {isSignUp ? 'Join Propellant' : 'Welcome Back'}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-lg">
                            {isSignUp ? 'Start your verified career journey' : 'Continue your career journey'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Account Type</label>
                                <Select value={role} onValueChange={(value: UserRole) => setRole(value)} required={true}>
                                    <SelectTrigger
                                        className={`bg-slate-800 border-slate-600 text-white ${getRoleColor(role)}`}>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(role)}
                                            <SelectValue placeholder="Select account type"/>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        <SelectItem value="talent" className="text-white hover:bg-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-blue-400"/>
                                                Talent
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="organization" className="text-white hover:bg-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-emerald-400"/>
                                                Organization
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="admin" className="text-white hover:bg-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-orange-400"/>
                                                Admin
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {
                                isSignUp && (
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-slate-300">Phone</label>
                                        <PhoneInputComponent
                                            onChange={(value) => console.log(value)}
                                            value={phone}
                                        />
                                    </div>
                                )
                            }

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password"
                                       className="text-sm font-medium text-slate-300">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                />
                            </div>

                            {
                                isSignUp && (
                                    <div className="space-y-2 flex items-center gap-2">
                                        <input
                                            type={"checkbox"}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            onChange={() => setTermsAndConditionsAccepted((prev) => !prev)}
                                            checked={termsAndConditionsAccepted && termsAndConditionsAccepted}
                                        />
                                        <Label htmlFor="terms" className="pb-2">Accept terms and conditions</Label>
                                    </div>
                                )
                            }

                            <div className="text-end">
                                <div
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                >
                                    Forgot Password?
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : isSignUp ? 'Create Account' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                {isSignUp
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Sign up"
                                }
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
