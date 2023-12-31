export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
};

export default function RootLayout({ children }) {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            {children}
        </div>
    );
}
