/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            height: {
                header: '160px',
                carousel: '600px',
            },
            colors: {
                primary: '#8FB3FF',
                secondary: '#d9ecff',
                third: '#EFF9FF',
                fourth: '#FF8B8B',
                accent: '#2954AD',
                default: '#f5f5f5',
            },
            zIndex: {
                header: '100',
                'drop-down': '1000',
                container: '50',
                loading: '2000',
                alert: '5000',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
