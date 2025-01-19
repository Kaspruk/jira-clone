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

// @ts-ignore
export const DataTable: React.NamedExoticComponent<DataTableProps> & {
    HeadCell: typeof TableHead;
    RowCell: typeof TableCell;
} = memo((props: DataTableProps) => {
    const {
        data,
        columns,
        onRowClick
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
        <Table>
            <TableHeader>
                <tr>
                    {columns.map((column) => {
                        const sortValue = sortState[column.key];
                        const onSort = () => onSortHandler(column.key);

                        return (
                            column.th?.({ onSort, sortValue }) || (
                                <TableHead
                                    key={column.key}
                                    onSort={onSort}
                                    sortValue={sortValue}
                                    textAlign={column.textAlign}
                                    isSortable={column.isSortable}
                                >
                                    {column.title}
                                </TableHead>
                            )
                        )
                    })}
                </tr>
            </TableHeader>
            <TableBody>
                {data.length ? (
                    data.map((row) => {
                        const onClick = onRowClick && (() => onRowClick(row));
                        return (
                            <TableRow key={row.id} onClick={onClick}>
                                {columns.map((column) => {
                                    return serverRender(column.td, { key: column.key, value: row[column.key], row })
                                })}
                            </TableRow>
                        )
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table >
    );
});

DataTable.HeadCell = TableHead;
DataTable.RowCell = TableCell;