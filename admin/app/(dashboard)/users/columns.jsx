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
export const columns = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected()}
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => {
            const { avatar } = row.original;

            return <>{avatar?.url && <AvatarText src={avatar.url} />}</>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white "
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
                    <span className="font-medium">{name}</span>
                    <span className="text-xs text-gray-500">ID: {_id}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white "
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white "
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Phone
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'lock.status',
        header: ({ column }) => {
            return (
                <Button
                    className="hover:text-white "
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
                <div className="flex gap-2">
                    <Link
                        href={routes.store(_id)}
                        className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-secondary">
                        <Eye />
                    </Link>
                    <EditUserButton userId={_id} name={name} lock={lock} />
                </div>
            );
        },
    },
];
