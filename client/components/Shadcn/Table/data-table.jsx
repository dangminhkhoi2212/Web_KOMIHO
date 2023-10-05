'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    resetSelectProductInTable,
    setSelectProductInTable,
} from '@/redux/selectProductInTable';
import { setPage } from '@/redux/filterSearchSlice';
import Loading from '@/components/Loading';
import { getSelectProductInTable } from '@/redux/selector';
export function DataTable({ columns, data, pageCount, isLoading }) {
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState([]);
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),

        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            rowSelection,
            sorting,
        },
    });

    const dispatch = useDispatch();

    // add selected products to redux store
    const productInTable = useSelector(getSelectProductInTable);

    useEffect(() => {
        const products = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original);

        if (products.length) {
            dispatch(setSelectProductInTable(products));
        }
        return () => {
            dispatch(resetSelectProductInTable());
        };
    }, [table.getFilteredSelectedRowModel().rows.length]);
    const handlePageClick = (page) => {
        dispatch(setPage(page + 1));
    };
    useEffect(() => {
        if (productInTable.length === 0) {
            table.toggleAllPageRowsSelected(false);
        }
    }, [productInTable]);
    return (
        <div>
            {isLoading && <Loading />}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                pageCount={pageCount || 1}
                handleEvent={(data) => handlePageClick(data)}
            />
        </div>
    );
}
