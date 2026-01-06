"use client";

import { Button } from "@/components/ui/button";
import { FeaturedCard } from "./featured-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ScrollCarousel } from "./scroll-carousel";

// Mock Jobs Data with company logos and colors
const MOCK_INTERNSHIPS = [
    {
        _id: "1",
        title: "Marketing Internship",
        company: { name: "Innoknowvex", logo: "IK" },
        location: "In Office",
        type: "Full-Time",
        salary: "₹2K-10K/Month",
        logoColor: "bg-blue-600",
        bannerColor: "from-blue-500 to-blue-600"
    },
    {
        _id: "2",
        title: "Architect Internship",
        company: { name: "Figments", logo: "F" },
        location: "Pune",
        type: "Contract",
        salary: "₹5K-8K/Month",
        logoColor: "bg-pink-600",
        bannerColor: "from-pink-500 to-rose-500"
    },
    {
        _id: "3",
        title: "Brand Promotion Internship",
        company: { name: "Innoknowvex", logo: "IK" },
        location: "In Office",
        type: "Full-Time",
        salary: "₹2K-10K/Month",
        logoColor: "bg-purple-600",
        bannerColor: "from-purple-500 to-indigo-600"
    },
    {
        _id: "4",
        title: "Business Development Internship",
        company: { name: "Innoknowvex", logo: "IK" },
        location: "Remote",
        type: "Part-Time",
        salary: "₹15K-20K/Month",
        logoColor: "bg-amber-600",
        bannerColor: "from-amber-400 to-orange-500"
    }
];

const MOCK_JOBS = [
    {
        _id: "5",
        title: "Software Engineer III",
        company: { name: "Google", logo: "G" },
        location: "Bangalore",
        type: "In Office",
        salary: "₹20-25L/Year",
        logoColor: "bg-blue-600",
        bannerColor: "from-blue-500 to-blue-600"
    },
    {
        _id: "6",
        title: "Inside Sales Specialist",
        company: { name: "Lenovo", logo: "L" },
        location: "Bangalore Urban",
        type: "In Office",
        salary: "₹8-12L/Year",
        logoColor: "bg-red-600",
        bannerColor: "from-red-500 to-rose-600"
    },
    {
        _id: "7",
        title: "GCM - Supply Chain",
        company: { name: "Lenovo", logo: "L" },
        location: "Gurgaon",
        type: "In Office",
        salary: "₹15-18L/Year",
        logoColor: "bg-purple-600",
        bannerColor: "from-purple-500 to-indigo-600"
    },
    {
        _id: "8",
        title: "IR and Admin Executive",
        company: { name: "L&T", logo: "L&T" },
        location: "Agra",
        type: "In Office",
        salary: "₹12-15L/Year",
        logoColor: "bg-slate-700",
        bannerColor: "from-slate-600 to-slate-700"
    }
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0
    }
};

export function FeaturedJobs() {
    const internships = MOCK_INTERNSHIPS;
    const jobs = MOCK_JOBS;

    const itemClass = "min-w-[85vw] sm:min-w-[45%] md:min-w-[31%] lg:min-w-[23%] snap-center";

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={headerVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
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
                </motion.div>

                {/* Internships Section */}
                <div className="mb-16">
                    <motion.div
                        className="flex items-center justify-between mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                Internships
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">Kickstart your career with these opportunities</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                            <Link href="/internships">
                                View all <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                    >
                        <ScrollCarousel>
                            {internships.map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    className={itemClass}
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <FeaturedCard
                                        id={job._id}
                                        title={job.title}
                                        company={job.company.name}
                                        location={job.location}
                                        type={job.type}
                                        salary={job.salary}
                                        logo={job.company.logo}
                                        logoColor={job.logoColor}
                                        bannerColor={job.bannerColor}
                                        variant="internship"
                                    />
                                </motion.div>
                            ))}
                        </ScrollCarousel>
                    </motion.div>
                </div>

                {/* Jobs Section */}
                <div>
                    <motion.div
                        className="flex items-center justify-between mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                Jobs
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">Find jobs that fit your career aspirations</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                            <Link href="/jobs">
                                View all <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                    >
                        <ScrollCarousel>
                            {jobs.map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    className={itemClass}
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <FeaturedCard
                                        id={job._id}
                                        title={job.title}
                                        company={job.company.name}
                                        location={job.location}
                                        type={job.type}
                                        salary={job.salary}
                                        logo={job.company.logo}
                                        logoColor={job.logoColor}
                                        bannerColor={job.bannerColor}
                                        variant="job"
                                    />
                                </motion.div>
                            ))}
                        </ScrollCarousel>
                    </motion.div>
                </div>

                {/* View All CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 rounded-full shadow-lg shadow-blue-200" asChild>
                        <Link href="/jobs">
                            Explore All Opportunities <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
