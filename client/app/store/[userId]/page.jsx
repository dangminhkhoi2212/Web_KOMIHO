'use client';
import StoreTemplate from '@/components/StoreTemplate';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import routes from '@/routes';
const MyStore = ({ params }) => {
    useEffect(() => {
        redirect(routes.storeAllProducts(params.userId));
    }, []);
    return <p>Redirecting to all your products...</p>;
};

export default MyStore;
