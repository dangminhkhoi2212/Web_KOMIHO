import { Inter as FontSans } from 'next/font/google';
import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Auth from '@/components/Auth';
import { Suspense } from 'react';
import Loading from './loading';

export default function RootLayout({ children }) {
    return (
        <Auth>
            <Suspense fallback={<Loading />}>
                <div className="grid grid-cols-12">
                    <div className="col-span-2 bg-white">
                        <Navbar />
                    </div>
                    <div className="col-span-10 p-10 bg-default container">
                        {children}
                    </div>
                </div>
            </Suspense>
        </Auth>
    );
}
