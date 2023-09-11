'use client';
import routes from '@/routes';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const MyStore = () => {
    useEffect(() => {
        redirect(routes.managerAllProducts);
    }, []);
    return <div>Redirect to all products...</div>;
};

export default MyStore;
