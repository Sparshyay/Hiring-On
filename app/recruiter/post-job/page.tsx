"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateJob, useGetTopCompanies } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PostJobPage() {
    const router = useRouter();
    const createJob = useCreateJob();
    const companies = useGetTopCompanies(); // In real app, this would be the recruiter's company

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        companyId: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",
        tags: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.companyId && companies && companies.length > 0) {
                // Fallback to first company if not selected (for demo)
                formData.companyId = companies[0]._id;
            }

            await createJob({
                title: formData.title,
                companyId: formData.companyId as any,
                location: formData.location,
                type: formData.type,
                salary: formData.salary,
                description: formData.description,
                requirements: formData.requirements.split("\n").filter(line => line.trim() !== ""),
                tags: formData.tags.split(",").map(tag => tag.trim()),
            });

            router.push("/recruiter");
        } catch (error) {
            console.error("Failed to post job:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Post a New Job</CardTitle>
                        <CardDescription>Submit your job opening for review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Select
                                        value={formData.companyId}
                                        onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies?.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. San Francisco, CA or Remote"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Job Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary Range</Label>
                                    <Input
                                        id="salary"
                                        placeholder="e.g. $120k - $160k"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        placeholder="e.g. React, TypeScript, Next.js"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Job Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detailed description of the role..."
                                    className="min-h-[150px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirements">Requirements (one per line)</Label>
                                <Textarea
                                    id="requirements"
                                    placeholder="• 5+ years experience&#10;• Strong communication skills"
                                    className="min-h-[150px]"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Submitting..." : "Submit for Review"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
