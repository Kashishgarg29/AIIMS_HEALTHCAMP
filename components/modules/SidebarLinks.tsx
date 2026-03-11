"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FileText, Users } from "lucide-react";

export default function SidebarLinks({ role }: { role: string }) {
    const pathname = usePathname();

    const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        // For admin dashboard, ensure we don't highlight dashboard when we are in templates
        const isStrictActive = href === "/dashboard/admin" ? pathname === href : isActive;

        return (
            <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${isStrictActive
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
            >
                <Icon className={`h-5 w-5 ${isStrictActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="space-y-1">
            {role === "HOSPITAL_ADMIN" && (
                <>
                    <NavLink href="/dashboard/admin" icon={Home} label="Dashboard" />
                    <NavLink href="/dashboard/admin/events" icon={Calendar} label="Health Camps" />
                    <NavLink href="/dashboard/admin/staff" icon={Users} label="Staff Directory" />
                    <NavLink href="/dashboard/admin/templates" icon={FileText} label="Templates" />
                </>
            )}
            {role === "EVENT_USER" && (
                <NavLink href="/dashboard/event" icon={Calendar} label="My Events" />
            )}
            {role === "SCHOOL_REP" && (
                <NavLink href="/dashboard/school" icon={Users} label="School Portal" />
            )}
        </div>
    );
}
