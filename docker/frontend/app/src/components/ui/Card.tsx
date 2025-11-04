import React from "react";
import { cn } from "../../shared/cn";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("bg-white rounded-lg border border-gray-200", className)}
    {...props}
  />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("px-4 py-3 border-b border-gray-200 bg-gray-50", className)}
    {...props}
  />
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("p-4", className)} {...props} />;

export default Card;
