'use client';

import { formatPrice } from '@/utils/format';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { chooseProduct } from '@/redux/chooseProductSlice';
import EditButton from '@/components/Product/Button/Edit';
import DeleteButton from '@/components/Product/Button/Delete';
import { LuArrowUpDown } from 'react-icons/lu';
import { Button } from '@/components/ui/button';

const handleChooseProduct = ({ product }) => {
    const dispatch = useDispatch();
    dispatch(chooseProduct(product));
};
export default handleChooseProduct;
export const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }) => {
            const image = row.original.images;
            if (!image[0]) return;
            return (
                <div className="relative w-[60px] h-[60px] ">
                    <Image
                        src={image[0]?.url}
                        fill
                        sizes="60px"
                        alt={image[0]?.url}
                        className="object-contain object-center rounded-md ring-1"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            console.log('🚀 ~ file: columns.jsx:66 ~ column:', column);
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Name
                    <LuArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => {
            const name = row.original.name;
            const id = row.original._id;
            return (
                <div className="flex flex-col gap-3 text-sm w-[200px]">
                    <span className="line-clamp-2">{name}</span>
                    <span className="text-xs text-gray-400">ID: {id}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const finalPrice = formatPrice(row.getValue('price').final);
            return <span>{finalPrice}</span>;
        },
    },
    {
        accessorKey: 'store',
        header: 'Store',
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex gap-3 items-start text-white">
                    <EditButton product={product} />
                    <DeleteButton product={product} />
                </div>
            );
        },
    },
];
