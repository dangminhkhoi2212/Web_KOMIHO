import '@/app/globals.css';
import { poppins } from '@/components/Fonts';
import Auth from '@/components/Auth';
import clsx from 'clsx';

export const metadata = {
    title: 'Admin Kimoho',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={clsx(
                    poppins.variable,
                    ' bg-white  overflow-x-hidden font-pops scroll-smooth',
                )}>
                <Auth>{children}</Auth>
            </body>
        </html>
    );
}
