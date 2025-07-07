import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, getSession } from "next-auth/react";
import { QueriesKeys } from "@/lib/constants";
import { AuthResponse, LoginDataType } from "../types";
import { getUser } from "../users";

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation<AuthResponse, Error, LoginDataType>({
        mutationFn: async (data: LoginDataType): Promise<AuthResponse> => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (!result?.ok) {
                throw new Error(result?.error || 'Помилка входу');
            }

            const session = await getSession();

            if (!session) {
                throw new Error('Помилка входу');
            }

            console.log('session', session.user.id);

            const user = await queryClient.fetchQuery({
                ...getUser(Number(session.user.id))
            });

            console.log('user', user);

            return {
                expires: session.expires || '',
                access_token: session.accessToken || '',
                refresh_token: session.refreshToken || '',
                user: user,
            }
        },
        onSuccess: async (session) => {
            console.log('session', session);
            queryClient.setQueryData([QueriesKeys.User], session.user);
        },
        onError: (error) => {
            console.error('Login error:', error);
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
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout error:', error);
        }
    })
};
