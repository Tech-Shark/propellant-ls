// Logo component for consistent branding across the app
import React from "react";

type LogoProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  // Updated dimensions to match the previous container sizes directly
  const dimensions = {
    xs: { logo: "w-5 h-5" }, // Smaller size for inline use
    sm: { logo: "w-8 h-8" }, // Was container: w-8 h-8, logo: w-5 h-5
    md: { logo: "w-12 h-12" }, // Was container: w-12 h-12, logo: w-7 h-7
    lg: { logo: "w-16 h-16" }, // Was container: w-16 h-16, logo: w-10 h-10
  };

  return (
    // Removed the container div with gradient background, using just the img
    <img
      src="/logo.png"
      alt="Propellant Logo"
      className={`${dimensions[size].logo} ${className}`}
    />
  );
};

export default Logo;
