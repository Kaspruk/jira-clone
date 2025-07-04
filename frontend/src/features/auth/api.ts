import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, getSession } from "next-auth/react";
import { QueriesKeys } from "@/lib/constants";
import { LoginDataType } from "../types";

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: LoginDataType) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (!result?.ok) {
                throw new Error(result?.error || 'Помилка входу');
            }

            const session = await getSession();
            return session;
        },
        onSuccess: async (session) => {
            if (session?.user) {
                queryClient.setQueryData([QueriesKeys.User], session.user);
            }
            await queryClient.invalidateQueries();
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
            await signOut({ redirect: false });
        },
        onSuccess: () => {
            queryClient.clear();
            queryClient.setQueryData([QueriesKeys.User], null);
        },
        onError: (error) => {
            console.error('Logout error:', error);
        }
    })
};

// export const useAuth = () => {
//     const { data: session, status } = useNextAuthSession();
    
//     return {
//         user: session?.user,
//         accessToken: session?.accessToken,
//         refreshToken: session?.refreshToken,
//         isLoading: status === "loading",
//         isAuthenticated: status === "authenticated",
//         isUnauthenticated: status === "unauthenticated",
//     };
// };
