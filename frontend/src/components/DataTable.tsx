"use client"

import React, { memo, useCallback, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    type TableHeadProps,
} from "@/components/ui/table";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type RowData = any & {
    id: string;
};

type ColumnBodyData = {
    key: keyof RowData;
    row: RowData;
    value: RowData[keyof RowData];
};

type Column = {
    key: string;
    td: (props: ColumnBodyData) => React.ReactElement;
    textAlign?: TableHeadProps['textAlign'],
    isSortable?: boolean;
} & (
        {
            th: (props: Pick<TableHeadProps, 'onSort' | 'sortValue'>) => React.ReactElement;
            title?: never;
        } | {
            title: string;
            th?: never;
        }
    );

export interface DataTableProps {
    columns: Column[];
    data: RowData[];
    onRowClick?(data: RowData): void;
    className?: string;
};

const serverRender = (Comp: any, props: any) => {
    if (!Comp) {
        return null;
    }

    if (typeof Comp === "function") {
        return React.createElement(Comp, props);
    }

    return Comp;
};

const EnhancedTableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement> & TableHeadProps & { title?: string }
>(({ className, onSort, sortValue, isSortable = true, textAlign = 'left', title, children, ...props }, ref) => {
    const getSortIcon = () => {
        if (!isSortable) return null;
        
        if (sortValue === 'asc') {
            return <Icon name="keyboard_arrow_up" size={16} className="text-primary" />;
        } else if (sortValue === 'desc') {
            return <Icon name="keyboard_arrow_down" size={16} className="text-primary" />;
        }
        return <Icon name="unfold_more" size={16} className="text-muted-foreground opacity-50" />;
    };

    return (
        <TableHead
            ref={ref}
            className={cn(
                "h-12 font-semibold text-sm transition-colors duration-200",
                isSortable && "cursor-pointer hover:text-foreground hover:bg-muted/50",
                "first:pl-4 last:pr-4 lg:first:pl-6 lg:last:pr-6",
                className
            )}
            onSort={onSort}
            sortValue={sortValue}
            textAlign={textAlign}
            isSortable={isSortable}
            {...props}
        >
            <div className={cn(
                "flex items-center gap-2",
                textAlign === 'center' && "justify-center",
                textAlign === 'right' && "justify-end"
            )}>
                <span className="select-none">
                    {title || children}
                </span>
                {isSortable && getSortIcon()}
            </div>
        </TableHead>
    );
});

EnhancedTableHead.displayName = "EnhancedTableHead";

// @ts-ignore
export const DataTable: React.NamedExoticComponent<DataTableProps> & {
    HeadCell: typeof TableHead;
    RowCell: typeof TableCell;
} = memo((props: DataTableProps) => {
    const {
        data,
        columns,
        onRowClick,
        className
    } = props;

    const [sortState, setSortState] = useState(() => {
        return columns.reduce<{ [key: string]: TableHeadProps['sortValue'] }>((acc, column) => {
            acc[column.key] = null;
            return acc;
        }, {});
    });

    const onSortHandler = useCallback((key: Column['key']) => {
        setSortState(state => {
            const oldValue = state[key];
            let newValue: TableHeadProps['sortValue'];

            if (oldValue === 'asc') {
                newValue = 'desc'
            } else if (oldValue === 'desc') {
                newValue = null
            } else {
                newValue = 'asc'
            }

            return { ...state, [key]: newValue };
        })
    }, []);

    return (
        <div className={cn("rounded-xl border bg-card shadow-sm overflow-hidden", className)}>
            <Table className="relative">
                <TableHeader className="bg-muted/30">
                    <tr className="border-b border-border">
                        {columns.map((column) => {
                            const sortValue = sortState[column.key];
                            const onSort = () => onSortHandler(column.key);

                            return (
                                column.th?.({ onSort, sortValue }) || (
                                    <EnhancedTableHead
                                        key={column.key}
                                        onSort={onSort}
                                        sortValue={sortValue}
                                        textAlign={column.textAlign}
                                        isSortable={column.isSortable}
                                        title={column.title}
                                    />
                                )
                            )
                        })}
                    </tr>
                </TableHeader>
                <TableBody>
                    {data.length ? (
                        data.map((row, index) => {
                            const onClick = onRowClick && (() => onRowClick(row));
                            return (
                                <TableRow 
                                    key={row.id} 
                                    onClick={onClick}
                                    className={cn(
                                        "border-b border-border/50 transition-all duration-200",
                                        "hover:bg-muted/50 hover:shadow-sm",
                                        onClick && "cursor-pointer",
                                        "data-[state=selected]:bg-muted",
                                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                    )}
                                >
                                    {columns.map((column) => {
                                        const render = serverRender(column.td, { key: column.key, value: row[column.key], row });
                                        const isValidElement = React.isValidElement(render);

                                        if (isValidElement) {
                                            return render;
                                        }

                                        return (
                                            <TableCell 
                                                key={column.key}
                                                className={cn(
                                                    "px-4 py-2 first:pl-6 last:pr-6",
                                                    "transition-colors duration-200"
                                                )}
                                            >
                                                {serverRender(column.td, { key: column.key, value: row[column.key], row })}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell 
                                colSpan={columns.length} 
                                className="h-24 text-center border-0"
                            >
                                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                    <Icon name="inbox" size={48} className="text-muted-foreground/50" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Немає результатів</p>
                                        <p className="text-xs text-muted-foreground/70">
                                            Дані для відображення відсутні
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
});

DataTable.HeadCell = TableHead;
DataTable.RowCell = TableCell;