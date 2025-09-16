import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/api/AxiosInstance";
import { useToast } from "@/components/ui/use-toast";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "pending" | "failed"
  >("pending");

  // Extract any query parameters if they contain useful information
  const queryParams = new URLSearchParams(location.search);
  // Handle both reference and trxref parameters (Paystack uses both)
  const reference = queryParams.get("reference") || queryParams.get("trxref");

  console.log("Payment success URL parameters:", location.search);
  console.log("Reference extracted:", reference);

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      setIsVerifying(false);
      setVerificationStatus("failed");
      toast({
        title: "Verification Failed",
        description: "No reference found in the URL. Please contact support.",
        variant: "destructive",
      });
    }
  }, [reference]);

  const verifyPayment = async (paymentRef: string) => {
    try {
      setIsVerifying(true);
      // Make API call to verify payment
      const response = await axiosInstance.get(`/payment/verify/${paymentRef}`);

      console.log("Payment verification response:", response.data);

      if (response.data.success) {
        setVerificationStatus("success");
        toast({
          title: "Payment Verified",
          description:
            "Your payment has been verified and your account has been upgraded.",
        });
      } else {
        setVerificationStatus("failed");
        toast({
          title: "Verification Failed",
          description:
            response.data.message ||
            "Failed to verify payment. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setVerificationStatus("failed");
      toast({
        title: "Verification Error",
        description:
          "An error occurred while verifying your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReturnToDashboard = () => {
    // Navigate back to the appropriate dashboard based on user role
    // For now, we'll just go to the talent dashboard
    navigate("/talent");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isVerifying ? (
          <>
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment...
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment.
            </p>
          </>
        ) : verificationStatus === "success" ? (
          <>
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed and verified successfully. Your
              premium features are now activated!
            </p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support with your
              reference number.
            </p>
          </>
        )}

        {reference && (
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Payment Reference:</p>
            <p className="text-gray-700 font-medium">{reference}</p>
          </div>
        )}

        <button
          onClick={handleReturnToDashboard}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          If you have any questions about your payment, please contact our
          support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
