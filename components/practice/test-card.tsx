"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

function BookmarkButton({ id, type, className }: { id: string, type: string, className?: string }) {
    const toggleBookmark = useMutation(api.user_actions.toggleBookmark);
    const bookmarks = useQuery(api.user_actions.getBookmarks, { type });
    const isBookmarked = bookmarks?.some(b => b.targetId === id) || false;
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        try {
            await toggleBookmark({ type, targetId: id });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleToggle} disabled={isLoading} className={cn("text-white/60 hover:text-white transition-colors z-20 p-1.5 rounded-full hover:bg-white/10", className)}>
            <Star className={cn("w-5 h-5", isBookmarked ? "fill-yellow-400 text-yellow-400" : "")} />
        </button>
    );
}

// Map categories to visual styles and Real Logos
const getCategoryStyles = (category: string) => {
    const normalized = category.toLowerCase();

    // Tech Stack Logos (using devicon.dev)
    if (normalized.includes("python")) return {
        banner: "bg-[#FFD43B]", // Python Yellow
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        placeholder: "PY",
        textColor: "text-slate-900"
    };
    if (normalized.includes("java") && !normalized.includes("script")) return {
        banner: "bg-[#F89820]", // Java Orange
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        placeholder: "JV",
        textColor: "text-white"
    };
    if (normalized.includes("c++") || normalized.includes("cpp")) return {
        banner: "bg-[#00599C]", // CPP Blue
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        placeholder: "C++",
        textColor: "text-white"
    };
    if (normalized === "c" || normalized.includes("c lang")) return {
        banner: "bg-[#A8B9CC]", // C Grey
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        placeholder: "C",
        textColor: "text-slate-900"
    };
    if (normalized.includes("react")) return {
        banner: "bg-[#61DAFB]", // React Cyan
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
        placeholder: "RC",
        textColor: "text-slate-900"
    };
    if (normalized.includes("node")) return {
        banner: "bg-[#339933]", // Node Green
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        placeholder: "JS",
        textColor: "text-white"
    };
    if (normalized.includes("machine learning") || normalized.includes("ml")) return {
        banner: "bg-gradient-to-r from-teal-400 to-emerald-400",
        logo: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png", // ML Brain
        placeholder: "ML",
        textColor: "text-white"
    };

    // New Tech Topics
    if (normalized.includes("computer fundamentals")) return {
        banner: "bg-[#F7DF1E]", // JS Yellow style
        logo: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", // Laptop
        placeholder: "CF",
        textColor: "text-slate-900"
    };
    if (normalized.includes("cn") || normalized.includes("network")) return {
        banner: "bg-[#007396]", // Network Blue
        logo: "https://cdn-icons-png.flaticon.com/512/2885/2885417.png", // Network
        placeholder: "CN",
        textColor: "text-white"
    };
    if (normalized.includes("dsa") || normalized.includes("structure")) return {
        banner: "bg-[#F05032]", // Git Orange style
        logo: "https://cdn-icons-png.flaticon.com/512/9083/9083818.png", // Algorithm
        placeholder: "DSA",
        textColor: "text-white"
    };
    if (normalized.includes("oops")) return {
        banner: "bg-[#654FF0]", // OOP Purple
        logo: "https://cdn-icons-png.flaticon.com/512/10831/10831853.png", // Objects
        placeholder: "OOP",
        textColor: "text-white"
    };
    if (normalized.includes("dbms")) return {
        banner: "bg-[#336791]", // Postgres Blue
        logo: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png", // DB
        placeholder: "DB",
        textColor: "text-white"
    };


    // Domain / Management Logos (Yellow Theme as per screenshots)
    const managementStart = [
        "financial", "brand", "supply", "micro", "operations", "marketing", "inventory", "macro", "sales", "retail", "digital", "b2b", "service", "banking", "credit"
    ];

    if (managementStart.some(s => normalized.includes(s))) {
        return {
            banner: "bg-[#FFD60A]", // Bright Yellow from screenshots
            logo: getManagementIcon(category),
            placeholder: category.slice(0, 2).toUpperCase(),
            textColor: "text-slate-900"
        };
    }

    // Default
    return {
        banner: "bg-gradient-to-r from-slate-800 to-slate-900",
        logo: null,
        placeholder: category.slice(0, 2).toUpperCase(),
        textColor: "text-white"
    };
};

const getManagementIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes("financial") || lower.includes("banking") || lower.includes("credit")) return "https://cdn-icons-png.flaticon.com/512/2483/2483148.png"; // Finance
    if (lower.includes("marketing") || lower.includes("brand") || lower.includes("digital") || lower.includes("sales")) return "https://cdn-icons-png.flaticon.com/512/1998/1998087.png"; // Marketing
    if (lower.includes("supply") || lower.includes("operations") || lower.includes("inventory")) return "https://cdn-icons-png.flaticon.com/512/1682/1682662.png"; // Logistics
    if (lower.includes("economics")) return "https://cdn-icons-png.flaticon.com/512/3310/3310748.png"; // Economics
    return "https://cdn-icons-png.flaticon.com/512/2620/2620542.png"; // Generic Management
};

interface TestCardProps {
    id: string;
    title: string;
    category: string;
    questions: number;
    duration: string;
    difficulty: string;
    imageColor?: string;
    description?: string;
    onClick?: () => void;
    rating?: number;
    customBannerColor?: string;
    customLogo?: string;
    hideStats?: boolean;
    buttonText?: string;
    hideBanner?: boolean;
}

export function TestCard({
    id,
    title,
    category,
    questions,
    duration,
    difficulty,
    description,
    onClick,
    rating = 4.8,
    customBannerColor,
    customLogo,
    hideStats,
    buttonText,
    hideBanner
}: TestCardProps) {

    const styles = getCategoryStyles(category);

    return (
        <motion.div whileHover={{ y: -5 }} className="h-full">
            <Card
                className="h-full w-full mx-auto border-white/20 shadow-lg hover:shadow-xl transition-all flex flex-col overflow-hidden bg-white/70 backdrop-blur-md rounded-[1.5rem] relative group ring-1 ring-white/50 p-2"
                onClick={onClick}
            >
                {/* Bookmark Button - Enhanced visibility */}
                <div className="absolute top-4 right-4 z-30">
                    <BookmarkButton
                        id={id}
                        type="practice_paper"
                        className="bg-black/20 backdrop-blur-sm shadow-sm hover:bg-black/30 text-white"
                    />
                </div>

                {/* Banner Section */}
                {!hideBanner && (
                    <div className={cn("w-full relative h-24 rounded-[1.2rem] overflow-hidden", customBannerColor || styles.banner)}>
                        {/* Abstract decorative elements */}
                        {!customBannerColor && (
                            <>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                            </>
                        )}

                        {/* Watermark Logo */}
                        {!customLogo && styles.logo && (
                            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-[-15deg]">
                                <img src={styles.logo} alt="" className="w-20 h-20 object-contain" />
                            </div>
                        )}

                        {/* Badge on Banner */}
                        <div className="absolute bottom-3 right-4">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm font-bold px-2 py-0.5 text-[9px] rounded-full border-none">
                                {category}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Content Section */}
                <div className={cn("px-2 pb-2 pt-0 flex-1 flex flex-col relative", hideBanner ? "mt-4" : "")}>

                    {/* Avatar / Icon - Overlapping Banner */}
                    <div className={cn(
                        "w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center text-sm font-bold shadow-md z-10 mb-2 bg-white",
                        !hideBanner ? "-mt-5 ml-2" : "mb-4",
                        styles.textColor === "text-white" ? "text-slate-900" : styles.textColor
                    )}>
                        {customLogo || styles.logo ? (
                            <img src={customLogo || styles.logo || ""} alt={category} className="w-6 h-6 object-contain" />
                        ) : (
                            <span className="text-slate-600">{styles.placeholder}</span>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="mb-3">
                        <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Stats Row */}
                    {!hideStats && (
                        <div className="flex items-center justify-between text-[10px] text-slate-600 mb-3 px-1 bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-900">{rating}</span>
                                </div>
                            </div>
                            <div className="w-px h-5 bg-slate-200"></div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="font-bold text-slate-900 whitespace-nowrap">{duration}</span>
                            </div>
                            <div className="w-px h-5 bg-slate-200"></div>
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="font-bold text-slate-900">{difficulty}</span>
                            </div>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className="mt-auto">
                        <Button
                            className="w-full rounded-full h-8 text-[11px] font-bold shadow-none hover:shadow-lg transition-all bg-white text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 group/btn"
                            onClick={(e) => {
                                if (onClick) {
                                    e.stopPropagation();
                                    onClick();
                                }
                            }}
                        >
                            {buttonText || "Start Practice"}
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
