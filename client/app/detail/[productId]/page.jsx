'use client';
import { getProductByProductId } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Detail = ({ params }) => {
    const getProduct = useQuery({
        queryKey: ['get-detail-product'],
        queryFn: () => {
            return getProductByProductId(params.productId);
        },
    });
    const images = getProduct?.data?.images;
    return <div>{params.productId}</div>;
};

export default Detail;
