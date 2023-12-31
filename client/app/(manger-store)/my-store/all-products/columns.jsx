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
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import routes from '@/routes';

import { AiOutlineEye } from 'react-icons/ai';
import ToggleStatus from '@/components/Product/Button/ToggleStatus';
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
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="hover:text-white">
                    <span>Name</span>
                    <LuArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => {
            const name = row.original.name;
            const id = row.original._id;
            return (
                <div className="flex flex-col gap-3 text-sm ">
                    <span className="line-clamp-2">{name}</span>
                    <span className="text-xs text-gray-400">ID: {id}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'active',
        header: 'Active',
        cell: ({ row }) => {
            const { _id, active } = row.original;

            return (
                <div>
                    <ToggleStatus productId={_id} active={active} />
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        accessorFn: (row) => {
            return row.price.final;
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="hover:text-white">
                    <span>Price</span>
                    <LuArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const finalPrice = formatPrice(row.getValue('price'));
            return <p className="text-center">{finalPrice}</p>;
        },
    },
    {
        accessorKey: 'store',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="hover:text-white">
                    <span>Store</span>

                    <LuArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const colors = row.original.colors;

            const store = colors.reduce((sum, color) => {
                const sizes = color.sizes;
                const subSum = sizes.reduce((sum, size) => {
                    sum += size.quantity;
                    return sum;
                }, 0);
                sum += subSum;
                return sum;
            }, 0);
            return <p className="text-center">{store}</p>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="hover:ring-1 rounded-md p-1">
                        <HiOutlineDotsHorizontal className="h-6 w-6 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(product._id)
                            }
                            className="DropdownMenuItem">
                            <div role="button">Copy product ID</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="DropdownMenuItem">
                            <div className="flex gap-2 justify-center items-center">
                                <Link href={routes.productDetail(product._id)}>
                                    <AiOutlineEye className="h-8 w-8  p-2 rounded-xl bg-sky-400 shadow-md shadow-sky-400 hover:shadow-lg hover:shadow-sky-400" />
                                </Link>
                                <EditButton product={product} />
                                <DeleteButton product={product} />
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
