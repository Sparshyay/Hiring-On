"use client";

import { Button } from "@/components/ui/button";
import { FeaturedCard } from "./featured-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Jobs Data
const MOCK_INTERNSHIPS = [
    {
        _id: "1",
        title: "Marketing Internship",
        company: { name: "Innoknowvex", logo: undefined },
        location: "In Office",
        type: "Full-Time",
        salary: "$200-250k",
        logoColor: "bg-blue-500"
    },
    {
        _id: "2",
        title: "Architect Internship",
        company: { name: "Figments Experience Design", logo: undefined },
        location: "Pune",
        type: "Contract",
        salary: "$85/hr",
        logoColor: "bg-pink-500"
    },
    {
        _id: "3",
        title: "Brand Promotion Internship",
        company: { name: "Innoknowvex", logo: undefined },
        location: "In Office",
        type: "Full-Time",
        salary: "$200-250k",
        logoColor: "bg-purple-500"
    },
    {
        _id: "4",
        title: "Business Development Internship",
        company: { name: "Innoknowvex", logo: undefined },
        location: "Remote",
        type: "Part-Time",
        salary: "$150-200k",
        logoColor: "bg-amber-500"
    }
];

const MOCK_JOBS = [
    {
        _id: "5",
        title: "Software Engineer III",
        company: { name: "Google", logo: undefined },
        location: "Bangalore",
        type: "In Office",
        salary: "$200-250k",
        logoColor: "bg-blue-600"
    },
    {
        _id: "6",
        title: "Inside Sales Specialist",
        company: { name: "Lenovo India", logo: undefined },
        location: "Bangalore Urban",
        type: "In Office",
        salary: "$85/hr",
        logoColor: "bg-red-500"
    },
    {
        _id: "7",
        title: "GCM - Supply Chain",
        company: { name: "Lenovo India", logo: undefined },
        location: "Gurgaon",
        type: "In Office",
        salary: "$150-180k",
        logoColor: "bg-purple-600"
    },
    {
        _id: "8",
        title: "IR and Admin Executive",
        company: { name: "Larsen & Toubro", logo: undefined },
        location: "Agra",
        type: "In Office",
        salary: "$120-150k",
        logoColor: "bg-slate-700"
    }
];

export function FeaturedJobs() {
    // Use mock data instead of API
    const internships = MOCK_INTERNSHIPS;
    const jobs = MOCK_JOBS;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-600"></div>
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Featured Opportunities</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-600"></div>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Opportunity</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Hand-picked internships and jobs from top companies actively hiring talented individuals
                    </p>
                </div>

                {/* Internships Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                Internships
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">Kickstart your career with these opportunities</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                            <Link href="/jobs?type=internship">
                                View all <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {internships.map((job) => (
                            <FeaturedCard
                                key={job._id}
                                id={job._id}
                                title={job.title}
                                company={job.company.name}
                                location={job.location}
                                type={job.type}
                                salary={job.salary}
                                logo={job.company.logo}
                                logoColor={job.logoColor}
                                variant="internship"
                            />
                        ))}
                    </div>
                </div>

                {/* Jobs Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                Jobs
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">Find jobs that fit your career aspirations</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                            <Link href="/jobs?type=job">
                                View all <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {jobs.map((job) => (
                            <FeaturedCard
                                key={job._id}
                                id={job._id}
                                title={job.title}
                                company={job.company.name}
                                location={job.location}
                                type={job.type}
                                salary={job.salary}
                                logo={job.company.logo}
                                logoColor={job.logoColor}
                                variant="job"
                            />
                        ))}
                    </div>
                </div>

                {/* View All CTA */}
                <div className="mt-16 text-center">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 rounded-full shadow-lg shadow-blue-200" asChild>
                        <Link href="/jobs">
                            Explore All Opportunities <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
