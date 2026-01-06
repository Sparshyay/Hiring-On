"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Shield, Ban, Eye } from "lucide-react";

const users = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Job Seeker", status: "Verified", joined: "2 days ago" },
    { id: 2, name: "Sarah Williams", email: "sarah@techcorp.com", role: "Recruiter", status: "Pending", joined: "5 days ago" },
    { id: 3, name: "Michael Chen", email: "michael@example.com", role: "Job Seeker", status: "Verified", joined: "1 week ago" },
    { id: 4, name: "Jessica Davis", email: "jessica@startup.io", role: "Recruiter", status: "Blocked", joined: "2 weeks ago" },
];

export function UsersContent() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-muted-foreground">Manage user accounts and permissions.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-9 bg-white" />
                    </div>
                    <Button>Add User</Button>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left p-4 font-medium text-slate-500">User</th>
                                <th className="text-left p-4 font-medium text-slate-500">Role</th>
                                <th className="text-left p-4 font-medium text-slate-500">Status</th>
                                <th className="text-left p-4 font-medium text-slate-500">Joined</th>
                                <th className="text-right p-4 font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={user.role === "Recruiter" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={user.status === "Verified" ? "default" : user.status === "Pending" ? "secondary" : "destructive"}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">{user.joined}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" title="View Profile">
                                                <Eye className="w-4 h-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Verify User">
                                                <Shield className="w-4 h-4 text-green-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Block User">
                                                <Ban className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
