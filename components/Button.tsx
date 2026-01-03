import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode,
    variant:  "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    textSize?: "sm" | "md" | "lg";         // Controls font size
    radius?: "none" | "sm" | "md" | "lg" | "full"; // Controls border radius
    fullWidth?: boolean;

}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  textSize = "md",
  radius = "md",
  fullWidth = false,
  className = "", // Allow passing extra classes like 'mt-4'
  ...props
}) => {

  // 1. Base Styles (Flexbox, centering, transitions)
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B8FAB]";

  // 2. Variants (Colors)
  const variants = {
    primary: "bg-[#3B8FAB] text-white hover:bg-[#2d7086] shadow-md hover:shadow-lg border border-transparent",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
    outline: "bg-transparent border-2 border-[#3B8FAB] text-[#3B8FAB] hover:bg-blue-50",
    ghost: "bg-transparent text-[#3B8FAB] hover:bg-blue-50",
  };

  // 3. Sizes (Padding)
  const sizes = {
    sm: "px-3 py-1.5",
    md: "px-5 py-2.5",
    lg: "px-8 py-3",
    xl: "px-10 py-4",
  };

  // 4. Text Sizes
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // 5. Border Radius
  const radii = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-xl", // Matches your Doctor Card style
    full: "rounded-full", // Matches your Footer button style
  };

  // Combine all classes
  const combinedClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${textSizes[textSize]}
    ${radii[radius]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;