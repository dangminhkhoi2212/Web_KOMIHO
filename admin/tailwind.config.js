/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/flowbite-react/**/*.js',
    ],
    theme: {
        extend: {
            height: {
                'height-header': '70px',
                'height-main': 'calc( 100vh - 70px )',
            },
            colors: {
                primary: '#8FB3FF',
                secondary: '#CEEFFD',
                accent: '#2954AD',
                backgroundColor: '#f2f2f2',
                textColor: '#000000',
            },
            fontFamily: {
                pops: ['var(--font-poppins)'],
            },
            zIndex: {
                header: '100',
                'drop-down': '500',
                container: '50',
            },
            spacing: {
                'height-header': '70px',
                'height-main': 'calc( 100vh - 70px )',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
