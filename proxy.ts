import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/jobs(.*)',
    '/api(.*)',
    '/blogs(.*)',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
])

const isRecruiterRoute = createRouteMatcher(['/recruiter(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect()
    }

    // We can add custom role based redirection logic here if we have the role in the session claims
    // For now, we rely on the client-side/layout checks as well, but basic auth is enforced here.
    // Ideally, we sync role to Clerk publicMetadata to enforce it here.

    // Example of role enforcement if we had metadata:
    // const { sessionClaims } = await auth()
    // const role = sessionClaims?.metadata?.role

    // Keeping it simple for now: valid session for non-public routes.
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
