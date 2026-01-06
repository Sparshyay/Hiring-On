"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building2, MapPin, Globe, Mail, Phone, User, ExternalLink, Calendar } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export function CompanyDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as Id<"companies">;

    const company = useQuery(api.companies.getById, { id: companyId });

    if (company === undefined) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (company === null) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px]">
                <h2 className="text-xl font-semibold text-slate-900">Company Not Found</h2>
                <Button variant="link" onClick={() => router.push("/admin/companies")}>
                    Back to Companies
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-xl border bg-white shadow-sm flex items-center justify-center p-4">
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                        <Building2 className="w-12 h-12 text-slate-300" />
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                        <Badge variant={company.status === "Active" ? "default" : "secondary"}>
                            {company.status || "Active"}
                        </Badge>
                    </div>

                    <p className="text-lg text-slate-600 max-w-2xl">{company.description || "No description provided."}</p>

                    <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-500">
                        {company.location && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100">
                                <MapPin className="w-3.5 h-3.5" /> {company.location}
                            </span>
                        )}
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:text-blue-800 transition-colors">
                                <Globe className="w-3.5 h-3.5" /> Website
                            </a>
                        )}
                        {company.industry && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100">
                                <Building2 className="w-3.5 h-3.5" /> {company.industry}
                            </span>
                        )}
                        {(company as any).size && (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100">
                                <User className="w-3.5 h-3.5" /> {(company as any).size} Employees
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">Edit Details</Button>
                    <Button variant="destructive">Suspend</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content: Stats & Lists */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{company.jobCount}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Internships</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{company.internshipCount}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="jobs">Jobs History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {company.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">Company Description</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {company.description || "No detailed description available."}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Office Location</h4>
                                            <p className="text-sm text-slate-600">{company.location || "Not listed"}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Industry</h4>
                                            <p className="text-sm text-slate-600">{company.industry || "Not listed"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="jobs">
                            <div className="p-8 text-center text-slate-500 border rounded-lg bg-slate-50 border-dashed">
                                Job history listing coming soon.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar: Recruiter Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Owner / Recruiter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.recruiter ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                            {company.recruiter.name?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{company.recruiter.name}</div>
                                            <div className="text-xs text-slate-500">Main Admin</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t">
                                        <a href={`mailto:${company.recruiter.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                                            <Mail className="w-4 h-4" /> {company.recruiter.email}
                                        </a>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                                        <Link href={`/admin/recruiters/${company.recruiter.id}`}>View Recruiter</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 italic">No recruiter linked.</div>
                            )}
                        </CardContent>
                    </Card>

                    {(company as any).hrDetails && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">HR Contact</CardTitle>
                                <CardDescription>Public contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>{(company as any).hrDetails.name || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span>{(company as any).hrDetails.email || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span>{(company as any).hrDetails.phone || "N/A"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
