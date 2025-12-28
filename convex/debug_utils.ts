import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const promoteToAdmin = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not logged in");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, { role: "admin" });
        return "You are now an admin!";
    },
});

export const inspectUser = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        const company = recruiter?.companyId ? await ctx.db.get(recruiter.companyId) : null;

        return {
            recruiter,
            company,
            hasCompanyId: !!recruiter?.companyId
        };
    },
});
