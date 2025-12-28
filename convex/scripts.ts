import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const promoteByEmail = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .unique();

        if (!user) {
            console.log(`User with email ${args.email} not found.`);
            return;
        }

        await ctx.db.patch(user._id, { role: "admin" });
        console.log(`User ${args.email} promoted to admin.`);
    },
});
