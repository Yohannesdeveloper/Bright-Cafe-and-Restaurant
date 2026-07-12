import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Runs at the edge — zero cold-start, no server action round-trip.
// Protects all /admin/* routes except /admin/login.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard admin routes (not login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
