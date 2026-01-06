"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function RecruitersContent() {
    const recruiters = useQuery(api.recruiters.getAllRecruiters);
    const verifyRecruiter = useMutation(api.recruiters.verifyRecruiter);
    const updatePlan = useMutation(api.recruiters.updateRecruiterPlan);
    const deleteRecruiter = useMutation(api.recruiters.deleteRecruiter);

    const handleVerify = async (userId: string, status: string) => {
        try {
            await verifyRecruiter({ userId: userId as any, status });
            toast.success(`Recruiter ${status} successfully`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (recruiters === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recruiters</h1>
                <p className="text-muted-foreground">
                    Manage recruiter accounts, verification, and subscriptions.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Recruiters</CardTitle>
                    <CardDescription>A list of all registered recruiters on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table className="min-w-[1000px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recruiters.map((recruiter) => (
                                <TableRow key={recruiter._id}>
                                    <TableCell className="font-medium">{recruiter.name}</TableCell>
                                    <TableCell>{recruiter.email}</TableCell>
                                    <TableCell>
                                        {recruiter.company?.name || "No Company"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                recruiter.verificationStatus === "verified"
                                                    ? "default"
                                                    : recruiter.verificationStatus === "rejected"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {recruiter.verificationStatus || "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{recruiter.plan || "Free"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {recruiter.verificationStatus !== "verified" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleVerify(recruiter._id, "verified")}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                            )}
                                            {recruiter.verificationStatus !== "rejected" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                                    onClick={() => handleVerify(recruiter._id, "rejected")}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this recruiter? This action cannot be undone.")) {
                                                        try {
                                                            await deleteRecruiter({ userId: recruiter._id });
                                                            toast.success("Recruiter deleted");
                                                        } catch (e) {
                                                            toast.error("Failed to delete");
                                                        }
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recruiters.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No recruiters found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
