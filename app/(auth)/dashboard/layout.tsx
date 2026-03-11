import TopNav from "@/components/modules/TopNav";
import Sidebar from "@/components/modules/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
            <div className="md:hidden">
                <TopNav />
            </div>
            <Sidebar />
            <main className="flex-1 md:ml-64 transition-all duration-300">
                <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
