import { Button } from '@/components/ui/button';
import cartItem from '@/redux/cartItem';
import { getSelectProductInCart } from '@/redux/selector';
import { deleteCartItem } from '@/services/cartItem.service';
import { useMutation } from '@tanstack/react-query';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';

const Total = () => {
    const selectProductInCart = useSelector(getSelectProductInCart);

    const total = useMemo(() => {
        if (selectProductInCart.length) {
            const sum = selectProductInCart.reduce((sum, cartItem) => {
                if (cartItem.checked) {
                    const finalPrice = cartItem?.productId?.price?.final;
                    const quantity = cartItem?.select?.quantity;
                    sum += finalPrice * quantity;
                }
                return sum;
            }, 0);
            return sum;
        }
        return 0;
    }, [selectProductInCart]);
    const deleteManyCartItemMutation = useMutation({
        mutationFn: (data) => {
            return deleteCartItem();
        },
    });
    const handleDeleteManyCartItem = () => {};
    return (
        <div className="px-5 py-4 rounded-md bg-white flex gap-8 justify-end items-center sticky bottom-0 border-t-2 border-accent">
            {/* <div className="rounded-md hover:ring-1 p-3" role='button' onClick={()=>handleDeleteManyCartItem()}>
                <RiDeleteBin6Line className="w-5 h-5" />
            </div> */}
            <div className="flex gap-5 justify-end items-center">
                <div>
                    <span className="me-3">
                        Total ({' '}
                        {
                            selectProductInCart?.filter(
                                (cartItem) => cartItem.checked === true,
                            ).length
                        }{' '}
                        items):{' '}
                    </span>
                    <NumericFormat
                        value={total}
                        thousandSeparator
                        displayType="text"
                        suffix={' VND'}
                        renderText={(value) => (
                            <span className="text-xl font-medium text-red-500">
                                {value}
                            </span>
                        )}
                    />
                </div>
                <Button>CHECK OUT</Button>
            </div>
        </div>
    );
};

export default memo(Total);
