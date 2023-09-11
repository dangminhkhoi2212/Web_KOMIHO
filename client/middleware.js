import { NextRequest, NextResponse } from 'next/server';
import routes from './routes';
export const config = {
    matcher: '/store/:path*',
};

export default (request) => {
    console.log('🚀 ~ file: middleware.js:8 ~ middleware ~ request:', request);
    // const pathname = request.nextUrl.pathname;
    // console.log(
    //     '🚀 ~ file: middleware.js:9 ~ middleware ~ pathname:',
    //     pathname,
    // );
    // let cookie = request.cookies.get('accessToken');
    // console.log('🚀 ~ file: middleware.js:14 ~ middleware ~ cookie:', cookie);
    // if (!cookie) return NextResponse.rewrite(new URL('/login', request.url));
};
