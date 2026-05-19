import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './auth';

export async function proxy(request: NextRequest) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const session = isDemo ? null : await auth();
  const { pathname } = request.nextUrl;
  const isLoggedIn = isDemo || !!session?.user;
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
