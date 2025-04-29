import React from 'react';
import { tv, VariantProps } from "tailwind-variants"



// display: flex;
// box-sizing: border-box;
// transform: translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
//   scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1));
// transform-origin: 0 0;
// touch-action: manipulation;

const listItemVariants = tv({
    slots: {
        base: 'flex items-center gap-4 origin-center touch-manipulation bg-white shadow-sm rounded-md',
        left: 'flex',
        right: 'flex',
        title: 'font-normal',
        subtitle: 'text-gray-500',
    },
    variants: {
        variant: {
            standard: {
                base: 'p-2',
            },
            small: {
                base: 'p-2 text-sm',
            },
        },
        disabled: {
            true: {
                base: 'bg-gray-100 opacity-50 cursor-default',
            },
        },
        isDragging: {
            true: {
                base: 'z-10 transition-opacity opacity-75',
            },
        },
    },
    defaultVariants: {
        variant: 'standard',
        isDragging: false,
    },
});

export type ListItemProps = React.HTMLAttributes<HTMLLIElement> & VariantProps<typeof listItemVariants> & {
    ref?: React.RefObject<HTMLElement>;
    left?: React.ReactNode;
    right?: React.ReactNode;
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
    className?: string;
    isDragging?: boolean;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
    const {
        ref,
        left,
        title,
        subtitle,
        children,
        className,
        right,
        variant,
        isDragging,
        disabled,
        ...restProps
    } = props;

    const classes = listItemVariants({ variant, isDragging, disabled, className });

    return (
        <li ref={ref} {...restProps} className={classes.base({ class: className })}>
            {left && <div className={classes.left()}>{left}</div>}
            <div className="flex-grow">
                <span className={classes.title()}>{title}</span>
                {subtitle && <span className={classes.subtitle()}>{subtitle}</span>}
                {children}
            </div>
            {right && <div className={classes.right()}>{right}</div>}
        </li>
    );
};
