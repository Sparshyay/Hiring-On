"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Code2, BrainCircuit, Mic, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { useProtectedAction } from "@/lib/auth";
import { useRouter } from "next/navigation";

const practiceTests = [
    {
        id: 1,
        title: "Frontend Development Basics",
        category: "Coding",
        icon: Code2,
        questions: 20,
        time: "45 mins",
        difficulty: "Easy",
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        id: 2,
        title: "General Aptitude Test",
        category: "Aptitude",
        icon: BrainCircuit,
        questions: 30,
        time: "60 mins",
        difficulty: "Medium",
        color: "text-purple-600",
        bg: "bg-purple-100",
    },
    {
        id: 3,
        title: "Behavioral Interview Prep",
        category: "Interview",
        icon: Mic,
        questions: 10,
        time: "30 mins",
        difficulty: "Hard",
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
    {
        id: 4,
        title: "React.js Advanced",
        category: "Coding",
        icon: Code2,
        questions: 15,
        time: "40 mins",
        difficulty: "Hard",
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
];

export default function PracticePage() {
    const { verifyAccess } = useProtectedAction();
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Practice & Prepare"
                    description="Sharpen your skills with our comprehensive library of mock tests and interviews."
                />

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: "Coding Tests", count: "50+ Tests", icon: Code2, color: "bg-blue-500" },
                        { title: "Aptitude", count: "100+ Tests", icon: BrainCircuit, color: "bg-purple-500" },
                        { title: "Mock Interviews", count: "20+ Scenarios", icon: Mic, color: "bg-orange-500" },
                    ].map((cat) => (
                        <Card key={cat.title} className="border-none shadow-md hover:shadow-lg transition-all cursor-pointer group">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{cat.title}</h3>
                                    <p className="text-sm text-muted-foreground">{cat.count}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Featured Tests */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Assessments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {practiceTests.map((test) => (
                        <Card key={test.id} className="bg-accent/20 border-none hover:bg-accent/40 transition-colors flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg ${test.bg} flex items-center justify-center ${test.color}`}>
                                        <test.icon className="w-5 h-5" />
                                    </div>
                                    <Badge variant={test.difficulty === "Easy" ? "secondary" : test.difficulty === "Medium" ? "default" : "destructive"}>
                                        {test.difficulty}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-lg text-secondary leading-tight">{test.title}</h3>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {test.time}</span>
                                    <span>•</span>
                                    <span>{test.questions} Qs</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-primary hover:bg-orange-600 text-white"
                                    onClick={() => verifyAccess("start test") && router.push(`/practice/${test.id}`)}
                                >
                                    Start Test <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
