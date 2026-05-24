import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sms_token');
  const isLogin = request.nextUrl.pathname.startsWith('/login');
  const isApi = request.nextUrl.pathname.startsWith('/api');

  if (isApi) return NextResponse.next();

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && isLogin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
