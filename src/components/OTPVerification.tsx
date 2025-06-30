
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import {useOTPContext} from "@/context/OTPContext.tsx";

const OTPVerification: React.FC = () => {
  const { type, email, url, setIsVisible } = useOTPContext();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 5) {
      toast.error('Please enter a 5-digit code');
      return;
    }

    setIsLoading(true);

    let data = {};

    if (type === "VERIFY_EMAIL") {
      data = { code: Number.parseInt(otp), email }
    } else {
      data = { code: Number.parseInt(otp), type, email }
    }

    try {
      toast.promise(axiosInstance.post(url, data), {
        loading: 'Loading...',
        success: (response) => {
          console.log(response?.data);
          setIsVisible(false);
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
      setIsLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsResending(true);

    try {
      toast.promise(axiosInstance.post('/otp/request', { type, email }), {
        loading: 'Loading...',
        success: (response) => {
          console.log(response?.data);
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
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-900 border-blue-500/50 border-2 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-white text-lg font-medium tracking-wider">
            VERIFICATION
          </CardTitle>
          <p className="text-slate-400 text-sm mt-2">
            A 5 digit code has been sent to your email/phone
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={5}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-3"
            >
              <InputOTPGroup>
                <InputOTPSlot 
                  index={0} 
                  className="w-12 h-12 md:w-14 md:h-14 text-xl font-bold bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20" 
                />
                <InputOTPSlot 
                  index={1} 
                  className="w-12 h-12 md:w-14 md:h-14 text-xl font-bold bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20" 
                />
                <InputOTPSlot 
                  index={2} 
                  className="w-12 h-12 md:w-14 md:h-14 text-xl font-bold bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20" 
                />
                <InputOTPSlot 
                  index={3} 
                  className="w-12 h-12 md:w-14 md:h-14 text-xl font-bold bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20" 
                />
                <InputOTPSlot 
                  index={4} 
                  className="w-12 h-12 md:w-14 md:h-14 text-xl font-bold bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20" 
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 5}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
          >
            {isLoading ? 'Verifying...' : 'VERIFY'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <div className="text-white transition-colors disabled:opacity-50">
              Don't get code?
            </div>
            
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
