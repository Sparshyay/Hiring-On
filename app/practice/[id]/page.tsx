"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Components
import { DifficultySelector } from "@/components/practice/difficulty-selector";
import { AssessmentLoader } from "@/components/practice/assessment-loader";
import { Guidelines } from "@/components/practice/test-guidelines";
import { ResultsAnalysis } from "@/components/practice/results-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Flag, Save, CheckCircle2, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Stage = "difficulty" | "loading" | "guidelines" | "test" | "result";

export default function MockTestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as Id<"tests">;
    // Simple validation to prevent legacy mock IDs (like "mt-1") from crashing the query validation
    const isValidId = testId && testId.length > 20; // Convex IDs are usually long strings

    const test = useQuery(api.tests.getTestById, isValidId ? { testId } : "skip");
    const questions = useQuery(api.tests.getQuestions, isValidId ? { testId } : "skip");
    const submitTest = useMutation(api.tests.submitTest);

    // Flow State
    const [stage, setStage] = useState<Stage>("difficulty");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

    // Test Runner State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scoreResult, setScoreResult] = useState<{
        score: number,
        correctCount: number,
        results?: any[] // Using any[] for simplicity or import QuestionResult interface
    } | null>(null);

    // Initialize timer when test starts
    useEffect(() => {
        if (test && stage === "test") {
            setTimeLeft(test.duration * 60);
        }
        // Skip difficulty selection for standard tests (they have fixed difficulty)
        if (test && test.type === "standard" && stage === "difficulty") {
            setStage("loading");
        }
    }, [test, stage]);

    // Timer Logic
    useEffect(() => {
        if (stage !== "test" || isSubmitted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, isSubmitted, timeLeft]);

    // Handlers
    const handleDifficultySelect = (diff: string) => {
        setSelectedDifficulty(diff);
        setStage("loading");
    };

    const handleLoaderComplete = () => {
        setStage("guidelines");
    };

    const handleStartTest = () => {
        setStage("test");
    };

    const handleAnswerSelect = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmitTest = async () => {
        if (isSubmitted) return;

        setIsSubmitted(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, opt]) => ({
                questionId: qId as Id<"questions">,
                selectedOption: opt
            }));

            const result = await submitTest({
                testId,
                answers: formattedAnswers
            });

            setScoreResult(result);
            setStage("result");
        } catch (error) {
            console.error("Failed to submit test:", error);
            // Check if error is an object and has message
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to submit test: ${errorMessage}`);
            setIsSubmitted(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isValidId) {
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4">
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
                <h2 className="text-xl font-semibold">Invalid Test ID</h2>
                <p className="text-slate-500">The test you are looking for does not exist or the link is broken.</p>
                <Button onClick={() => router.push('/practice')}>Go to Practice Page</Button>
            </div>
        );
    }

    if (!test || !questions) {
        return <div className="flex h-screen items-center justify-center">Loading test details...</div>;
    }

    // --- Render Stages ---

    if (stage === "difficulty") {
        return <DifficultySelector onSelect={handleDifficultySelect} />;
    }

    if (stage === "loading") {
        return <AssessmentLoader onComplete={handleLoaderComplete} />;
    }

    if (stage === "guidelines") {
        return (
            <Guidelines
                title={test.title}
                questionCount={test.questionCount}
                duration={test.duration}
                onStart={handleStartTest}
            />
        );
    }

    if (stage === "result" && scoreResult) {
        return (
            <ResultsAnalysis
                score={scoreResult.score}
                totalMarks={questions.reduce((sum, q) => sum + q.marks, 0)}
                correctCount={scoreResult.correctCount}
                totalQuestions={questions.length}
                results={scoreResult.results || []}
            />
        );
    }

    // Default: Test Runner Stage
    if (!test || !questions) return <div className="flex h-screen items-center justify-center"><AssessmentLoader onComplete={() => { }} /></div>;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div>Loading question...</div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div className="hidden md:block">
                        <h1 className="font-bold text-lg text-slate-800 truncate max-w-[300px]">{test.title}</h1>
                        <div className="flex gap-2 mt-0.5">
                            <span className="text-xs font-medium text-slate-500">{test.category}</span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-500 capitalize">{selectedDifficulty || test.difficulty}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end mr-4 hidden sm:flex">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Time Remaining</span>
                        <div className={`flex items-center gap-2 font-mono text-xl font-bold tabular-nums ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                            <Clock className="w-5 h-5 opacity-50" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleSubmitTest}>End Test</Button>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5">
                <div
                    className="bg-blue-600 h-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-4 md:p-6 max-w-5xl flex flex-col">

                {/* Question Area */}
                <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full">
                    <div className="flex justify-between items-end mb-6 mt-4">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                            <Flag className="w-4 h-4 mr-2" /> Report Issue
                        </Button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col"
                        >
                            <div className="p-8 md:p-10 flex-1">
                                <h2 className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed mb-8">
                                    {currentQuestion.question}
                                </h2>

                                <RadioGroup
                                    value={answers[currentQuestion._id] || ""}
                                    onValueChange={(val) => handleAnswerSelect(currentQuestion._id, val)}
                                    className="space-y-4"
                                >
                                    {currentQuestion.options?.map((option, idx) => {
                                        const isSelected = answers[currentQuestion._id] === option;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                                                className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                    ${isSelected
                                                        ? 'border-blue-600 bg-blue-50/30 shadow-[0_0_0_1px_rgba(37,99,235,1)]'
                                                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`
                                                    w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                                                    ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}
                                                `}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                </div>
                                                <span className={`text-lg font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                    {option}
                                                </span>
                                                <RadioGroupItem value={option} id={`opt-${idx}`} className="sr-only" />
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>

                            {/* Footer / Navigation */}
                            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 min-w-[120px]"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                </Button>

                                <div className="flex gap-4">
                                    {currentQuestionIndex === questions.length - 1 ? (
                                        <Button
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleSubmitTest}
                                            disabled={isSubmitted}
                                        >
                                            {isSubmitted ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-2" /> Submit Test
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg shadow-lg shadow-slate-900/20"
                                            onClick={() => setCurrentQuestionIndex(curr => Math.min(questions.length - 1, curr + 1))}
                                        >
                                            Next Question <ChevronRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
