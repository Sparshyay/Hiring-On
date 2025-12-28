"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Terminal, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLLECTIONS = [
    {
        title: "Top Companies",
        description: "TCS, Infosys, Wipro, Accenture",
        icon: Building2,
        color: "bg-blue-100 text-blue-600",
        border: "border-blue-100"
    },
    {
        title: "Coding Languages",
        description: "Java, Python, C++, JavaScript",
        icon: Terminal,
        color: "bg-purple-100 text-purple-600",
        border: "border-purple-100"
    },
    {
        title: "Job Roles",
        description: "SDE, Data Analyst, HR, Sales",
        icon: Briefcase,
        color: "bg-orange-100 text-orange-600",
        border: "border-orange-100"
    },
    {
        title: "Core Subjects",
        description: "OS, DBMS, CN, Math",
        icon: GraduationCap,
        color: "bg-green-100 text-green-600",
        border: "border-green-100"
    },
];

export function TestCollections() {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLLECTIONS.map((item) => (
                    <Card key={item.title} className={`p-6 hover:shadow-lg transition-all cursor-pointer group border-l-4 ${item.border}`}>
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                        <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent group-hover:gap-2 transition-all">
                            Explore <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Card>
                ))}
            </div>
        </section>
    );
}
