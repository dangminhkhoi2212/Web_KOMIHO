import { Button } from '@/components/ui/button';
import { getSelectProductInCart } from '@/redux/selector';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';

const Total = () => {
    const selectProductInCart = useSelector(getSelectProductInCart);

    const total = useMemo(() => {
        const sum = selectProductInCart.reduce((sum, cartItem) => {
            const finalPrice = cartItem.productId.price.final;
            const quantity = cartItem.select.quantity;
            sum += finalPrice * quantity;
            return sum;
        }, 0);
        return sum;
    }, [selectProductInCart]);
    return (
        <div className="px-5 py-4 rounded-md bg-white flex gap-8 justify-end items-center sticky bottom-0 border-t-2 border-accent">
            <div className=" ">
                <span className="me-3">
                    Total ( {selectProductInCart?.length} items):{' '}
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
    );
};

export default memo(Total);
