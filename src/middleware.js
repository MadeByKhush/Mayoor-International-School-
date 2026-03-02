import { NextResponse } from 'next/server';

export async function middleware(req) {
    const res = NextResponse.next();

    // Supabase auth token is usually stored in cookies when doing server-side auth,
    // or we can just check if any session cookie exists. Wait, if the user was using Client-side auth,
    // we might need to check the sb-...-auth-token cookie.

    // Let's check for any cookie that looks like a Supabase auth token
    const authCookie = req.cookies.getAll().find(cookie => cookie.name.includes('-auth-token') || cookie.name === 'sb-auth-token');

    if (!authCookie) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
