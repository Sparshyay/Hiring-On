import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRecommendedTests = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return {
                tests: [],
                hasProfile: false
            };
        }

        // 1. Fetch User Profile
        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        // If no user profile found, return basic state (or prompt to create profile)
        if (!user) {
            return {
                tests: [],
                hasProfile: false
            };
        }

        const limit = args.limit || 6;
        let recommendedTests = [];

        // 2. Extract Skills & Role
        const userSkills = (user.skills || []).map(s => s.toLowerCase());
        const userRole = user.role?.toLowerCase() || "";

        // 3. Strategy: Match tests by Category or Tags
        // Efficient query if we had a proper search index, for now collecting filtering
        // In production, use search("search_title", ...) or specific filters

        const allTests = await ctx.db.query("tests")
            .filter(q => q.eq(q.field("status"), "Published"))
            .collect();

        // Scoring Logic
        const scoredTests = allTests.map(test => {
            let score = 0;
            const testCat = test.category.toLowerCase();
            const testTags = (test.tags || []).map(t => t.toLowerCase());

            // Exact Category Match
            if (userSkills.some(skill => testCat.includes(skill))) score += 10;

            // Tag Match
            const tagMatches = testTags.filter(tag => userSkills.includes(tag)).length;
            score += tagMatches * 3;

            // Role Match (e.g. "React Developer" checks "React" tests)
            if (userRole && (testCat.includes(userRole) || testTags.some(t => userRole.includes(t)))) {
                score += 5;
            }

            // Difficulty weighting (optional: prefer Intermediate/Expert if experience high)
            // For now, simple mixing

            return { test, score };
        });

        // Filter valid scores and sort
        recommendedTests = scoredTests
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.test)
            .slice(0, limit);

        // Fallback: If no matches, return most popular or random beginners
        if (recommendedTests.length === 0) {
            recommendedTests = allTests
                .filter(t => t.difficulty === "Beginner")
                .slice(0, limit);
        }

        return {
            tests: recommendedTests,
            hasProfile: true,
            skillsFound: userSkills.length > 0
        };
    },
});
