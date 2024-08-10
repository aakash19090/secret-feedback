import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    const authPathsToSkipForLoggedInUser = ['/', '/sign-in', '/sign-up', '/verify'];
    const isOnAuthPath = authPathsToSkipForLoggedInUser.some((path) => url.pathname.startsWith(path));
    const isOnDashboardPath = url.pathname.startsWith('/dashboard');

    // if (token && isOnAuthPath) {
    //     // If user is already logged in, redirect them to dashboard
    //     return NextResponse.redirect(new URL('/dashboard', request.url));
    // }

    if (!token && isOnDashboardPath) {
        // If user is not logged in and trying to access dashboard, redirect them to sign-in page
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

// Middleware will run on these paths
export const config = {
    matcher: ['/', '/sign-in', '/sign-up', '/verify/:path*', '/dashboard/:path*'],
};
