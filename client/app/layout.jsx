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
                    ' scroll-smooth flex flex-col justify-center items-center min-w-[1024px]',
                )}>
                <NextTopLoader color="#8FB3FF" showSpinner={false} />
                <Auth>{children}</Auth>
            </body>
        </html>
    );
}
