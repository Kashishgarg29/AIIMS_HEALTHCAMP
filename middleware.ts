import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

const roleRoutes: Record<string, string[]> = {
    HOSPITAL_ADMIN: ['/dashboard/admin', '/dashboard/event'],
    EVENT_USER: ['/dashboard/event'],
    SCHOOL_REP: ['/dashboard/school', '/dashboard/event'],
}

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value

    // Public routes (no auth needed)
    if (
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/requests') ||
        request.nextUrl.pathname === '/'
    ) {
        return NextResponse.next()
    }

    // Dashboard protection
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const payload = await decrypt(sessionCookie)
            const userRole = payload?.user?.role as string

            // Verify Role RBAC mapping
            const allowedPrefixes = roleRoutes[userRole] || []
            const isValid = allowedPrefixes.some(prefix =>
                request.nextUrl.pathname.startsWith(prefix)
            )

            if (!isValid) {
                // Fallback redirection based on role
                if (userRole === 'HOSPITAL_ADMIN') {
                    return NextResponse.redirect(new URL('/dashboard/admin', request.url))
                }
                if (userRole === 'EVENT_USER') {
                    return NextResponse.redirect(new URL('/dashboard/event', request.url))
                }
                if (userRole === 'SCHOOL_REP') {
                    return NextResponse.redirect(new URL('/dashboard/school', request.url))
                }
                return NextResponse.redirect(new URL('/', request.url))
            }

        } catch (error) {
            // Invalid token
            request.cookies.delete('session')
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
