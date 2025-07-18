"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "../api";

interface UserPreviewProps {
    className?: string;
    isCollapsed?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const UserPreview = ({ className, isCollapsed = false, onOpenChange }: UserPreviewProps) => {
    const router = useRouter();
    const { data: user } = useUser();
    const { mutate: logout } = useLogout();
    
    const handleLogout = async () => {
        logout(undefined, {
            onSuccess: () => {
                router.push('/login');
            }
        });
    }

    if (!user) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <div className={cn(
                    "flex items-center rounded-lg cursor-pointer hover:bg-muted transition-all duration-200",
                    isCollapsed 
                        ? "p-1.5 justify-center rounded-full"
                        : "gap-3 p-2",
                    className
                )}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getInitials(user.username)}
                        </AvatarFallback>
                    </Avatar>
                    
                    {!isCollapsed && (
                        <>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-medium text-foreground truncate">
                                    {user.username}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </span>
                            </div>
                            <Icon 
                                name="expand_more" 
                                size={16} 
                                className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" 
                            />
                        </>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="start" 
                className="w-56"
            >
                <div className="px-2 py-1.5 justify-center">
                    <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => null}
                    className="cursor-pointer"
                >
                    <Icon name="edit" size={16} className="mr-2" />
                    Редагувати профіль
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <Icon name="logout" size={16} className="mr-2" />
                    Вийти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};