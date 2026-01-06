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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Eye, MapPin, Building2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import { FilterBar } from "@/components/shared/filter-bar";

export function InternshipsContent() {
    const internships = useQuery(api.internships.getInternshipsForAdmin);
    const updateStatus = useMutation(api.internships.updateStatus);
    const deleteInternship = useMutation(api.internships.deleteInternship);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    const filteredInternships = internships?.filter(internship => {
        const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (internship.company?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filters["status"] || internship.status === filters["status"];
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: any) => {
        setIsDeleting(id);
        try {
            await deleteInternship({ id });
            toast.success("Internship deleted successfully");
        } catch (error) {
            toast.error("Failed to delete internship");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleStatusChange = async (id: any, newStatus: string) => {
        setIsUpdating(id);
        try {
            await updateStatus({ id, status: newStatus });
            toast.success(`Internship marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(null);
        }
    };

    if (internships === undefined) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Internship Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor and manage all internship listings.
                    </p>
                </div>
            </div>

            <FilterBar
                onSearchChange={setSearchQuery}
                onFilterChange={setFilters}
                searchPlaceholder="Search internships or companies..."
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

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden overflow-x-auto">
                <Table className="min-w-[1200px]">
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900">Role Title</TableHead>
                            <TableHead className="font-semibold text-slate-900">Company</TableHead>
                            <TableHead className="font-semibold text-slate-900">Location</TableHead>
                            <TableHead className="font-semibold text-slate-900">Date Posted</TableHead>
                            <TableHead className="font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInternships?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No internships found matching filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInternships?.map((internship) => (
                                <TableRow key={internship._id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{internship.title}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {internship.duration} • {internship.stipend}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium">{internship.company?.name || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <MapPin className="w-4 h-4" />
                                            {internship.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(internship.postedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={internship.status === "Active" ? "default" : "secondary"}
                                            className={internship.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                        >
                                            {internship.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {internship.status !== "Active" && (
                                                <Button
                                                    onClick={() => handleStatusChange(internship._id, "Active")}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {internship.status === "Active" && (
                                                <Button
                                                    onClick={() => handleStatusChange(internship._id, "Closed")}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                >
                                                    Close
                                                </Button>
                                            )}

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Internship Post?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the internship
                                                            "{internship.title}" and remove it from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(internship._id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
