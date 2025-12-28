import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTests = query({
    args: {
        category: v.optional(v.string()),
        search: v.optional(v.string()),
        type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let tests;

        if (args.search) {
            tests = await ctx.db
                .query("tests")
                .filter((q) => q.eq(q.field("status"), "Published"))
                .collect();

            // Manual filter for search as searchIndex can vary
            const searchLower = args.search.toLowerCase();
            tests = tests.filter(t => t.title.toLowerCase().includes(searchLower) || t.category.toLowerCase().includes(searchLower));

        } else if (args.type) {
            // Filter by type if provided (and no search)
            tests = await ctx.db
                .query("tests")
                .filter((q) => q.and(
                    q.eq(q.field("status"), "Published"),
                    q.eq(q.field("type"), args.type)
                ))
                .collect();
        } else {
            tests = await ctx.db
                .query("tests")
                .filter((q) => q.eq(q.field("status"), "Published"))
                .collect();
        }

        if (args.category && args.category !== "all") {
            tests = tests.filter((t) => t.category.toLowerCase() === args.category?.toLowerCase());
        }

        return tests;
    },
});

export const getTestById = query({
    args: { testId: v.id("tests") },
    handler: async (ctx, args) => {
        const test = await ctx.db.get(args.testId);
        if (!test) return null;

        // Also fetch questions count
        const questions = await ctx.db
            .query("questions")
            .withIndex("by_test", (q) => q.eq("testId", args.testId))
            .collect();

        return {
            ...test,
            questionCount: questions.length
        };
    },
});

export const getQuestions = query({
    args: { testId: v.id("tests") },
    handler: async (ctx, args) => {
        // Ensure user is authenticated to take a test? 
        // For now allow open access but in real app we'd check identity

        const questions = await ctx.db
            .query("questions")
            .withIndex("by_test", (q) => q.eq("testId", args.testId))
            .collect();

        // Remove answers from the response so user can't inspect network tab
        return questions.map(q => ({
            _id: q._id,
            testId: q.testId,
            type: q.type,
            question: q.question,
            options: q.options,
            marks: q.marks,
            codeTemplate: q.codeTemplate,
            // Exclude correctAnswer, explanation, testCases (unless needed which we might for local validation but safer to validations on server)
        }));
    },
});

export const submitTest = mutation({
    args: {
        testId: v.id("tests"),
        answers: v.array(v.object({
            questionId: v.id("questions"),
            selectedOption: v.optional(v.string()),
            code: v.optional(v.string()),
        }))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Try to find user in all tables
        let user: any = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            user = await ctx.db
                .query("recruiters")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
                .unique();
        }

        if (!user) {
            user = await ctx.db
                .query("admins")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
                .unique();
        }

        if (!user) throw new Error("User not found");

        // Calculate Score & Detailed Results
        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;
        const results = [];

        for (const ans of args.answers) {
            const question = await ctx.db.get(ans.questionId);
            if (!question) continue;

            let isCorrect = false;
            // Simple string comparison
            isCorrect = ans.selectedOption === question.correctAnswer;

            if (isCorrect) {
                score += question.marks;
                correctCount++;
            } else {
                wrongCount++;
            }

            results.push({
                questionId: question._id,
                question: question.question,
                selectedOption: ans.selectedOption,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                isCorrect,
                marks: question.marks
            });
        }

        // Record Attempt
        await ctx.db.insert("test_attempts", {
            userId: user._id,
            testId: args.testId,
            startTime: Date.now(),
            endTime: Date.now(),
            status: "completed",
            score: score,
            totalCorrect: correctCount,
            totalWrong: wrongCount,
            totalSkipped: 0,
            accuracy: (correctCount / args.answers.length) * 100
        });

        return {
            score,
            correctCount,
            results
        };
    },
});

export const getTestAnalysis = query({
    args: { attemptId: v.id("test_attempts") },
    handler: async (ctx, args) => {
        const attempt = await ctx.db.get(args.attemptId);
        if (!attempt) return null;

        const test = await ctx.db.get(attempt.testId);
        if (!test) return null;

        const answers = await ctx.db
            .query("test_answers")
            .withIndex("by_attempt", (q) => q.eq("attemptId", args.attemptId))
            .collect();

        // Join questions for rich display
        const enrichedAnswers = await Promise.all(
            answers.map(async (ans) => {
                const question = await ctx.db.get(ans.questionId);
                return {
                    answer: ans,
                    question: question!
                };
            })
        );

        return {
            attempt,
            test,
            answers: enrichedAnswers
        };
    },
});

