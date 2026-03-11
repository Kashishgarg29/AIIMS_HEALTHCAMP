import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
    Home, Calendar, FileText, Users, Building, Activity, LogOut
} from "lucide-react";
import SidebarLinks from "./SidebarLinks";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Sidebar() {
    const session = await getSession();
    const role = session?.user?.role;

    if (!session?.user) return null;

    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white dark:bg-slate-900 border-slate-800 md:block transition-all duration-300 shadow-sm">
            <div className="flex h-full flex-col overflow-y-auto">
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-2 font-bold text-lg text-blue-700 dark:text-blue-400 font-poppins">
                        <Activity className="h-6 w-6 text-blue-600" /> HealthCamp
                    </span>
                </div>

                <div className="flex-1 px-4 py-6">
                    <SidebarLinks role={role} />
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="mb-4 px-2">
                        {/* <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session.user.name || "User"}</p>
                        <p className="text-sm text-slate-500 truncate">{session.user.email || "No email"}</p> */ }
                        <p className="text-xs mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                            {role}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <LanguageSwitcher />
                        <form action="/api/auth/logout" method="POST">
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-100 dark:border-red-900/30" type="submit">
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </aside>
    );
}


