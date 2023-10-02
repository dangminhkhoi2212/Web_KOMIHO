import React, { Suspense } from 'react';
const FormAddProduct = dynamic(() =>
    import('@/components/Product/FormAddProduct'),
);
import AccountTemplate from '@/components/Account/AccountTemplate';
import dynamic from 'next/dynamic';
const AddProduct = () => {
    return (
        <AccountTemplate title={'ADD PRODUCT'}>
            <FormAddProduct />
        </AccountTemplate>
    );
};

export default AddProduct;
