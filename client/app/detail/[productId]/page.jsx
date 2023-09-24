import Carousel from '@/components/ProductDetail/Carousel';
import { getProductByProductId } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Detail = ({ params }) => {
    const getProduct = useQuery({
        queryFn: () => {
            return getProductByProductId(params.productId);
        },
    });
    const images = getProduct.data.images;
    return (
        <div>
            <Carousel images={images} />
        </div>
    );
};

export default Detail;
