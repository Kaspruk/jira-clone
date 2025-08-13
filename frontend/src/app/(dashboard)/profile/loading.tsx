import { Skeleton } from "@/components/ui/skeleton";
import { View } from "@/components/ui/view";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
    return (
        <View className="animate-slide-up space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>

            {/* Separator Skeleton */}
            <Skeleton className="h-px w-full" />

            {/* Main Content Skeleton */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
                {/* UserAvatar Skeleton */}
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardContent>
                </Card>

                {/* UserForm Skeleton */}
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* UserStatus Skeleton */}
            <Card className="border-none shadow-none">
                <CardHeader>
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </View>
    );
} 