import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        title: v.string(),
        companyId: v.id("companies"),
        location: v.string(),
        type: v.string(),
        salary: v.string(),
        description: v.string(),
        requirements: v.array(v.string()),
        tags: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const jobId = await ctx.db.insert("jobs", {
            ...args,
            postedAt: Date.now(),
            status: "Pending", // Default status for new jobs
        });
        return jobId;
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("jobs"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});
