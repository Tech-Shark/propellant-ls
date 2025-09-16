import { useEffect, useState } from "react";
import { UserCircle, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface ProfileCompletionAlertProps {
  role: string; // 'TALENT' or 'ORGANIZATION'
}

export function ProfileCompletionAlert({ role }: ProfileCompletionAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check local storage to see if alert was previously dismissed
  useEffect(() => {
    const alertDismissed = localStorage.getItem("profileAlertDismissed");
    if (alertDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  // Function to calculate profile completeness
  const calculateProfileCompleteness = () => {
    if (!user) return 0;

    const talentRequiredFields = [
      "fullname",
      "bio",
      "skills",
      "phone",
      "linkedin",
    ];
    const organizationRequiredFields = [
      "companyName",
      "industry",
      "description",
      "companySize",
    ];

    const fieldsToCheck =
      role === "TALENT" ? talentRequiredFields : organizationRequiredFields;

    let filledFields = 0;
    fieldsToCheck.forEach((field) => {
      if (user[field]) {
        if (Array.isArray(user[field])) {
          if (user[field].length > 0) filledFields++;
        } else if (
          typeof user[field] === "string" &&
          user[field].trim() !== ""
        ) {
          filledFields++;
        } else if (user[field]) {
          filledFields++;
        }
      }
    });

    return Math.round((filledFields / fieldsToCheck.length) * 100);
  };

  const completionPercentage = calculateProfileCompleteness();

  // Don't show if profile is more than 70% complete or has been dismissed
  if (dismissed || completionPercentage > 70) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("profileAlertDismissed", "true");
  };

  const navigateToProfile = () => {
    if (role === "TALENT") {
      navigate("/talent/profile");
    } else {
      navigate("/organization/settings");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-600/30 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="mr-3 mt-0.5">
            <UserCircle className="text-blue-400 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-400 mr-1" />
              Complete your profile to get discovered
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {role === "TALENT"
                ? "Adding your skills and experience will help organizations find you for job opportunities."
                : "Complete your organization profile to attract qualified talent."}
            </p>
            <div className="mt-3 flex space-x-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={navigateToProfile}
              >
                Update Profile
              </Button>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
