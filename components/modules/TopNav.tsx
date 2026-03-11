import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function TopNav() {
    const session = await getSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-6">
                    <span className="font-bold text-lg text-blue-700 dark:text-blue-400">
                        🏥 HealthCamp Manager
                    </span>

                    {session?.user && (
                        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                            {session.user.role === "HOSPITAL_ADMIN" && (
                                <>
                                    <Link href="/dashboard/admin" className="hover:text-blue-600 transition-colors">Admin Dashboard</Link>
                                    <Link href="/dashboard/admin/templates" className="hover:text-blue-600 transition-colors">Templates</Link>
                                </>
                            )}
                            {session.user.role === "EVENT_USER" && (
                                <Link href="/dashboard/event" className="hover:text-blue-600 transition-colors">My Events</Link>
                            )}
                            {session.user.role === "SCHOOL_REP" && (
                                <Link href="/dashboard/school" className="hover:text-blue-600 transition-colors font-semibold text-blue-700 dark:text-blue-400">School Portal</Link>
                            )}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <LanguageSwitcher />
                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 hidden sm:inline-block">Role: <span className="font-semibold text-slate-700 dark:text-slate-300">{session.user.role}</span></span>
                            <form action="/api/auth/logout" method="POST">
                                <Button variant="outline" size="sm" type="submit">Logout</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
