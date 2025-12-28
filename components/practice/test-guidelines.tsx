"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, HelpCircle, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GuidelinesProps {
    title: string;
    questionCount: number;
    duration: number;
    onStart: () => void;
}

export function Guidelines({ title, questionCount, duration, onStart }: GuidelinesProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl gap-8 lg:gap-16 p-6">

                {/* Left: Info Section */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-slate-500 font-medium uppercase tracking-wide text-sm">Assessment</h3>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex flex-col gap-4 py-6 border-y border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Total Questions</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{questionCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Total Marks</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{questionCount}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Guidelines Card */}
                <Card className="p-8 shadow-2xl shadow-slate-200/50 border-slate-100 bg-white rounded-3xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Important Guidelines</h2>
                    </div>

                    <div className="space-y-5 flex-1 text-sm leading-relaxed text-slate-600">
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>Assessment Duration is strictly <strong className="text-slate-900">{duration}:00 minutes</strong>.</p>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>You must answer <strong className="text-slate-900">{questionCount} Questions</strong>.</p>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>Do not switch tabs or close the window, as it may submit the test automatically.</p>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p>Ensure a stable internet connection before starting.</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 text-base rounded-xl transition-all shadow-lg hover:shadow-xl">
                                    Start Assessment <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Ready to begin?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to start the <strong>{title}</strong> assessment?
                                        Once started, the timer cannot be paused.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onStart} className="bg-slate-900 text-white hover:bg-slate-800">
                                        Yes, Start Now
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            </div>
        </div>
    );
}
