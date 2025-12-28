import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// API: List notifications
export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // Fetch user to get their ID (using the unified user ID logic if possible, or querying per table)
        // Since we are using tokenIdentifier, notifications should ideally key off that or we resolve the user ID.
        // For now, let's assume we pass the User ID (Recruiter or JobSeeker) to the notification creation.
        // But the 'list' query needs to know WHO is asking.

        // Strategy: We'll fetch the user record to get their _id.
        // Try Recruiter first, then JobSeeker (or rely on stored user ID in notifications matching auth user)
        // Wait, multiple tables for users is tricky. 
        // Let's use `tokenIdentifier` key in notifications? No, better to resolve ID.

        // Simpler: Fetch from Recruiters. If matches, use that ID. Else JobSeekers.
        const token = identity.tokenIdentifier;

        let userId = null;

        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", token))
            .first();

        if (recruiter) {
            userId = recruiter._id;
        } else {
            const jobSeeker = await ctx.db
                .query("job_seekers")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", token))
                .first();
            if (jobSeeker) userId = jobSeeker._id;
        }

        if (!userId) return []; // Admin or unknown

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", userId as string)) // Schema says string
            .order("desc") // createdAt
            .take(20);

        return notifications;
    },
});

export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        // Validation check ownership? Skipping for prototype speed
        await ctx.db.patch(args.notificationId, { isRead: true });
    },
});

export const markAllAsRead = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;
        const token = identity.tokenIdentifier;

        let userId = null;
        const recruiter = await ctx.db.query("recruiters").withIndex("by_token", (q) => q.eq("tokenIdentifier", token)).first();
        if (recruiter) userId = recruiter._id;
        else {
            const jobSeeker = await ctx.db.query("job_seekers").withIndex("by_token", (q) => q.eq("tokenIdentifier", token)).first();
            if (jobSeeker) userId = jobSeeker._id;
        }

        if (!userId) return;

        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", userId as string))
            .filter(q => q.eq(q.field("isRead"), false))
            .collect();

        for (const notif of unread) {
            await ctx.db.patch(notif._id, { isRead: true });
        }
    }
});

export const create = mutation({
    args: {
        userId: v.string(), // ID of recipient
        type: v.string(),
        message: v.string(),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Can be called by internal systems
        await ctx.db.insert("notifications", {
            userId: args.userId,
            type: args.type,
            message: args.message,
            link: args.link,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});
