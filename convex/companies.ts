import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    handler: async (ctx) => {
        const companies = await ctx.db.query("companies").collect();
        const companiesWithJobCounts = await Promise.all(
            companies.map(async (company) => {
                const jobs = await ctx.db
                    .query("jobs")
                    .filter((q) => q.eq(q.field("companyId"), company._id))
                    .collect();
                return {
                    ...company,
                    jobCount: jobs.length,
                };
            })
        );
        return companiesWithJobCounts;
    },
});

export const getTop = query({
    args: {},
    handler: async (ctx) => {
        const companies = await ctx.db.query("companies").take(6);
        return companies.map(c => ({
            ...c,
            jobs: Math.floor(Math.random() * 15) + 1 // Mock job count
        }));
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        description: v.string(),
        location: v.string(),
        website: v.string(),
        logo: v.string(),
        plan: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("companies")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (existing) {
            throw new Error("Company with this email already exists");
        }

        return await ctx.db.insert("companies", {
            ...args,
            status: "Pending",
        });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("companies"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});
