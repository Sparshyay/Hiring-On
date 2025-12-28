"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { CompanyCarousel } from "./company-carousel";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock Data for Suggestions
const JOB_SUGGESTIONS = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Marketing Manager"];
const INTERNSHIP_SUGGESTIONS = ["Frontend Intern", "Marketing Intern", "Design Intern", "Data Science Intern", "Product Intern", "Sales Intern"];
const LOCATION_SUGGESTIONS = ["Bangalore, India", "Mumbai, Maharashtra", "Delhi, NCR", "Hyderabad, Telangana", "Pune, Maharashtra", "Chennai, Tamil Nadu", "Remote"];

export function HeroSection() {
    const router = useRouter();
    const [searchType, setSearchType] = useState<"jobs" | "internships">("jobs");
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");

    // Suggestion States
    const [showQuerySuggestions, setShowQuerySuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

    const queryRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);

    // Filter suggestions
    const filteredQuerySuggestions = (searchType === "jobs" ? JOB_SUGGESTIONS : INTERNSHIP_SUGGESTIONS)
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

    const filteredLocationSuggestions = LOCATION_SUGGESTIONS
        .filter(item => item.toLowerCase().includes(location.toLowerCase()))
        .slice(0, 5);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (queryRef.current && !queryRef.current.contains(event.target as Node)) {
                setShowQuerySuggestions(false);
            }
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowLocationSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (location) params.set("location", location);

        const path = searchType === "jobs" ? "/jobs" : "/internships";
        router.push(`${path}?${params.toString()}`);
    };

    return (
        <section className="relative bg-gradient-to-b from-blue-50 via-white to-slate-50 pt-20 pb-16 overflow-hidden">
            {/* Animated Orange Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20"
                    style={{
                        background: "radial-gradient(circle, rgba(255,122,61,0.4) 0%, rgba(255,122,61,0.1) 50%, transparent 70%)",
                    }}
                    animate={{
                        x: ["-20%", "120%"],
                        y: ["0%", "100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                {/* ... existing animations kept but simplified for brevity in this view, assuming other background elements remain if not fully replaced ... */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-15"
                    style={{
                        background: "radial-gradient(circle, rgba(255,122,61,0.5) 0%, rgba(255,122,61,0.2) 40%, transparent 70%)",
                    }}
                    animate={{
                        x: ["100%", "-20%"],
                        y: ["100%", "0%"],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Hero Content */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Find Your Dream{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Career
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Discover thousands of job opportunities and internships from top companies.
                        Your next career move starts here.
                    </motion.p>

                    {/* Enhanced Search Bar */}
                    <motion.div
                        className="bg-white p-2 rounded-full shadow-2xl border border-slate-200 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto items-center relative z-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* 1. Search Type Toggle (Inside) */}
                        <div className="hidden md:flex bg-slate-100 rounded-full p-1 shrink-0">
                            <button
                                onClick={() => setSearchType("jobs")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                                    searchType === "jobs"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                <Briefcase className="w-4 h-4" />
                                Jobs
                            </button>
                            <button
                                onClick={() => setSearchType("internships")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                                    searchType === "internships"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Internships
                            </button>
                        </div>

                        {/* Mobile Toggle (Visible only on small screens) */}
                        <div className="md:hidden flex w-full bg-slate-100 rounded-full p-1 mb-2">
                            <button
                                onClick={() => setSearchType("jobs")}
                                className={cn(
                                    "flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                                    searchType === "jobs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                )}
                            >
                                Jobs
                            </button>
                            <button
                                onClick={() => setSearchType("internships")}
                                className={cn(
                                    "flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                                    searchType === "internships" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                )}
                            >
                                Internships
                            </button>
                        </div>

                        {/* 2. Keyword Search with Suggestions */}
                        <div className="flex-1 relative w-full" ref={queryRef}>
                            <div className="flex items-center px-4 h-12 md:h-14 border-b md:border-b-0 md:border-l md:border-r border-slate-100 w-full">
                                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                                <Input
                                    placeholder={searchType === "jobs" ? "Job title, skills, or company" : "Internship title..."}
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setShowQuerySuggestions(true);
                                    }}
                                    onFocus={() => setShowQuerySuggestions(true)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showQuerySuggestions && filteredQuerySuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Suggested Keywords
                                        </div>
                                        {filteredQuerySuggestions.map((item, index) => (
                                            <button
                                                key={index}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm flex items-center transition-colors"
                                                onClick={() => {
                                                    setQuery(item);
                                                    setShowQuerySuggestions(false);
                                                }}
                                            >
                                                <Search className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                                {item}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. Location Search with Suggestions */}
                        <div className="flex-1 relative w-full" ref={locationRef}>
                            <div className="flex items-center px-4 h-12 md:h-14 w-full">
                                <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                                <Input
                                    placeholder="City, state, or remote"
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        setShowLocationSuggestions(true);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(true)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>

                            {/* Location Suggestions Dropdown */}
                            <AnimatePresence>
                                {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Suggested Locations
                                        </div>
                                        {filteredLocationSuggestions.map((item, index) => (
                                            <button
                                                key={index}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm flex items-center transition-colors"
                                                onClick={() => {
                                                    setLocation(item);
                                                    setShowLocationSuggestions(false);
                                                }}
                                            >
                                                <MapPin className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                                {item}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            size="lg"
                            className="h-12 px-8 rounded-full bg-primary hover:bg-orange-600 text-white font-medium text-base shadow-lg shadow-orange-200 min-w-[120px] m-1"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-3 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <span className="text-sm text-slate-600">Popular:</span>
                        {["Software Engineer", "Product Manager", "UX Designer", "Data Scientist"].map((role) => (
                            <Button
                                key={role}
                                variant="outline"
                                size="sm"
                                className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                    setQuery(role);
                                    setSearchType("jobs");
                                }}
                            >
                                {role}
                            </Button>
                        ))}
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    {[
                        { label: "Active Jobs", value: "10,000+" },
                        { label: "Companies", value: "500+" },
                        { label: "Candidates", value: "50,000+" },
                        { label: "Success Rate", value: "95%" }
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                            <div className="text-sm text-slate-600">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Company Carousel */}
            <CompanyCarousel />
        </section>
    );
}
