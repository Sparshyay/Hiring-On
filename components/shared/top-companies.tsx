"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetTopCompanies } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function TopCompanies() {
    const companies = useGetTopCompanies();

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Top Hiring Companies</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Join the teams that are shaping the future. Work with industry leaders.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {!companies ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-xl border bg-slate-50 p-4 flex flex-col items-center justify-center gap-2">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))
                    ) : (
                        companies.map((company) => (
                            <Card key={company._id} className="group hover:shadow-lg transition-all cursor-pointer border-slate-100 hover:border-primary/20">
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-2xl font-bold text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        {company.logo}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{company.name}</h3>
                                        <p className="text-sm text-muted-foreground">{company.jobs} Open Jobs</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
