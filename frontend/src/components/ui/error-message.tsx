import { cn } from "@/lib/utils";
import React from "react";

const ErrorMessage = React.forwardRef<
    HTMLSpanElement,
    React.ParamHTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('text-destructive text-xs leading-none', className)}
    {...props}
  />
))
ErrorMessage.displayName = 'ErrorMessage';

export { ErrorMessage }