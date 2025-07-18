import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "bg-muted animate-pulse",
  {
    variants: {
      variant: {
        text: "h-4 rounded",
        title: "h-6 rounded",
        avatar: "size-10 rounded-full",
        button: "h-8 rounded-md",
        card: "h-32 rounded-lg",
        circle: "rounded-full",
      },
      size: {
        sm: "w-16",
        md: "w-32", 
        lg: "w-48",
        xl: "w-64",
      },
    },
    defaultVariants: {
      variant: "text",
      size: "md",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({ 
  className, 
  variant,
  size,
  width,
  height,
  ...props 
}: SkeletonProps) => {
  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={cn(
        skeletonVariants({ variant, size: width || height ? undefined : size }),
        className
      )}
      style={style}
      {...props}
    />
  );
};

export { Skeleton }; 