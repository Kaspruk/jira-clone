import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md transition-all",
  {
    variants: {
      size: {
        default: "h-12 px-3 py-1 text-sm",
        sm: "h-8 px-2 py-1 text-sm",
      },
      variant: {
        default: "border border-input bg-transparent shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        preview: "cursor-pointer hover:bg-gray-100",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)


export type InputProps = React.InputHTMLAttributes<HTMLInputElement>
  & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
)
Input.displayName = "Input"

export { Input }
