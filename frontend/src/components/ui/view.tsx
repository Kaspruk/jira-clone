import * as React from "react"

import { cn } from "@/lib/utils"

const View = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card shadow text-card-foreground w-full lg:p-10 p-6",
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
    className={cn("font-semibold leading-none tracking-tight text-xl", className)}
    {...props}
  />
))
ViewTitle.displayName = "ViewTitle"

export { View, ViewTitle }
