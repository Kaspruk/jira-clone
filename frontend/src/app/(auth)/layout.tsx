import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className={
            cn(
                "min-h-screen w-screen flex items-center justify-center p-3",
                "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950"
            )
        }>
           <div className="w-full max-w-md bg-white rounded-xl shadow-lg py-6 px-4 sm:py-8 sm:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Jira Clone
                    </h1>
                    <p className="text-gray-600">
                        Керуйте своїми проєктами ефективно
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}