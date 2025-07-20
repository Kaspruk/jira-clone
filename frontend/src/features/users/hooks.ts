import { useQueryState, parseAsBoolean } from "nuqs";

export const useChangePasswordModalState = () => {
    return useQueryState(
        "change-password",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
};
