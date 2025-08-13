import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-lg border border-border bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        default: "max-sm:h-10 h-12 px-4 py-2 text-base",
        md: "h-10 px-4 py-2 text-base",
        sm: "h-8 px-2 py-1 text-sm",
      },
      variant: {
        simple: "border-none bg-transparent",
        default: "",
        preview: "cursor-pointer border-none bg-transparent hover:bg-muted",
      },
      error: {
        true: "border-destructive bg-destructive/5 focus-visible:ring-destructive focus-visible:border-destructive placeholder:text-destructive",
        false: "",
      }
    },
    defaultVariants: {
      inputSize: "default",
      variant: "default",
    },
  }
)

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>
  & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, type, inputSize, variant, error = false, ...inputProps } = props;

    return (
      <input
        type={type}
        className={cn(inputVariants({
          inputSize,
          error,
          variant,
          className
        }))}
        ref={ref}
        {...inputProps}
      />
    );
  }
)
Input.displayName = "Input"

export { Input }
