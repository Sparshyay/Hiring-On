import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    jobs: defineTable({
        title: v.string(),
        companyId: v.id("companies"),
        location: v.string(),
        type: v.string(),
        salary: v.string(),
        description: v.string(),
        requirements: v.array(v.string()),
        postedAt: v.number(),
        status: v.string(),
        tags: v.array(v.string()),
    }),
    companies: defineTable({
        name: v.string(),
        logo: v.string(),
        description: v.string(),
        location: v.string(),
        website: v.string(),
        email: v.string(),
        status: v.string(), // Pending, Verified, Rejected
        plan: v.string(), // Free, Pro, Enterprise
    }),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(), // Clerk ID
        resume: v.optional(v.string()), // URL or base64
        skills: v.optional(v.array(v.string())),
        experience: v.optional(v.array(v.any())), // Simplified for now
    }).index("by_token", ["tokenIdentifier"]),
});
