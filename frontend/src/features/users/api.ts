import { queryOptions } from "@tanstack/react-query";
import { BASE_URL, QueriesKeys } from "@/lib/constants";
import { UserType } from "../types";

export const getUsers = queryOptions<UserType[]>({
    queryKey: [QueriesKeys.Users],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/users/`)
        return response.json()
    },
});