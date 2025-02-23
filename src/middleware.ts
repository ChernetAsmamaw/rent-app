import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/api/properties"];
const authRoutes = ["/sign-in", "/sign-up"];
const apiRoutes = ["/api/users/role"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const url = new URL(req.url);
  const isPublic = publicRoutes.includes(url.pathname);
  const isAuthRoute = authRoutes.includes(url.pathname);
  const isApiRoute = url.pathname.startsWith('/api/');
  const isRoleRoute = url.pathname === '/select-role';
  const { userId } = await auth()


  // Allow public routes and API routes
  if (isPublic || apiRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route
  if (!userId && !isPublic) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated and on auth routes, redirect to role selection
  if (userId && isAuthRoute) {
    return NextResponse.redirect(new URL('/select-role', req.url));
  }

  // Allow access to role selection page and API
  if (isRoleRoute || isApiRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
