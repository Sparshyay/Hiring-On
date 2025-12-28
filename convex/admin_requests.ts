import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Request admin access
export const requestAccess = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const user = await ctx.db
            .query("job_seekers") // Assume only candidates request access for now
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            // Check if already recruiter
            const recruiter = await ctx.db.query("recruiters").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
            if (recruiter) throw new Error("Recruiters cannot become admins directly.");

            // Check if already admin
            const admin = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
            if (admin) throw new Error("Already an admin");

            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, { isRequestingAdmin: true });
    },
});

// Get all pending requests
export const getPendingRequests = query({
    args: {},
    handler: async (ctx) => {
        // Fetch users from job_seekers who are requesting admin
        const users = await ctx.db
            .query("job_seekers")
            .filter((q) => q.eq(q.field("isRequestingAdmin"), true))
            .collect();

        return users.map(u => ({ ...u, role: "candidate" }));
    },
});

// Approve a request
export const approveRequest = mutation({
    args: { userId: v.id("job_seekers") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // Verify the actor is an admin
        const actor = await ctx.db
            .query("admins")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!actor || actor.role !== "admin") {
            throw new Error("Unauthorized");
        }

        // Get the candidate
        const candidate = await ctx.db.get(args.userId);
        if (!candidate) throw new Error("Candidate not found");

        // Migrate to Admins
        await ctx.db.insert("admins", {
            name: candidate.name,
            email: candidate.email,
            tokenIdentifier: candidate.tokenIdentifier,
            role: "admin"
        });

        // Delete from Job Seekers
        await ctx.db.delete(args.userId);
    },
});

// Reject a request
export const rejectRequest = mutation({
    args: { userId: v.id("job_seekers") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const actor = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (!actor) throw new Error("Unauthorized");

        await ctx.db.patch(args.userId, {
            isRequestingAdmin: false
        });
    },
});
