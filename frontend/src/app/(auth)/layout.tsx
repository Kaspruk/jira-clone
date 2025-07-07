import { getQueryClient } from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const queryClient = getQueryClient();
    const dehydratedState = dehydrate(queryClient);
    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Jira Clone
                    </h1>
                    <p className="text-gray-600">
                        Керуйте своїми проєктами ефективно
                    </p>
                </div>
                <HydrationBoundary state={dehydratedState}>
                    {children}
                </HydrationBoundary>
            </div>
        </div>
    );
}