import { getStaffUsers } from "@/services/admin.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import AddStaffModal from "../AddStaffModal";
import RemoveStaffButton from "../../components/RemoveStaffButton";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StaffDirectoryPage() {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        redirect("/dashboard");
    }

    const staff = await getStaffUsers(["EVENT_USER"]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight  text-blue-900 dark:text-slate-50">Staff Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your medical team and platform administrators.</p>
                </div>
                <AddStaffModal />
            </div>

            <Card className="shadow-sm bg-gradient-to-br from-indigo-50 to-white border-none bg-white dark:bg-slate-950">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        <CardTitle>Medical Team</CardTitle>
                    </div>
                    <CardDescription>View and manage staff accounts.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {staff.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 bg-gradient-to-br from-indigo-50 to-white dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                            <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No staff accounts found.</p>
                            <p className="text-sm text-slate-500 mt-1">Get started by adding your first medical staff member.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staff.map((member: any) => (
                                <div key={member.id} className="flex bg-gradient-to-br from-indigo-50 to-white flex-col p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-slate-100 leading-none capitalize">{member.name}</p>
                                                <Badge variant="secondary" className={`mt-2 font-bold text-[10px] px-2.5 py-0.5 border-0 uppercase tracking-widest ${member.role === 'HOSPITAL_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {member.role === 'HOSPITAL_ADMIN' ? 'Admin' : 'Doctor'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <RemoveStaffButton userId={member.id} />
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-900 space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-bold uppercase tracking-tighter text-[10px] w-12">Phone:</span>
                                            <span className="font-mono">{member.phone || "Not provided"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-bold uppercase tracking-tighter text-[10px] w-12">Email:</span>
                                            <span className="truncate">{member.email || "Not provided"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
