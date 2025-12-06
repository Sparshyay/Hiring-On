"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, ChevronLeft, ChevronRight, Flag, Save } from "lucide-react";
import { useState } from "react";

export default function MockTestPage() {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 20;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Test Header */}
            <header className="bg-white border-b sticky top-0 z-30 px-4 h-16 flex items-center justify-between">
                <div className="font-bold text-lg text-secondary">Frontend Development Basics</div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-mono font-medium">
                        <Clock className="w-4 h-4" />
                        <span>42:30</span>
                    </div>
                    <Button variant="destructive" size="sm">End Test</Button>
                </div>
            </header>

            <div className="flex-1 container mx-auto p-4 flex gap-6 h-[calc(100vh-64px)] overflow-hidden">

                {/* Left: Question Panel */}
                <div className="flex-1 flex flex-col overflow-y-auto pb-20 scrollbar-hide">
                    <Card className="border-none shadow-sm mb-6">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-medium text-muted-foreground">Question {currentQuestion} of {totalQuestions}</span>
                                <span className="text-sm font-medium text-green-600">+1.0 / -0.25</span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
                                Which of the following hook is used to perform side effects in a function component in React?
                            </h2>

                            <RadioGroup defaultValue="option-one" className="space-y-4">
                                {[
                                    { id: "opt1", label: "useEffect" },
                                    { id: "opt2", label: "useState" },
                                    { id: "opt3", label: "useContext" },
                                    { id: "opt4", label: "useReducer" },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-2 border rounded-xl p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <RadioGroupItem value={opt.id} id={opt.id} />
                                        <Label htmlFor={opt.id} className="flex-1 cursor-pointer font-medium text-slate-700">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Navigation Panel */}
                <div className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
                    <Card className="border-none shadow-sm flex-1 flex flex-col">
                        <CardContent className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 mb-4">Question Palette</h3>
                            <div className="grid grid-cols-5 gap-2 content-start">
                                {Array.from({ length: totalQuestions }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestion(i + 1)}
                                        className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                      ${i + 1 === currentQuestion
                                                ? "bg-primary text-white shadow-md shadow-orange-500/20"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                    `}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 border-t space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-3 h-3 rounded-full bg-primary" /> Current
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-3 h-3 rounded-full bg-green-500" /> Answered
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-3 h-3 rounded-full bg-slate-200" /> Not Visited
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>
                        <Button variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                            <Flag className="w-4 h-4 mr-2" /> Mark for Review
                        </Button>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="bg-secondary text-white hover:bg-slate-800">
                            <Save className="w-4 h-4 mr-2" /> Save & Next
                        </Button>
                        <Button className="bg-primary hover:bg-orange-600 text-white" onClick={() => setCurrentQuestion(Math.min(totalQuestions, currentQuestion + 1))}>
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
