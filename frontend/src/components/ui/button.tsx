import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { LuLoader } from "react-icons/lu";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 border relative disabled:pointer-events-none disabled:opacity-50 gap-2",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90 active:scale-[0.98]",
        outline:
          "bg-background border-border text-foreground shadow-sm hover:bg-muted active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary shadow-sm hover:bg-secondary/80 active:scale-[0.98]",
        ghost:
          "bg-transparent border-transparent text-primary hover:bg-primary/10 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
        muted:
          "bg-muted text-muted-foreground border-muted hover:bg-muted/80 active:scale-[0.98]",
        yellow:
          "bg-yellow text-foreground border-yellow shadow-sm hover:bg-yellow/90 active:scale-[0.98]",
        orange:
          "bg-orange text-primary-foreground border-orange shadow-sm hover:bg-orange/90 active:scale-[0.98]",
        red:
          "bg-red text-primary-foreground border-red shadow-sm hover:bg-red/90 active:scale-[0.98]",
        blue:
          "bg-blue text-primary-foreground border-blue shadow-sm hover:bg-blue/90 active:scale-[0.98]",
        'cloud-green':
          "bg-cloud-green text-primary-foreground border-cloud-green shadow-sm hover:bg-cloud-green/90 active:scale-[0.98]",
        pink:
          "bg-pink text-foreground border-pink shadow-sm hover:bg-pink/90 active:scale-[0.98]",
        green:
          "bg-green text-foreground border-green shadow-sm hover:bg-green/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        xs: "h-7 px-2 text-xs",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0 text-sm font-normal",
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
        lg: "text-lg",
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

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return (
      <Slot className={buttonVariants({ variant, size, className })} ref={ref} {...restProps}>
        {child}
      </Slot>
    );
  }

  return (
    <button
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      {...restProps}
    >
      <span
        className={cn(
          'absolute transition-opacity opacity-100 pointer-events-none duration-150', 
          loading ? 'animate-bounce-in' : 'opacity-0'
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
    </button>
  )
}
Button.displayName = "Button"

export { Button, buttonVariants }
