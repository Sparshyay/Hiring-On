import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllBlogs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("blogs").order("desc").collect();
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("blogs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

export const getBlogsByAuthor = query({
    args: { authorId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("blogs")
            .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
            .order("desc")
            .collect();
    }
});

export const createBlog = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        tags: v.array(v.string()),
        id: v.optional(v.id("blogs")), // For updates via save
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Determine Role (simplified check, ideally use a helper or db check)
        // We will try to find them in Admins or Recruiters
        let authorName = identity.name || "User";
        let authorRole = "recruiter"; // Default/Fallback
        let authorImage = identity.pictureUrl;

        const admin = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (admin) {
            authorRole = "admin";
            authorName = admin.name;
        } else {
            const recruiter = await ctx.db.query("recruiters").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
            if (recruiter) {
                authorName = recruiter.name;
                // authorRole is already recruiter
            }
        }

        // Slug generation
        let slug = args.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        // Append timestamp to slug to avoid collisions if title is same
        slug = `${slug}-${Date.now()}`;

        if (args.id) {
            // Handle Update
            const { id, ...updates } = args;
            // Check ownership if not admin
            const existing = await ctx.db.get(id);
            if (!existing) throw new Error("Blog not found");

            if (authorRole !== "admin" && existing.authorId !== identity.subject) {
                throw new Error("Unauthorized to edit this blog");
            }

            await ctx.db.patch(id, {
                ...updates,
                // Don't update slug to preserve SEO or links, or update logic if needed
                // author info remains original creator or updater? usually original creator
            });
            return id;
        } else {
            // Create New
            return await ctx.db.insert("blogs", {
                ...args,
                slug,
                author: authorName,
                authorId: identity.subject,
                authorRole: authorRole,
                authorImage: authorImage,
                publishedAt: Date.now(),
                isPublished: true,
            });
        }
    },
});

export const deleteBlog = mutation({
    args: { id: v.id("blogs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const blog = await ctx.db.get(args.id);
        if (!blog) return;

        // Check permission: Admin can delete all, Recruiter only their own
        const admin = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();

        if (!admin && blog.authorId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});

export const updateBlog = mutation({
    args: {
        id: v.id("blogs"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        coverImage: v.optional(v.string()),
        excerpt: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});
