import { cn } from "@/lib/utils";
import React from "react";

type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
    name: string;
    color?: string;
    size?: number;
}

export const Icon = (props: IconProps) => {
    const {
        name,
        size = 24,
        color,
        style = {},
        className,
        ...rest
    } = props;

    return (
        <i
            style={{
                color: color,
                fontSize: size,
                ...style,
            }}
            className={cn(
                'material-symbols-outlined font-mi font-normal not-italic leading-none',
                className,
            )}
            {...rest}
        >
            {name}
        </i>
    );
};

