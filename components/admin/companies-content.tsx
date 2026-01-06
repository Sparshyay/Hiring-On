"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Building2, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FilterBar } from "@/components/shared/filter-bar";

export function CompaniesContent() {
    const allCompanies = useQuery(api.companies.get);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Client-side filtering
    const companies = allCompanies?.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filters["status"] ? c.status === filters["status"] : true;

        return matchesSearch && matchesStatus;
    });

    if (!allCompanies) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Companies</h1>
                    <p className="text-slate-500">Manage registered companies and their profiles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            <FilterBar
                searchPlaceholder="Search companies by name or location..."
                onSearchChange={setSearchQuery}
                onFilterChange={setFilters}
                filterGroups={[
                    {
                        id: "status",
                        label: "Status",
                        options: [
                            { label: "Active", value: "Active" },
                            { label: "Pending", value: "Pending" },
                            { label: "Suspended", value: "Suspended" }
                        ]
                    }
                ]}
            />

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Registered Companies ({companies?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table className="min-w-[1000px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Jobs Posted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-32 text-slate-500">
                                        No companies found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                companies?.map((company) => (
                                    <TableRow key={company._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg border bg-slate-50 flex items-center justify-center overflow-hidden">
                                                    {company.logo ? (
                                                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{company.name}</div>
                                                    <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> {company.website || "No website"}
                                                    </a>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <MapPin className="w-4 h-4" />
                                                {company.location || "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={company.status === "Pending" ? "secondary" : "default"} className={
                                                company.status === "Pending" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                                            }>
                                                {company.status || "Active"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono">
                                                {company.jobCount || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/companies/${company._id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Eye className="w-4 h-4 text-slate-500" />
                                                </Button>
                                            </Link>
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
