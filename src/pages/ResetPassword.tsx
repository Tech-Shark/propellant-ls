import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Zap, ArrowLeft, Users, Building2, Shield} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {useOTPContext} from "@/context/OTPContext.tsx";
import {toast} from "sonner";
import React, {useState} from "react";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";

const ResetPassword = () => {
    const navigate = useNavigate();

    const { email } = useOTPContext();

    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = useState({
        email: email,
        code: null,
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const data = {
            ...formData,
            code: Number.parseInt(formData.code)
        };

        setLoading(true);

        try {
            toast.promise(axiosInstance.post('/auth/forgot-password/update', data), {
                loading: 'Loading...',
                success: (response) => {
                    console.log(response?.data);
                    navigate("/login");
                    return response?.data.message;
                },
                error: (error) => {
                    if (axios.isAxiosError(error)) {
                        console.log(error)
                        return error.response?.data.message;
                    }
                    else {
                        return "Something went wrong. Please try again later.";
                    }
                },
            });
        } finally {
            setLoading(false);
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

                <Card className="bg-slate-900 border-slate-700 shadow-2xl min-h-[60vh] flex flex-col space-y-8 justify-between">
                    <CardHeader className="text-center pb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <Zap className="w-7 h-7 text-white"/>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Propellant</h1>
                        </div>
                        <CardTitle className="text-2xl text-white">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-lg">
                            Reset your password
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 h-full">
                        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col justify-between">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300">Code</label>
                                <Input
                                    id="code"
                                    name="code"
                                    type="number"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="Enter your code"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300">New Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300">Confirm Password</label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Continue'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
