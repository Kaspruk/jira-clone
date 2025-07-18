import * as React from "react"

import { cn } from "@/lib/utils"

const View = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card shadow text-card-foreground w-full xl:p-10 lg:p-8 p-4",
      className
    )}
    {...props}
  />
))
View.displayName = "View"

const ViewTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-xl max-sm:text-lg animate-slide-left delay-100", className)}
    {...props}
  />
))
ViewTitle.displayName = "ViewTitle"

export { View, ViewTitle }
