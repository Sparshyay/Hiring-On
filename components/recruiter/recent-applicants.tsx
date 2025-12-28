"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const RECENT_APPLICANTS = [
    { id: 1, name: "Sarah Williams", role: "Product Designer", time: "2m ago", status: "New", avatar: "" },
    { id: 2, name: "Michael Chen", role: "Frontend Developer", time: "15m ago", status: "New", avatar: "" },
    { id: 3, name: "Jessica Taylor", role: "Product Designer", time: "1h ago", status: "Review", avatar: "" },
    { id: 4, name: "David Kim", role: "Backend Engineer", time: "2h ago", status: "New", avatar: "" },
    { id: 5, name: "Emily Davis", role: "Marketing Manager", time: "5h ago", status: "Shortlisted", avatar: "" },
];

export function RecentApplicants() {
    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-slate-900">Recent Applicants</CardTitle>
                <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">View All</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {RECENT_APPLICANTS.map((applicant) => (
                        <div key={applicant.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-slate-100">
                                    <AvatarImage src={applicant.avatar} />
                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">
                                        {applicant.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-sm text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                                        {applicant.name}
                                    </div>
                                    <div className="text-xs text-slate-500 line-clamp-1">
                                        Applied for <span className="text-slate-700 font-medium">{applicant.role}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-slate-100 text-slate-600">
                                    {applicant.status}
                                </Badge>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {applicant.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-4 text-xs h-9 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-200">
                    View All Applications <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            </CardContent>
        </Card>
    );
}
