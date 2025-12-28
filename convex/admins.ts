import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllAdmins = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("admins")
            .collect();
    },
});

export const addAdmin = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // Find user by email in job_seekers to promote
        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (user) {
            // Promote Job Seeker -> Admin
            await ctx.db.insert("admins", {
                name: user.name,
                email: user.email,
                tokenIdentifier: user.tokenIdentifier,
                role: "admin",
            });
            await ctx.db.delete(user._id);
            return;
        }

        // Check if already in admins
        const existingAdmin = await ctx.db
            .query("admins")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (existingAdmin) {
            throw new Error("User is already an admin.");
        }

        // Check recruiters? (Optional, let's allow it for now or throw)
        const recruiter = await ctx.db.query("recruiters").withIndex("by_email", q => q.eq("email", args.email)).unique();
        if (recruiter) {
            throw new Error("Recruiters cannot be made admins directly. Please remove recruiter status first.");
        }

        throw new Error("User with this email not found in Job Seekers. They must sign up first.");
    },
});

export const removeAdmin = mutation({
    args: { id: v.id("admins") },
    handler: async (ctx, args) => {
        const admin = await ctx.db.get(args.id);
        if (!admin) throw new Error("Admin not found");

        // Demote Admin -> Job Seeker
        await ctx.db.insert("job_seekers", {
            name: admin.name,
            email: admin.email,
            tokenIdentifier: admin.tokenIdentifier,
            role: "candidate",
            // Initialize required job_seeker fields
            resume: "",
            skills: [],
            experience: [],
            education: [],
            certificates: [],
            projects: [],
            achievements: [],
            responsibilities: [],
            hobbies: [],
        });

        await ctx.db.delete(args.id);
    },
});
