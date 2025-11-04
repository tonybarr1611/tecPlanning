import React from "react";
import { cn } from "../../shared/cn";

type Tone = "default" | "info" | "success" | "warning" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  default: "bg-gray-900 text-white",
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  muted: "bg-gray-100 text-gray-800",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  tone = "default",
  ...props
}) => (
  <span
    className={cn(
      "text-xs px-2 py-0.5 rounded font-medium",
      toneClass[tone],
      className
    )}
    {...props}
  />
);

export default Badge;
