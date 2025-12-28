import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserAnalytics = query({
    args: { userId: v.optional(v.id("job_seekers")) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        let targetUserId;

        if (!args.userId) {
            // Self stats
            // identity is already checked above
            const user = await ctx.db.query("job_seekers").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
            if (!user) return null;
            targetUserId = user._id;
        } else {
            // Admin viewing specific user (args.userId passed as string or cast it)
            // If args.userId is meant to be Id<"users"> but schema changed, we need to cast or fix args
            targetUserId = args.userId as any; // Cast for now as args definition might still say "users"
        }

        // Fetch all test attempts
        const attempts = await ctx.db
            .query("test_attempts")
            .withIndex("by_user", (q) => q.eq("userId", targetUserId))
            .collect();

        // Enrich with test details
        const attemptsWithTest = await Promise.all(
            attempts.map(async (a) => {
                const test = await ctx.db.get(a.testId);
                return { ...a, testTitle: test?.title, testCategory: test?.category };
            })
        );

        // 1. Overview Stats
        const totalTests = attempts.length;
        const completeTests = attempts.filter(a => a.status === "completed");
        const totalScore = completeTests.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const totalAccuracy = completeTests.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);

        const averageScore = completeTests.length > 0 ? Math.round(totalScore / completeTests.length) : 0;
        const averageAccuracy = completeTests.length > 0 ? Math.round(totalAccuracy / completeTests.length) : 0;

        // 2. Category Performance
        const categoryStats: Record<string, { total: number; correct: number; count: number }> = {};

        completeTests.forEach(a => {
            // We can reliably get the category from the enriched list, which has the same index/order or we assume 'a' is from attempts?
            // Actually 'completeTests' are from 'attempts', which don't have 'testCategory'.
            // We need to look up the category from 'attemptsWithTest'.
            const enriched = attemptsWithTest.find(at => at._id === a._id);
            const cat = enriched?.testCategory || "Uncategorized";

            if (!categoryStats[cat]) {
                categoryStats[cat] = { total: 0, correct: 0, count: 0 };
            }
            // Heuristic if specific marks aren't stored perfectly: accuracy * questions? 
            // Better to rely on what we have. If accuracy is 80%, we treat it as score 80/100 for normalization
            categoryStats[cat].total += 100;
            categoryStats[cat].correct += (a.accuracy || 0); // Summing percentages
            categoryStats[cat].count += 1;
        });

        const categoryPerformance = Object.entries(categoryStats).map(([cat, stats]) => ({
            category: cat,
            accuracy: Math.round(stats.correct / stats.count),
            testsTaken: stats.count
        })).sort((a, b) => b.accuracy - a.accuracy);

        // 3. Recent Activity (Last 5)
        const recentActivity = attemptsWithTest
            .sort((a, b) => b.startTime - a.startTime)
            .slice(0, 5)
            .map(a => ({
                id: a._id,
                testName: a.testTitle || "Unknown Test",
                date: a.startTime,
                score: a.score,
                status: a.status
            }));

        // 4. Strengths & Weaknesses
        const strongCategories = categoryPerformance.filter(c => c.accuracy >= 70).map(c => c.category);
        const weakCategories = categoryPerformance.filter(c => c.accuracy < 60).map(c => c.category);

        return {
            overview: {
                totalTests,
                averageScore,
                averageAccuracy,
                testsCompleted: completeTests.length
            },
            categoryPerformance,
            recentActivity,
            insights: {
                strongCategories,
                weakCategories
            }
        };
    },
});
