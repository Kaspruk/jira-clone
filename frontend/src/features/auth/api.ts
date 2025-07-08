import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, getSession } from "next-auth/react";
import { toast } from "sonner";

import { ResponseError } from "@/lib/utils";
import { QueriesKeys } from "@/lib/constants";
import { AuthResponse, LoginDataType, RegisterDataType } from "../types";
import { getUser } from "../users";
import axiosClient, { setTokens } from "@/lib/axios";

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation<AuthResponse, ResponseError, LoginDataType>({
        mutationFn: async (data) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            
            if (!result?.ok) {
                try {
                    const error = JSON.parse(result?.error || '{}');
                    throw new ResponseError(error.message, error.code);
                } catch (error) {
                    if (error instanceof ResponseError) {
                        throw error;
                    }

                    throw new Error(result?.error || 'Помилка входу');
                }
            }

            const session = await getSession();

            if (!session) {
                throw new ResponseError('Помилка входу');
            }

            const user = await queryClient.fetchQuery(getUser(Number(session.user.id)));

            return {
                expires: session.expires || '',
                access_token: session.accessToken || '',
                refresh_token: session.refreshToken || '',
                user: user,
            }
        },
        onSuccess: async (session) => {
            toast.success("Ви увійшли в систему!");
            queryClient.setQueryData([QueriesKeys.User], session.user);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await signOut({ redirect: true });
        },
        onSuccess: () => {
            setTokens('', '');
            toast.success("Ви вийшли з системи!");
            queryClient.clear();
        },
        onError: () => {
            toast.error("Помилка виходу!");
        }
    })
};

export const useRegister = () => {
    return useMutation<RegisterDataType, ResponseError, RegisterDataType>({
        mutationFn: async (data) => {
            const response = await axiosClient.post("/auth/register", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Реєстрація успішна!");
        },
        onError: (error) => {
            toast.error(error.message || "Помилка реєстрації!");
        }
    })
}
