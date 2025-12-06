"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RecruiterVerificationPage() {
    const companies = useQuery(api.companies.get);
    const updateStatus = useMutation(api.companies.updateStatus);

    const handleApprove = async (id: string) => {
        // @ts-ignore
        await updateStatus({ id, status: "Verified" });
    };

    const handleReject = async (id: string) => {
        // @ts-ignore
        await updateStatus({ id, status: "Rejected" });
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Recruiter Verification</h1>
                    <p className="text-muted-foreground">Review and verify company signups.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!companies ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading companies...</TableCell>
                                </TableRow>
                            ) : (
                                companies.map((company) => (
                                    <TableRow key={company._id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            {company.name}
                                        </TableCell>
                                        <TableCell>{company.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{company.plan || "Free"}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    company.status === "Verified" ? "default" :
                                                        company.status === "Pending" ? "secondary" : "destructive"
                                                }
                                                className={
                                                    company.status === "Verified" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                                        company.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                                                            "bg-red-100 text-red-700 hover:bg-red-200"
                                                }
                                            >
                                                {company.status || "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {(company.status === "Pending" || !company.status) && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleApprove(company._id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleReject(company._id)}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
