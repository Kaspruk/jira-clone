import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { LuLoader } from "react-icons/lu";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-netural-300 border border-neutral-200 shadow-sm relative",
  {
    variants: {
      variant: {
        primary: "disabled:text-zinc-500 bg-gradient-to-b from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-700 hover:to-blue-700",
        destructive: "bg-gradient-to-b from-destructive to-destructive text-destructive-foreground hover:from-destructive hover:to-destructive",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-white text-black hover:bg-neutral-100",
        ghost: "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
        muted: "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80",
        teritary: "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none",
        red: "bg-red-100 text-red-600 border-transparent hover:bg-red-200 shadow-none"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-8 w-8",
        iconSm: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

const loaderVariants = cva(
  "fill-current animate-spin",
  {
    variants: {
      size: {
        default: "text-base",
        sm: "text-sm",
        xs: "text-base",
        lg: "text-base",
        icon: "text-sm",
        iconSm: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: React.RefObject<HTMLButtonElement>;
  asChild?: boolean;
  loading?: boolean;
}

const Button = (props: ButtonProps) => {
  const { ref, className, variant, size, asChild = false, loading, children, ...restProps } = props;

  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      {...restProps}
    >
      <span
        className={cn(
          'absolute transition-opacity opacity-100 pointer-events-none duration-150', 
          loading ? 'animate-bubble' : 'opacity-0'
        )}
      >
        <LuLoader className={loaderVariants({ size })} />
      </span>
      <span
        className={cn(
          'flex items-center gap-2 transition-opacity opacity-100 duration-150', 
          loading && 'opacity-0'
        )}
      >
        {children}
      </span>
    </Comp>
  )
}
Button.displayName = "Button"

export { Button, buttonVariants }
