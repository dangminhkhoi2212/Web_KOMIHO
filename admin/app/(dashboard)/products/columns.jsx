'use client';

import AvatarText from '@/components/Avatar';
import EditUserButton from '@/components/Button/EditUserButton';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { routes } from '@/routes';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PriceFormat from '@/components/PriceFormat';
import { NumericFormat } from 'react-number-format';
import { Star } from 'lucide-react';
import EditProductButton from '@/components/Button/EditProductButton';
export const columns = [
    {
        accessorKey: 'cover',
        header: 'Cover',
        cell: ({ row }) => {
            const { cover } = row.original;

            return <>{cover && <AvatarText src={cover} />}</>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { name, _id } = row.original;
            return (
                <div className="flex flex-col ">
                    <span className="font-medium line-clamp-3">{name}</span>
                    <span className="text-xs text-gray-500">ID: {_id}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'price.final',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { price } = row.original;
            return <PriceFormat price={price} />;
        },
    },

    {
        accessorKey: 'sold',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Sold
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { sold } = row.original;

            return (
                <NumericFormat
                    value={sold}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <span className="flex justify-center items-center">
                            {value}
                        </span>
                    )}
                />
            );
        },
    },
    {
        accessorKey: 'ratingsAverage',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Ratings
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { ratingsAverage } = row.original;

            return (
                <NumericFormat
                    value={ratingsAverage || 0}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <span className="flex justify-center items-center gap-2 ">
                            {Number(value).toFixed(2)}
                            <Star className="fill-yellow-400 stroke-none" />
                        </span>
                    )}
                />
            );
        },
    },
    {
        accessorKey: 'views',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Views
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { views } = row.original;

            return (
                <NumericFormat
                    value={views}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <span className="flex justify-center items-center">
                            {value}
                        </span>
                    )}
                />
            );
        },
    },
    {
        accessorKey: 'lock.status',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const { lock } = row.original;

            return (
                <Badge
                    className={cn(
                        lock?.status ? 'bg-red-400' : 'bg-green-400',
                        'text-center',
                    )}>
                    {lock?.status ? 'Locked' : 'UnLock'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const { _id, name, lock } = row.original;
            return (
                <div className="flex justify-center items-center">
                    <Link
                        href={routes.productDetail(_id)}
                        className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-secondary">
                        <Eye />
                    </Link>
                    <EditProductButton
                        productId={_id}
                        name={name}
                        lock={lock}
                    />
                </div>
            );
        },
    },
];
