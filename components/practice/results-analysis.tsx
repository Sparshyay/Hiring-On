"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, BarChart3, BookOpen, ArrowRight, TrendingUp, Award, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface QuestionResult {
    questionId: string;
    question: string;
    selectedOption?: string;
    correctAnswer: string;
    explanation?: string;
    isCorrect: boolean;
    marks: number;
}

interface ResultsAnalysisProps {
    score: number;
    totalMarks: number;
    correctCount: number;
    totalQuestions: number;
    results: QuestionResult[];
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
    // Coding Concepts
    "Memory Management": ["pointer", "memory", "allocation", "reference", "garbage", "heap", "stack"],
    "OOP Concepts": ["class", "object", "inheritance", "polymorphism", "encapsulation", "abstraction", "constructor"],
    "Data Structures": ["array", "list", "stack", "queue", "tree", "graph", "map", "set", "collection"],
    "Control Flow": ["loop", "if", "else", "switch", "break", "continue", "recursion"],
    "Syntax & Basics": ["variable", "int", "string", "print", "output", "syntax", "operator", "type"],

    // Web Tech
    "React Hooks": ["usestate", "useeffect", "usecontext", "hook", "usememo", "usecallback"],
    "React Core": ["jsx", "component", "props", "state", "virtual dom", "lifecycle"],
    "Networking": ["http", "https", "tcp", "ip", "dns", "protocol", "port", "layer", "osi"],

    // Aptitude
    "Arithmetic": ["percent", "ratio", "average", "profit", "loss", "interest", "sum", "number"],
    "Time & Distance": ["speed", "time", "distance", "train", "boat", "stream"],
    "Algebra": ["equation", "variable", "simplify", "solve", "x"],
    "Logical Reasoning": ["series", "pattern", "coding", "decoding", "analogy", "odd one out"],
};

function analyzeResults(results: QuestionResult[]) {
    const topicStats: Record<string, { correct: number, total: number }> = {};

    results.forEach(q => {
        const text = (q.question + " " + (q.explanation || "")).toLowerCase();
        let matched = false;

        for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
            if (keywords.some(k => text.includes(k))) {
                if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
                topicStats[topic].total++;
                if (q.isCorrect) topicStats[topic].correct++;
                matched = true;
            }
        }

        // If no keyword matched, categorize as "General Knowledge"
        if (!matched) {
            const topic = "General Knowledge";
            if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
            topicStats[topic].total++;
            if (q.isCorrect) topicStats[topic].correct++;
        }
    });

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
        const accuracy = (stats.correct / stats.total) * 100;
        if (accuracy >= 75 && stats.total >= 1) { // Threshold for strength
            strengths.push(`${topic} (${Math.round(accuracy)}%)`);
        } else if (accuracy <= 50) { // Threshold for weakness
            weaknesses.push(`${topic} (Accuracy: ${Math.round(accuracy)}%)`);
        }
    });

    return { strengths: strengths.slice(0, 4), weaknesses: weaknesses.slice(0, 4) };
}

