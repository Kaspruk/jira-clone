import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
 
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

import "quill/dist/quill.snow.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const materialIcons = localFont({
  src: "./material-icons.woff2",
  style: "normal",
  display: "swap",
  variable: "--font-material-icons",
});

export const metadata: Metadata = {
  title: "Jira Clone - Project Management",
  description: "Modern Jira clone for project and task management. Create projects, manage tasks and track team progress.",
  keywords: ["projects", "tasks", "management", "jira", "agile", "scrum"],
  authors: [{ name: "Jira Clone Team" }],
  creator: "Jira Clone",
  publisher: "Jira Clone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jira Clone",
    startupImage: "/web-app-manifest-512x512.png",
  },
  applicationName: "Jira Clone",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "overlays-content",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1F1F" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          materialIcons.variable,
          "flex antialiased min-h-screen-safe bg-background max-md:flex-col"
        )}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
