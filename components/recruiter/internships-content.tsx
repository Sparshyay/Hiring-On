"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Loader2, Eye, Edit, Trash2 } from "lucide-react";

import { FilterBar } from "@/components/shared/filter-bar";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function InternshipsContent() {
    const internships = useQuery(api.internships.getMyInternships);
    const deleteInternship = useMutation(api.internships.deleteInternship);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleDelete = async (id: Id<"internships">) => {
        if (!confirm("Are you sure you want to delete this internship? This cannot be undone.")) return;
        try {
            await deleteInternship({ id });
            toast.success("Internship deleted successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete internship.");
        }
    };

    const filteredInternships = internships?.filter(internship => {
        const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filters["status"] || internship.status === filters["status"];
        return matchesSearch && matchesStatus;
    });

    if (internships === undefined) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Internships</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage your active internship listings.
                    </p>
                </div>
                <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
                    <Link href="/recruiter/internships/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post Internship
                    </Link>
                </Button>
            </div>

            <FilterBar
                onSearchChange={setSearchQuery}
                onFilterChange={setFilters}
                searchPlaceholder="Search internships by title..."
                filterGroups={[
                    {
                        id: "status",
                        label: "Status",
                        options: [
                            { label: "Active", value: "Active" },
                            { label: "Closed", value: "Closed" },
                            { label: "Pending", value: "Pending" }
                        ]
                    }
                ]}
            />

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Title</TableHead>
                            <TableHead className="font-semibold text-slate-900">Stipend</TableHead>
                            <TableHead className="font-semibold text-slate-900">Duration</TableHead>
                            <TableHead className="font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="font-semibold text-slate-900">Applicants</TableHead>
                            <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInternships?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No internships found matching your filters.</p>
                                        <Button variant="link" onClick={() => { setSearchQuery(""); setFilters({}); }} className="text-primary">
                                            Clear Filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInternships?.map((internship) => (
                                <TableRow key={internship._id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                        {internship.title}
                                    </TableCell>
                                    <TableCell>{internship.stipend}</TableCell>
                                    <TableCell>{internship.duration}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={internship.status === "Active" ? "default" : "secondary"}
                                            className={internship.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                        >
                                            {internship.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {/* Placeholders for applicants */}
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-500">0</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/internships/${internship._id}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600" title="View Public Page">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-orange-600" title="Edit" disabled>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-red-600"
                                                title="Delete"
                                                onClick={() => handleDelete(internship._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
