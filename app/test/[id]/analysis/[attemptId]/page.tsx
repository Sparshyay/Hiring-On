"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TestAnalysisPage() {
    const params = useParams();
    const result = useQuery(api.tests.getTestAnalysis, {
        attemptId: params.attemptId as Id<"test_attempts">
    });

    if (!result) {
        return <div className="p-8 max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>;
    }

    const { test, attempt, answers } = result;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/practice" className="text-slate-500 hover:text-slate-800 text-sm flex items-center mb-2">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Practice
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">{test.title} Analysis</h1>
                        <p className="text-slate-600">Review your answers and explanations.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{attempt.score || 0} / {answers.reduce((acc: number, curr: any) => acc + (curr.question.marks || 1), 0)}</div>
                        <Badge variant="outline" className={cn(
                            "text-sm",
                            (attempt.score || 0) > 5 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                        )}>
                            {(attempt.accuracy || 0).toFixed(1)}% Accuracy
                        </Badge>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {answers.map((item: any, index: number) => {
                        const isCorrect = item.answer?.isCorrect;
                        const isSkipped = item.answer?.status === 'skipped';

                        return (
                            <Card key={item.question._id} className={cn(
                                "border-l-4",
                                isCorrect ? "border-l-green-500" : isSkipped ? "border-l-slate-300" : "border-l-red-500"
                            )}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="font-medium text-slate-900 flex gap-3">
                                            <span className="text-slate-400">Q{index + 1}.</span>
                                            <div className="whitespace-pre-wrap">{item.question.question}</div>
                                        </div>
                                        <Badge variant="secondary" className={cn(
                                            isCorrect ? "bg-green-100 text-green-800" : isSkipped ? "bg-slate-100 text-slate-800" : "bg-red-100 text-red-800"
                                        )}>
                                            {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Wrong"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    {/* Options for MCQ */}
                                    {item.question.type === 'MCQ' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                            {item.question.options.map((opt: string, optIdx: number) => {
                                                const isSelected = item.answer?.selectedOption === optIdx.toString();
                                                const isCorrectOpt = item.question.correctAnswer === optIdx.toString();

                                                let style = "border-slate-200 bg-white";
                                                if (isCorrectOpt) style = "border-green-500 bg-green-50 ring-1 ring-green-500";
                                                else if (isSelected && !isCorrectOpt) style = "border-red-500 bg-red-50";
                                                else if (isSelected) style = "border-slate-900 bg-slate-50"; // Should be covered by correct opt if correct

                                                return (
                                                    <div key={optIdx} className={cn("p-3 rounded-lg border text-sm flex items-center justify-between", style)}>
                                                        <span>{opt}</span>
                                                        {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                                        {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-600" />}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Coding Answer */}
                                    {item.question.type === 'CODE' && (
                                        <div className="mt-3 space-y-2">
                                            <div className="p-3 bg-slate-900 text-slate-50 rounded-lg font-mono text-sm overflow-x-auto">
                                                {item.answer?.code || "// No code submitted"}
                                            </div>
                                            {!isCorrect && <div className="text-sm text-red-600">Test cases failed.</div>}
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                                            <AlertCircle className="w-4 h-4" /> Explanation
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {item.question.explanation || "No explanation provided for this question."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
