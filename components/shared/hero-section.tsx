"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, GraduationCap, ChevronRight } from "lucide-react";
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
        <section className="relative bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-20 pb-16 overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)" }}
                    animate={{ scale: [1, 1.2, 1], translate: ["0% 0%", "10% -10%", "0% 0%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
                    style={{ background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)" }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Hero Content */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Find Your Dream{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                            Career
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Discover thousands of job opportunities and internships from top companies.
                        Your next career move starts here.
                    </motion.p>

                    {/* Enhanced Search Bar */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-lg p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto items-center relative z-50 ring-1 ring-slate-200/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* 1. Search Type Toggle */}
                        <div className="hidden md:flex bg-slate-100/50 rounded-2xl p-1 shrink-0 border border-slate-200/50">
                            {[
                                { id: "jobs", label: "Jobs", icon: Briefcase },
                                { id: "internships", label: "Internships", icon: GraduationCap }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSearchType(type.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                        searchType === type.id
                                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                                    )}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex w-full bg-slate-100 rounded-xl p-1 mb-1">
                            {/* ... same mobile toggles ... */}
                            <button onClick={() => setSearchType("jobs")} className={cn("flex-1 py-2 rounded-lg text-sm font-semibold", searchType === "jobs" ? "bg-white shadow-sm" : "text-slate-500")}>Jobs</button>
                            <button onClick={() => setSearchType("internships")} className={cn("flex-1 py-2 rounded-lg text-sm font-semibold", searchType === "internships" ? "bg-white shadow-sm" : "text-slate-500")}>Internships</button>
                        </div>

                        {/* 2. Keyword Search */}
                        <div className="flex-1 relative w-full" ref={queryRef}>
                            <div className="flex items-center px-4 h-12 md:h-14 border-b md:border-b-0 md:border-l md:border-r border-slate-200/60 w-full">
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
                            {/* Suggestions Dropdown (Same as before) */}
                            <AnimatePresence>
                                {showQuerySuggestions && filteredQuerySuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Keywords</div>
                                        {filteredQuerySuggestions.map((item, index) => (
                                            <button key={index} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm flex items-center" onClick={() => { setQuery(item); setShowQuerySuggestions(false); }}><Search className="w-3.5 h-3.5 mr-3 text-slate-400" />{item}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. Location Search */}
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
                            {/* Location Suggestions (Same as before) */}
                            <AnimatePresence>
                                {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Locations</div>
                                        {filteredLocationSuggestions.map((item, index) => (
                                            <button key={index} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm flex items-center" onClick={() => { setLocation(item); setShowLocationSuggestions(false); }}><MapPin className="w-3.5 h-3.5 mr-3 text-slate-400" />{item}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            size="lg"
                            className="h-12 px-8 rounded-2xl bg-primary hover:bg-orange-600 text-white font-medium text-base shadow-lg shadow-orange-200 min-w-[120px] m-1"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </motion.div>

                    {/* Popular Tags */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-2.5 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <span className="text-sm font-medium text-slate-500 mr-1">Trending:</span>
                        {["Software Engineer", "Product Manager", "UX Designer", "Data Scientist"].map((role) => (
                            <button
                                key={role}
                                onClick={() => { setQuery(role); setSearchType("jobs"); }}
                                className="px-3 py-1 text-xs md:text-sm bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200"
                            >
                                {role}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Cards (Premium Refinement) */}
                <motion.div
                    className="max-w-4xl mx-auto mb-20 relative z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 px-4 justify-items-center">
                        {[
                            {
                                label: "Internships",
                                icon: "https://cdn-icons-png.flaticon.com/512/2942/2942789.png",
                                link: "/internships",
                                bg: "bg-gradient-to-br from-blue-50 via-blue-50/50 to-white",
                                border: "border-blue-100",
                                glow: "group-hover:shadow-blue-200/50",
                                text: "text-slate-800"
                            },
                            {
                                label: "Jobs",
                                icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png",
                                link: "/jobs",
                                bg: "bg-gradient-to-br from-violet-50 via-violet-50/50 to-white",
                                border: "border-violet-100",
                                glow: "group-hover:shadow-violet-200/50",
                                text: "text-slate-800"
                            },
                            {
                                label: "Practice",
                                icon: "https://cdn-icons-png.flaticon.com/512/2641/2641409.png",
                                link: "/practice",
                                bg: "bg-gradient-to-br from-orange-50 via-orange-50/50 to-white",
                                border: "border-orange-100",
                                glow: "group-hover:shadow-orange-200/50",
                                text: "text-slate-800"
                            },
                            {
                                label: "Mock Tests",
                                icon: "https://cdn-icons-png.flaticon.com/512/3206/3206303.png",
                                link: "/practice",
                                bg: "bg-gradient-to-br from-pink-50 via-pink-50/50 to-white",
                                border: "border-pink-100",
                                glow: "group-hover:shadow-pink-200/50",
                                text: "text-slate-800"
                            },
                            {
                                label: "Resume Builder",
                                icon: "https://cdn-icons-png.flaticon.com/512/1055/1055644.png",
                                link: "/resume-builder",
                                bg: "bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white",
                                border: "border-emerald-100",
                                glow: "group-hover:shadow-emerald-200/50",
                                text: "text-slate-800"
                            },
                        ].map((item, index) => (
                            <motion.button
                                key={item.label}
                                onClick={() => router.push(item.link)}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className={cn(
                                    "group flex flex-col justify-between w-full h-32 md:h-36 rounded-[2rem] p-5 border transition-all duration-300 relative overflow-hidden shadow-sm",
                                    item.bg,
                                    item.border,
                                    "hover:shadow-xl",
                                    item.glow
                                )}
                            >
                                {/* Header Row */}
                                <div className="flex items-start justify-between z-10 w-full">
                                    <span className={cn("font-bold text-sm md:text-[15px] leading-tight tracking-tight", item.text)}>
                                        {item.label}
                                    </span>

                                    {/* Small arrow indicator that appears on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <ChevronRight className="w-4 h-4 text-slate-400/80" />
                                    </div>
                                </div>

                                {/* Icon Bottom Right (Larger, 3D effect) */}
                                <div className="absolute -bottom-3 -right-3 w-[72px] h-[72px] md:w-20 md:h-20 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:-translate-y-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300"
                                    />
                                </div>

                                {/* Inner Highlight Border */}
                                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/60 pointer-events-none" />

                                {/* Shine Effect */}
                                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Company Carousel */}
            <CompanyCarousel />
        </section>
    );
}
