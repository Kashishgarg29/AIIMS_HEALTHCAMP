import { getVisitRequests, approveVisitRequest, getFormTemplates, getStaffUsers, getActiveEvents, getCompletedEvents } from "@/services/admin.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import TemplateActions from "./TemplateActions";
import ManageDoctorsModal from "./ManageDoctorsModal";
import ManageDateModal from "./ManageDateModal";
import SchoolDetailsModal from "@/components/modules/SchoolDetailsModal";
import { getSession } from "@/lib/auth";
import DeleteEventButton from "../components/DeleteEventButton";
import CreateEventModal from "./CreateEventModal";
import AddStaffModal from "./AddStaffModal";
import Link from "next/link";
import RemoveStaffButton from "../components/RemoveStaffButton";
import ApproveRequestModal from "./ApproveRequestModal";
import { CheckCircle2, AlertCircle, Calendar, Users, Activity, Clock, FileText, MapPin, GraduationCap, Phone, User, LayoutTemplate } from "lucide-react";

// Mock helper to simulate "Recent Activity" from existing data
function getRecentActivity(completedEvents: any[], templates: any[], _staff: any[]) {
    const activity: any[] = [];

    completedEvents.slice(0, 3).forEach(evt => {
        activity.push({
            id: `evt-${evt.id}`,
            date: new Date(evt.date),
            type: 'event_completed',
            title: `Camp Completed at ${evt.school?.name}`,
            description: `${evt.eventUsers?.length || 0} doctors participated`,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/20'
        });
    });

    templates.slice(0, 2).forEach(t => {
        activity.push({
            id: `tmpl-${t.id}`,
            date: new Date(t.createdAt),
            type: 'template_created',
            title: `New Schema: ${t.name}`,
            description: `${t.sections?.length || 0} sections defined`,
            icon: LayoutTemplate,
            color: 'text-indigo-500',
            bg: 'bg-indigo-100 dark:bg-indigo-900/20'
        });
    });

    return activity.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
}

export default async function AdminDashboard() {
    const session = await getSession();

    const requests = await getVisitRequests();
    const templates = await getFormTemplates();
    const staff = await getStaffUsers();
    const activeEvents = await getActiveEvents();
    const completedEvents = await getCompletedEvents();

    const pendingRequests = requests.filter((r: any) => r.status === 'PENDING');
    const availableDoctors = staff.filter((s: any) => s.role === 'EVENT_USER');

    const totalEvents = activeEvents.length + completedEvents.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight  text-blue-900 dark:text-slate-50">Admin Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage incoming school requests and active health camp events.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 border-blue-100 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Events</p>
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{totalEvents}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 border-indigo-100 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Active Events</p>
                            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{activeEvents.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 border-emerald-100 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Staff</p>
                            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{staff.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 border-amber-100 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending Requests</p>
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{pendingRequests.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-8">
                {/* Pending Requests Table - Full Width */}
                {/* Pending Requests Table */}
                <Card className="shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border-none overflow-hidden h-fit">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-slate-900/50 dark:to-slate-950 rounded-t-2xl pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            <CardTitle className="text-amber-900 dark:text-amber-400">Review Camp Requests</CardTitle>
                        </div>
                        <CardDescription>Schools waiting for event approval and medical team assignment.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">All caught up!</p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">There are no pending school requests waiting for approval at this time.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 h-10">School Details</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 h-10">Requested Date</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 text-center h-10">Strength</TableHead>
                                        <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400 h-10 pr-6">Management</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRequests.map((req: any) => (
                                        <TableRow key={req.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors border-slate-100 dark:border-slate-800">
                                            <TableCell className="py-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 shadow-sm border border-orange-200 dark:border-orange-800/30">
                                                        <GraduationCap className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100 capitalize truncate text-base">{req.schoolName}</span>
                                                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                                                            <MapPin className="h-3 w-3 text-slate-400" />
                                                            <span className="truncate max-w-[150px]">{req.address}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 font-bold text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-amber-500/70" />
                                                    {format(new Date(req.preferredDate), 'MMM d, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-0 font-bold px-3 py-1 text-xs">
                                                    {req.studentStrength}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex justify-end pr-2">
                                                    <ApproveRequestModal
                                                        request={req}
                                                        templates={templates}
                                                        availableDoctors={availableDoctors}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-8">
                    {/* Active Form Templates - Enhanced with blue gradient */}
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-none overflow-hidden h-fit">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-slate-900/50 dark:to-slate-950 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <CardTitle className="text-blue-900 dark:text-blue-400">Global Form Schemas</CardTitle>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-blue-600" asChild>
                                    <Link href="/dashboard/admin/templates">View All &rarr;</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {templates.length === 0 ? (
                                <div className="p-8 text-center text-sm font-medium text-slate-500">
                                    No form templates found.
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {templates.slice(0, 4).map((t: any, index: number) => (
                                        <div key={t.id} className={`flex justify-between items-center p-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors group ${index !== Math.min(templates.length, 4) - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/30">
                                                    <LayoutTemplate className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.sections.length} Sections Defined</p>
                                                </div>
                                            </div>
                                            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                                <TemplateActions template={t} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent System Activity Widget - Enhanced with indigo gradient */}
                    {/* <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-none overflow-hidden h-fit">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900/50 dark:to-slate-950 rounded-t-2xl pb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                <CardTitle className="text-indigo-900 dark:text-indigo-400">System Activity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {(() => {
                                const activityFeed = getRecentActivity(completedEvents, templates, staff);

                                if (activityFeed.length === 0) {
                                    return (
                                        <div className="p-8 text-center text-sm text-slate-500">
                                            No recent activity found.
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex flex-col">
                                        {activityFeed.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`p-4 flex items-start gap-4 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-colors ${index !== activityFeed.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                                                >
                                                    <div className={`h-8 w-8 rounded-full ${item.bg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-slate-200 dark:border-slate-800/30`}>
                                                        <Icon className={`h-4 w-4 ${item.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 shrink-0">
                                                        {format(item.date, 'MMM d')}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </CardContent> */}
                    {/* <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 text-center rounded-b-2xl">
                            <Link href="/dashboard/admin/events" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                                View Full Event History
                            </Link>
                        </div> */}
                    {/* </Card> */}
                </div>
            </div>
        </div>
    );
}
