"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdBannerProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    variant?: "blue" | "orange" | "purple" | "gradient";
    imageSrc?: string; // URL for illustration
    className?: string;
}

export function AdBanner({
    title,
    subtitle,
    ctaText,
    ctaLink,
    variant = "gradient",
    imageSrc,
    className
}: AdBannerProps) {

    const variants = {
        blue: "bg-blue-50 border-blue-100",
        orange: "bg-orange-50 border-orange-100",
        purple: "bg-purple-50 border-purple-100",
        gradient: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-slate-100"
    };

    return (
        <div className={cn("rounded-2xl border p-6 md:p-8 relative overflow-hidden", variants[variant], className)}>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="max-w-xl space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-xs font-semibold text-slate-800 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Featured Opportunity</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h2>

                    <p className="text-slate-600 text-lg leading-relaxed">
                        {subtitle}
                    </p>

                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold" asChild>
                        <Link href={ctaLink}>
                            {ctaText} <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                {imageSrc && (
                    <div className="relative w-full max-w-[280px] md:max-w-xs aspect-square md:aspect-[4/3] flex-shrink-0">
                        {/* Placeholder for real image or illustration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200/50 shadow-inner">
                            {/* In a real app we'd use Next Image here */}
                            {/* <Image src={imageSrc} fill className="object-contain" alt="Ad Illustration" /> */}
                            <span className="text-sm font-medium">Illustration</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
