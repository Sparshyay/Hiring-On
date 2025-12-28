"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, HelpCircle, ArrowUpRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface TestCardProps {
    id: string;
    title: string;
    category: string;
    questions: number;
    duration: string;
    difficulty: string;
    imageColor?: string; // e.g. "bg-[#FFD700]" for yellow
    bannerImage?: string; // Optional illustrative image
    companyLogos?: string[]; // Array of logo URLs
    tags?: string[];
    isPremium?: boolean;
    rating?: number;
    participants?: string;
    description?: string;
    onClick?: () => void;
    compact?: boolean;
}

export function TestCard({
    id,
    title,
    category,
    questions,
    duration,
    difficulty,
    imageColor = "bg-[#FFD700]", // Default yellow as per design
    bannerImage,
    companyLogos = [],
    tags = [],
    isPremium = false,
    rating,
    participants,
    description,
    onClick,
    compact = false
}: TestCardProps) {

    return (
        <motion.div whileHover={{ y: -5 }} className="h-full">
            <Card
                className={cn(
                    "h-full border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group bg-white rounded-2xl",
                    onClick && "cursor-pointer"
                )}
                onClick={onClick}
            >
                {/* Banner Section */}
                <div className={cn(
                    "w-full relative overflow-hidden flex flex-col justify-between transition-all",
                    compact ? "h-20 p-4" : "h-28 p-5",
                    imageColor
                )}>
                    {/* Background Pattern/Image */}
                    {bannerImage && (
                        <Image src={bannerImage} alt="banner" fill className="object-cover opacity-20 mix-blend-overlay" />
                    )}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full border border-slate-900/20" />
                            <div className="w-2 h-2 rounded-full border border-slate-900/20" />
                        </div>
                        {companyLogos.length > 0 && (
                            <div className="flex -space-x-2">
                                {companyLogos.slice(0, 3).map((logo, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-white p-0.5 border border-white/50 shadow-sm flex items-center justify-center overflow-hidden">
                                        <span className="text-[8px] font-bold text-slate-700">{logo[0]}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 hidden">
                        {/* Hidden category in banner for compact/standard design cleanup */}
                    </div>
                </div>

                <CardContent className={cn("flex-1 flex flex-col gap-3", compact ? "p-4" : "p-5")}>
                    <div>
                        <Badge variant="secondary" className="mb-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent font-semibold text-[10px]">
                            {category}
                        </Badge>
                        <h3 className={cn("font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors", compact ? "text-base" : "text-lg")}>
                            {title}
                        </h3>
                    </div>

                    {description && !compact && (
                        <p className="text-sm text-slate-500 line-clamp-2">
                            {description}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span className="font-medium">{questions} Qs</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">{duration}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className={cn("pt-0 mt-auto", compact ? "p-4" : "p-5")}>
                    <div className="w-full flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-400 font-medium">
                            {participants ? `${participants} taken` : "Recently added"}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-slate-900 font-bold hover:bg-transparent hover:text-primary group/btn text-xs"
                            asChild={!onClick}
                            onClick={(e) => {
                                if (onClick) {
                                    e.stopPropagation(); // Avoid double trigger if card manages click
                                    onClick();
                                }
                            }}
                        >
                            {onClick ? (
                                <span className="flex items-center gap-1 cursor-pointer">
                                    Start
                                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </span>
                            ) : (
                                <Link href={`/practice/${id}`} className="flex items-center gap-2">
                                    Start
                                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </Link>
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
