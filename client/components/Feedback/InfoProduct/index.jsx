'use client';
import ImageIconProduct from '@/components/ProductImageCover';
import routes from '@/routes';
import Link from 'next/link';
const InfoProduct = ({ product, select }) => {
    return (
        <div className="flex gap-3">
            <ImageIconProduct image={product.images} />
            <div className="flex flex-col ">
                <Link href={routes.productDetail(product.productId)}>
                    {product.name}
                </Link>
                {select && (
                    <p className="text-gray-400">
                        Color: {select.color}, Size: {select.size}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InfoProduct;
