import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Toggle Bookmark (Add/Remove)
export const toggleBookmark = mutation({
    args: {
        type: v.string(), // "job", "internship", "practice_paper", "question"
        targetId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const userId = identity.tokenIdentifier;

        const existing = await ctx.db
            .query("bookmarks")
            .withIndex("by_target", (q) => q.eq("targetId", args.targetId).eq("userId", userId))
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
            return false; // Removed
        } else {
            await ctx.db.insert("bookmarks", {
                userId,
                type: args.type,
                targetId: args.targetId,
                createdAt: Date.now(),
            });
            return true; // Added
        }
    },
});

// Track View (Upsert)
export const trackView = mutation({
    args: {
        type: v.string(), // "job", "internship"
        targetId: v.string(),
        metadata: v.optional(v.object({
            title: v.string(),
            subtitle: v.optional(v.string()),
            link: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return; // Silent return for non-logged in

        const userId = identity.tokenIdentifier;

        // Check if recently viewed exists
        // Note: We might want to just insert new ones and limit query, 
        // but for now let's update the timestamp if it exists to bring it to top
        const existing = await ctx.db
            .query("recentlyViewed")
            .filter((q) =>
                q.and(
                    q.eq(q.field("userId"), userId),
                    q.eq(q.field("targetId"), args.targetId)
                )
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                viewedAt: Date.now(),
                metadata: args.metadata, // Update metadata in case it changed
            });
        } else {
            await ctx.db.insert("recentlyViewed", {
                userId,
                type: args.type,
                targetId: args.targetId,
                viewedAt: Date.now(),
                metadata: args.metadata,
            });
        }
    },
});

// Get Bookmarks
export const getBookmarks = query({
    args: {
        type: v.optional(v.string()), // Optional filter
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const userId = identity.tokenIdentifier;

        let q = ctx.db.query("bookmarks").withIndex("by_user", (q) => q.eq("userId", userId));

        if (args.type) {
            const type = args.type;
            q = ctx.db.query("bookmarks").withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type));
        }

        const bookmarks = await q.order("desc").collect();

        // Enrich data if needed (fetching the actual items) uses Promise.all
        // For simplicity, we strictly return the bookmark + enriched data if possible
        // But since types vary, UI usually handles fetching the details or we do it here.
        // Let's do it here for "job" and "internship" types for Watchlist page

        const results = await Promise.all(bookmarks.map(async (b) => {
            let details = null;
            try {
                if (b.type === "job") {
                    details = await ctx.db.get(b.targetId as any);
                } else if (b.type === "internship") {
                    details = await ctx.db.get(b.targetId as any);
                } else if (b.type === "practice_paper") {
                    // Start of fix: Check if ID looks like a valid ID or just wrap in try/catch as db.get throws on invalid format
                    // For now, we will try to fetch, and if it fails (e.g. "skill-0"), catch it.
                    // Also, we might want to support fetching via text ID if we had a proper table, but we don't.
                    details = await ctx.db.get(b.targetId as any);
                }
            } catch (error) {
                // Ignore invalid ID errors
                console.warn(`Failed to fetch details for bookmark ${b._id} (target: ${b.targetId}):`, error);
                details = null;
            }

            // For practice papers (which use mock IDs), if detail is null, we can still return the bookmark
            // so the button state is correct. The UI might show "Content Unavailable" or use the stored metadata if we had it.
            // Since we don't store metadata in the bookmark, we accept that the List View might be broken for these, 
            // but the "Toggle Button" on the card will work.

            return {
                ...b,
                details
            };
        }));

        // Return all bookmarks, even if details are missing (e.g. mock tests)
        // Only filter if you strictly want to hide deleted content. 
        // But for mock tests, they "exist" in code but not DB.
        return results;
    },
});

// Check status (for buttons)
export const getBookmarkStatus = query({
    args: {
        targetIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return {};

        const userId = identity.tokenIdentifier;
        const status: Record<string, boolean> = {};

        await Promise.all(args.targetIds.map(async (id) => {
            const existing = await ctx.db
                .query("bookmarks")
                .withIndex("by_target", (q) => q.eq("targetId", id).eq("userId", userId))
                .unique();
            status[id] = !!existing;
        }));

        return status;
    },
});

export const getRecentlyViewed = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const userId = identity.tokenIdentifier;

        const history = await ctx.db
            .query("recentlyViewed")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .take(20);

        return history;
    },
});
