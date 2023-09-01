import clsx from 'clsx';
import './globals.css';
import { inter } from './fonts';
import Auth from '@/components/Auth';
import NextTopLoader from 'nextjs-toploader';
export const metadata = {
    title: 'Komiho',
    description: 'Sale clothes for teennagers',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={clsx(
                    inter.className,
                    'overflow-x-hidden scroll-smooth flex flex-col justify-center items-center',
                )}>
                <NextTopLoader color="#8FB3FF" />
                <Auth>{children}</Auth>
            </body>
        </html>
    );
}
