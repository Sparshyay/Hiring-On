"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { CompanyCarousel } from "./company-carousel";

export function HeroSection() {
    return (
        <section className="relative pt-20 overflow-hidden bg-white">
            <div className="container mx-auto px-4 pb-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 space-y-8"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Find Your <span className="text-primary">Dream Job</span> <br />
                            With <span className="text-secondary">HIRING-ON</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-xl">
                            The modern platform connecting top talent with world-class companies.
                            Start your journey today with verified opportunities.
                        </p>

                        {/* Search Box */}
                        <div className="p-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl flex flex-col md:flex-row gap-2">
                            <div className="flex-1 flex items-center px-4 h-12 bg-slate-50 rounded-xl">
                                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                                <Input
                                    placeholder="Job title, skills, or company"
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base"
                                />
                            </div>
                            <div className="flex-1 flex items-center px-4 h-12 bg-slate-50 rounded-xl">
                                <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                                <Input
                                    placeholder="Location"
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base"
                                />
                            </div>
                            <Button size="lg" className="h-12 px-8 text-lg font-medium" asChild>
                                <a href="/jobs">Search</a>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-slate-900">Popular:</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full">Frontend Dev</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full">Product Design</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full">Marketing</span>
                        </div>
                    </motion.div>

                    {/* Right Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 bg-gradient-to-br from-blue-50 to-orange-50 rounded-[2rem] p-8 aspect-square flex items-center justify-center">
                            {/* Placeholder for illustration - using CSS shapes for now */}
                            <div className="relative w-full h-full">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="text-4xl font-bold text-primary">5k+</div>
                                        <div className="text-sm text-muted-foreground">Jobs Posted</div>
                                    </div>
                                </div>

                                {/* Floating cards */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute top-10 right-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">💼</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Hired!</div>
                                            <div className="text-xs text-muted-foreground">Just now</div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                                    className="absolute bottom-10 left-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">⭐</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Top Rated</div>
                                            <div className="text-xs text-muted-foreground">Company</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Background blobs */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl -z-10" />
                    </motion.div>

                </div>
            </div>

            <CompanyCarousel />
        </section>
    );
}
