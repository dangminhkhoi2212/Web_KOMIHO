import clsx from 'clsx';
import './globals.css';
import { inter } from './fonts';
import Auth from '@/components/Auth';

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
                <Auth>{children}</Auth>
            </body>
        </html>
    );
}
