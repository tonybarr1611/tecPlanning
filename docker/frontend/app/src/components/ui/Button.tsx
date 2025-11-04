import React from "react";
import { cn } from "../../shared/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variantMap: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "border border-gray-300 hover:bg-gray-50 text-gray-800",
  ghost: "text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizeMap: Record<Size, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  block,
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-md transition-colors inline-flex items-center justify-center gap-2",
        variantMap[variant],
        sizeMap[size],
        block && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
