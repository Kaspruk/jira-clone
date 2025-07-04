import { useSession } from "next-auth/react";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { BASE_URL, QueriesKeys } from "@/lib/constants";
import { UserType } from "../types";

export const getUser = (userId: number) => queryOptions<UserType>({
    queryKey: [QueriesKeys.User],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/users/${userId}/`)
        return response.json()
    },
});

export const useUser = () => {
    const { data: session } = useSession();
    return useSuspenseQuery(getUser(Number(session?.user?.id)));
};

export const getUsers = queryOptions<UserType[]>({
    queryKey: [QueriesKeys.Users],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/users/`)
        return response.json()
    },
});

export const useGetUsers = () => {
    return useQuery(getUsers);
};