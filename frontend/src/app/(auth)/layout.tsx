import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/25 rounded-full blur-3xl" />
                <div className="absolute bottom-[15%] right-[8%] w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute top-[60%] left-[60%] w-64 h-64 bg-primary/18 rounded-full blur-3xl" />
                <div className="absolute top-[25%] left-[45%] w-60 h-60 bg-primary/15 rounded-full blur-2xl" />
                <div className="absolute bottom-[35%] left-[15%] w-52 h-52 bg-primary/12 rounded-full blur-3xl" />
                <div className="absolute top-[75%] right-[35%] w-44 h-44 bg-primary/10 rounded-full blur-2xl" />
                <div className="absolute top-[35%] right-[12%] w-48 h-48 bg-primary/16 rounded-full blur-2xl" />
                <div className="absolute top-[50%] left-[8%] w-56 h-56 bg-primary/14 rounded-full blur-3xl" />
            </div>
            
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>
            
            {/* Main content */}
            <div className="w-full max-w-md bg-card/80 backdrop-blur-xs border border-border rounded-lg shadow-sm px-6 py-8 sm:px-8 sm:py-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                        Jira Clone
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Керуйте своїми проєктами ефективно
                    </p>
                </div>
                
                {/* Content */}
                {children}
            </div>
        </div>
    );
}