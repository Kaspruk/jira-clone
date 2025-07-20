import { getUser } from "@/features/users/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { View } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import { UserForm } from "@/features/users/components/UserForm";
import { UserStatus } from "@/features/users/components/UserStatus";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const queryClient = new QueryClient();
    
    if (session?.user?.id) {
        // Передзавантаження даних користувача
        await queryClient.prefetchQuery(getUser(Number(session.user.id)));
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <View>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Профіль</h1>
                        <p className="text-muted-foreground mt-2">
                            Керуйте своїм профілем та налаштуваннями
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
                <DottedSeparator className="my-4" />
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                    <UserAvatar />
                    <UserForm />
                </div>
                <UserStatus />
            </View>
        </HydrationBoundary>
    );
} 