import { NextRequest, NextResponse } from 'next/server';
import routes from './routes';
export const config = {
    matcher: ['/store/:path*', '/manager/:path*', '/account/:path*', '/cart'],
};

export default (request) => {
    const pathname = request.nextUrl.pathname;

    let cookie = request.cookies.get('accessToken');
    if (!cookie) return NextResponse.redirect(new URL('/login', request.url));
};
