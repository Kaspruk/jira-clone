"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SlideUpContainer = ({ children, className = "" }: AnimatedContainerProps) => {
  const pathname = usePathname();
  
  return (
    <div key={pathname} className={`animate-slide-up ${className}`}>
      {children}
    </div>
  );
};

export const FadeInContainer = ({ children, className = "" }: AnimatedContainerProps) => {
  const pathname = usePathname();
  
  return (
    <div key={pathname} className={`animate-fade-scale ${className}`}>
      {children}
    </div>
  );
};

export const SlideLeftContainer = ({ children, className = "" }: AnimatedContainerProps) => {
  const pathname = usePathname();
  
  return (
    <div key={pathname} className={`animate-slide-left ${className}`}>
      {children}
    </div>
  );
};
