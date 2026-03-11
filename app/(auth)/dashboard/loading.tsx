import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 ">Loading Workspace</h2>
            <p className="text-slate-500 max-w-sm text-center">Fetching your latest data securely. Please wait a moment...</p>
        </div>
    );
}