export function ResultsAnalysis({ score, totalMarks, correctCount, totalQuestions, results }: ResultsAnalysisProps) {
    const router = useRouter();
    const incorrectCount = results.filter(r => !r.isCorrect && r.selectedOption).length;
    const skippedCount = totalQuestions - (correctCount + incorrectCount);

    const percentage = Math.round((score / totalMarks) * 100) || 0;

    // Circular Progress Props
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const analysis = useMemo(() => analyzeResults(results), [results]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Background */}
            <div className="bg-slate-900 text-white py-12 pb-24">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
                        <Award className="w-4 h-4" /> Assessment Completed
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Assessment Analysis</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Great job completing the assessment. Here's a detailed breakdown of your performance.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 max-w-5xl space-y-8">

                {/* Score Overview Card */}
                <Card className="p-8 bg-white shadow-xl border-slate-200 rounded-2xl overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                        {/* Circular Score */}
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="relative w-40 h-40">
                                <svg className="transform -rotate-90 w-40 h-40">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r={radius}
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r={radius}
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className={`transition-all duration-1000 ease-out ${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-extrabold text-slate-900">{percentage}%</span>
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-center">
                                <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900">{score}/{totalMarks}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Marks Scored</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-2 text-center">
                                <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900">{correctCount}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Correct</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-2 text-center">
                                <div className="w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                                    <XCircle className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900">{incorrectCount}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Incorrect</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Tabs */}
                <Tabs defaultValue="review" className="w-full space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-slate-200/50 p-1.5 rounded-full h-auto">
                            <TabsTrigger value="performance" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 font-medium transition-all">
                                Performance Insights
                            </TabsTrigger>
                            <TabsTrigger value="review" className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 font-medium transition-all">
                                Question Review
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="performance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-8 border-t-4 border-t-green-500 shadow-md h-full">
                                <h3 className="flex items-center gap-3 font-bold text-xl text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    Strengths & Mastery
                                </h3>
                                <div className="space-y-4">
                                    {analysis.strengths.length > 0 ? (
                                        <>
                                            <p className="text-slate-600 leading-relaxed">
                                                You demonstrated strong command over these key areas:
                                            </p>
                                            <ul className="space-y-3">
                                                {analysis.strengths.map((topic, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-green-50/50 p-2 rounded-lg border border-green-100">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                        <span className="font-medium text-slate-900">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed">
                                            {percentage > 70
                                                ? "You showed great consistency across the board. Your general understanding is solid."
                                                : "Keep practicing! As you solve more questions, we'll identify your specific strengths."}
                                        </p>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-8 border-t-4 border-t-amber-500 shadow-md h-full">
                                <h3 className="flex items-center gap-3 font-bold text-xl text-slate-900 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    Focus Areas
                                </h3>
                                <div className="space-y-4">
                                    {analysis.weaknesses.length > 0 ? (
                                        <>
                                            <p className="text-slate-600 leading-relaxed">
                                                Consider reviewing these topics to improve your score:
                                            </p>
                                            <ul className="space-y-3">
                                                {analysis.weaknesses.map((topic, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                                        <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                                        <span className="font-medium text-slate-900">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed">
                                            {percentage > 90
                                                ? "Outstanding! You've mastered nearly all topics in this assessment."
                                                : "Review the questions you missed or skipped to identify specific gaps."}
                                        </p>
                                    )}
                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                            View Recommended Study Material <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="review" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {results.map((q, idx) => (
                            <Card key={q.questionId} className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className={`p-4 border-b flex items-center justify-between ${q.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${q.isCorrect ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        </div>
                                        <span className={`text-sm font-bold uppercase tracking-wider ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {q.isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">2 Marks</span>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <p className="text-lg font-medium text-slate-900">{q.question}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.selectedOption && !q.isCorrect && (
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 space-y-1">
                                                <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                                                    <XCircle className="w-4 h-4" /> Your Answer
                                                </div>
                                                <p className="text-red-800 font-medium">{q.selectedOption}</p>
                                            </div>
                                        )}

                                        <div className="p-4 rounded-xl bg-green-50 border border-green-100 space-y-1">
                                            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                                                <CheckCircle2 className="w-4 h-4" /> Correct Answer
                                            </div>
                                            <p className="text-green-800 font-medium">{q.correctAnswer}</p>
                                        </div>
                                    </div>

                                    {q.explanation && (
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                                            <p className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" /> Explanation
                                            </p>
                                            <p className="text-slate-700 text-base leading-relaxed">{q.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>

                <div className="flex justify-center pt-8 pb-12 gap-4">
                    <Button variant="outline" size="lg" className="px-8" onClick={() => router.push("/practice")}>
                        Back to Practice
                    </Button>
                    <Button size="lg" className="px-8 bg-slate-900 hover:bg-slate-800" onClick={() => window.location.reload()}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
                    </Button>
                </div>
            </div>
        </div>
    );
}
