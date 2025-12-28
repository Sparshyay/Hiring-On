import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchUniversities = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("universities")
            .withSearchIndex("search_name", (q) => q.search("name", args.query))
            .take(10);
    },
});

export const searchColleges = query({
    args: { query: v.string(), universityId: v.optional(v.id("universities")) },
    handler: async (ctx, args) => {
        if (args.query) {
            let q = ctx.db
                .query("colleges")
                .withSearchIndex("search_name", (q) => q.search("name", args.query));

            if (args.universityId) {
                q = q.filter((q) => q.eq(q.field("universityId"), args.universityId));
            }

            return await q.take(20);
        }

        if (args.universityId) {
            return await ctx.db
                .query("colleges")
                .withIndex("by_university", (q) => q.eq("universityId", args.universityId))
                .take(20);
        }

        return [];
    },
});

export const searchSkills = query({
    args: { query: v.string(), domain: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("skills")
            .withSearchIndex("search_name", (q) => q.search("name", args.query))
            .take(10);
    },
});

export const getDomains = query({
    handler: async (ctx) => {
        return await ctx.db.query("domains").collect();
    },
});

export const getCourses = query({
    args: { domainId: v.id("domains") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("courses")
            .withIndex("by_domain", (q) => q.eq("domainId", args.domainId))
            .collect();
    },
});

export const getSpecializations = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("specializations")
            .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
            .collect();
    },
});
