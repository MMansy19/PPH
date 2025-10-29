import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // For now, we'll use a simple approach and let client-side auth handle the routing
  // This avoids build-time issues with server components in middleware
  
  const { pathname } = request.nextUrl
  
  // Check for auth token in cookies (simple check)
  const hasAuthCookie = request.cookies.has('sb-access-token') || 
                        request.cookies.has('supabase-auth-token') ||
                        Array.from(request.cookies.getAll()).some(cookie => 
                          cookie.name.includes('supabase') || cookie.name.includes('sb-')
                        )

  // Define auth routes that should redirect authenticated users
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/app', '/dashboard', '/profile', '/settings']
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/about', '/contact']

  // Redirect authenticated users away from auth pages (basic check)
  if (hasAuthCookie && authRoutes.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users away from protected routes
  if (!hasAuthCookie && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|.*\\.).*)',
  ],
}