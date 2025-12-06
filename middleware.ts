import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/profile(.*)',
    '/onboarding(.*)',
    '/practice/(.*)', // Protect specific practice tests
])

const isPublicRoute = createRouteMatcher([
    '/',
    '/jobs(.*)',
    '/companies(.*)',
    '/events(.*)',
    '/blogs(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/host/signup(.*)', // Allow host signup to be public initially
    '/api/uploadthing(.*)' // If using uploadthing
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
