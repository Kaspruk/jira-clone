import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",
        outline: "text-foreground border-border",
        yellow:
          "border-transparent bg-yellow text-foreground shadow-sm hover:bg-yellow/90",
        orange:
          "border-transparent bg-orange text-primary-foreground shadow-sm hover:bg-orange/90",
        red:
          "border-transparent bg-red text-primary-foreground shadow-sm hover:bg-red/90",
        blue:
          "border-transparent bg-blue text-primary-foreground shadow-sm hover:bg-blue/90",
        purple:
          "border-transparent bg-purple text-primary-foreground shadow-sm hover:bg-purple/90",
        'cloud-green':
          "border-transparent bg-cloud-green text-primary-foreground shadow-sm hover:bg-cloud-green/90",
        pink:
          "border-transparent bg-pink text-foreground shadow-sm hover:bg-pink/90",
        green:
          "border-transparent bg-green text-foreground shadow-sm hover:bg-green/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
