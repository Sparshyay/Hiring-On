"use client";

import React from "react";
import {
    GraduationCap,
    Code2,
    FileText,
    Building2,
    TerminalSquare,
    BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const tabs = [
    {
        icon: GraduationCap,
        label: "MBA",
        color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        href: "/practice/mba"
    },
    {
        icon: Code2,
        label: "Coding Practice",
        color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
        href: "/practice/coding"
    },
    {
        icon: FileText,
        label: "AI-Powered Mock Tests",
        color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
        href: "/practice/ai-mock"
    },
    {
        icon: Building2,
        label: "Company Preparation",
        color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
        href: "/practice/company"
    },
    {
        icon: TerminalSquare,
        label: "Projects",
        color: "bg-sky-50 text-sky-700 hover:bg-sky-100",
        href: "/practice/projects"
    },
    {
        icon: BrainCircuit,
        label: "Skill Based Mock Test",
        color: "bg-violet-50 text-violet-700 hover:bg-violet-100",
        href: "/practice/skill"
    }
];

export function PracticeHeroTabs() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {tabs.map((tab, index) => (
                <motion.button
                    key={index}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(tab.href)}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl transition-colors h-[120px] gap-3 text-center cursor-pointer border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md",
                        tab.color
                    )}
                >
                    <tab.icon className="w-8 h-8" strokeWidth={1.5} />
                    <span className="text-sm font-semibold leading-tight px-1">
                        {tab.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
