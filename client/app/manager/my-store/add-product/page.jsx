import React, { Suspense } from 'react';
import FormAddProduct from '@/components/FormAddProduct';
import AccountTemplate from '@/components/Account/AccountTemplate';
const AddProduct = () => {
    return (
        <AccountTemplate title={'ADD PRODUCT'}>
            <FormAddProduct />
        </AccountTemplate>
    );
};

export default AddProduct;
