"use client"

import { memo } from "react";
import { Toaster as Sonner } from "sonner";
import { useMediaQuery } from "react-responsive";

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = memo((props: ToasterProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-gray-100 text-gray-10 border border-gray-40 shadow-lg rounded-md p-4 font-medium",
          description: "text-gray-50 text-sm opacity-90",
          actionButton:
            "bg-blue text-gray-100 hover:bg-blue/90 h-8 px-3 text-xs font-medium rounded-md transition-colors",
          cancelButton:
            "bg-gray-90 text-gray-50 hover:bg-gray-80 h-8 px-3 text-xs font-medium rounded-md transition-colors",
          success: "bg-green text-gray-100 border-green [&>svg]:text-gray-100",
          error: "bg-red text-gray-100 border-red [&>svg]:text-gray-100",
          warning: "bg-yellow text-gray-100 border-yellow [&>svg]:text-gray-100",
          info: "bg-pink text-gray-100 border-pink [&>svg]:text-gray-100",
          closeButton: "text-gray-50 hover:text-gray-10 transition-colors",
          icon: "shrink-0",
        },
      }}
      position={isMobile ? "top-center" : "bottom-right"}
      icons={{
        success: (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
        error: (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
        warning: (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        info: (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        ),
      }}
      {...props}
    />
  )
});
