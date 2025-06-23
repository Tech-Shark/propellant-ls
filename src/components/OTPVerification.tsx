
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

interface OTPVerificationProps {
  title?: string;
  description?: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  isVisible: boolean;
  onClose?: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  title = "VERIFICATION",
  description = "A 5 digit code has been sent to your email/phone",
  onVerify,
  onResend,
  isVisible,
  onClose
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 5) {
      toast.error('Please enter a 5-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onVerify(otp);
      if (success) {
        toast.success('Verification successful!');
        onClose?.();
      } else {
        toast.error('Invalid code. Please try again.');
        setOtp('');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;
    
    setIsResending(true);
    try {
      await onResend();
      toast.success('Code resent successfully!');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-900 border-blue-500/50 border-2 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-white text-lg font-medium tracking-wider">
            {title}
          </CardTitle>
          <p className="text-slate-400 text-sm mt-2">
            {description}
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
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending...' : "Don't get code?"}
            </button>
            
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
