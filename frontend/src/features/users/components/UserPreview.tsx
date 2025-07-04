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
import { useUser } from "../api";

interface UserPreviewProps {
    className?: string;
}

export const UserPreview = ({ className }: UserPreviewProps) => {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors",
                    className
                )}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                            {getInitials(user.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-neutral-900 truncate">
                            {user.username}
                        </span>
                        <span className="text-xs text-neutral-500 truncate">
                            {user.email}
                        </span>
                    </div>
                    <Icon 
                        name="expand_more" 
                        size={16} 
                        className="text-neutral-400 transition-transform group-data-[state=open]:rotate-180" 
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                    onClick={() => null}
                    className="cursor-pointer"
                >
                    <Icon name="edit" size={16} className="mr-2" />
                    Редагувати профіль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <Icon name="logout" size={16} className="mr-2" />
                    Вийти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};