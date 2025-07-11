import { useSession } from "next-auth/react";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QueriesKeys } from "@/lib/constants";
import { UserType } from "../types";
import { getAxiosClient } from "@/lib/axios";

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