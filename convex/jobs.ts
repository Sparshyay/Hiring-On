import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const jobs = await ctx.db.query("jobs").order("desc").take(args.limit || 20);

        // Join with company data
        const jobsWithCompany = await Promise.all(
            jobs.map(async (job) => {
                const company = await ctx.db.get(job.companyId);
                return { ...job, company };
            })
        );

        return jobsWithCompany;
    },
});

// Query to get job by ID (accepts string to handle invalid IDs gracefully)
export const getById = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const jobId = ctx.db.normalizeId("jobs", args.id);
        if (!jobId) return null;
        const job = await ctx.db.get(jobId);
        if (!job) return null;
        const company = await ctx.db.get(job.companyId);
        return { ...job, company };
    },
});

// New query to ensure fresh registration and bypass any stale state
export const getPublicJob = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        // Try to normalize as ID, if fails, return null
        const jobId = ctx.db.normalizeId("jobs", args.id);
        if (!jobId) return null;

        const job = await ctx.db.get(jobId);
        if (!job) return null;

        const company = await ctx.db.get(job.companyId);
        return { ...job, company };
    },
});

export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db.query("jobs").order("desc").take(4);
        const jobsWithCompany = await Promise.all(
            jobs.map(async (job) => {
                const company = await ctx.db.get(job.companyId);
                return { ...job, company };
            })
        );
        return jobsWithCompany;
    },
});
