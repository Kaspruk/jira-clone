import { useSession } from "next-auth/react";
import { queryOptions, useQuery, useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QueriesKeys } from "@/lib/constants";
import { UserType } from "../types";
import { getAxiosClient } from "@/lib/axios";
import { toast } from "sonner";

export const getUser = (userId: number) => queryOptions<UserType>({
    queryKey: [QueriesKeys.User],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get(`/users/${userId}/`);
        return response.data;
    },
});

export const useUser = () => {
    const { data: session } = useSession();
    return useSuspenseQuery(getUser(Number(session?.user?.id)));
};

export const getUsers = queryOptions<UserType[]>({
    queryKey: [QueriesKeys.Users],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get("/users/");
        return response.data;
    },
});

export const useGetUsers = () => {
    return useQuery(getUsers);
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    
    return useMutation({
        mutationFn: async (userData: Partial<UserType>) => {
            const client = getAxiosClient();
            const response = await client.put(`/users/${session?.user?.id}/`, userData);
            return response.data;
        },
        onSuccess: (updatedUser) => {
            toast.success("Профіль оновлено");
            queryClient.setQueryData([QueriesKeys.User], updatedUser);
        },
        onError: (error) => {
            toast.error(error.message || "Помилка при оновленні профілю");
        }
    });
};

export const useChangePassword = () => {
    const { data: session } = useSession();
    
    return useMutation({
        mutationFn: async (passwordData: { current_password: string; new_password: string }) => {
            const client = getAxiosClient();
            const response = await client.put(`/users/${session?.user?.id}/password/`, passwordData);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Пароль успішно змінено");
        },
        onError: (error) => {
            toast.error(error.message || "Помилка при зміні пароля");
        }
    });
};

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            
            const client = getAxiosClient();
            const response = await client.post(`/users/${session?.user?.id}/avatar/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (updatedUser) => {
            toast.success("Аватар успішно оновлено");
            queryClient.setQueryData([QueriesKeys.User], updatedUser);
        },
        onError: (error) => {
            toast.error(error.message || "Помилка при завантаженні аватара");
        }
    });
};