import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { QueryCtx } from "./_generated/server";

// Helper function to fetch internships with company details
async function fetchInternships(ctx: QueryCtx) {
    const internships = await ctx.db
        .query("internships")
        .withIndex("by_status", (q) => q.eq("status", "Active"))
        .filter((q) => {
            const deadline = q.field("applicationDeadline");
            return q.or(
                q.eq(deadline, undefined),
                q.gte(deadline, Date.now())
            );
        })
        .order("desc")
        .collect();

    // Enrich with Company details
    const enriched = await Promise.all(
        internships.map(async (internship) => {
            const company = await ctx.db.get(internship.companyId);
            return { ...internship, company };
        })
    );

    return enriched;
}

// Get All Internships (Public/Shared)
export const getAllInternships = query({
    args: {},
    handler: async (ctx) => {
        return await fetchInternships(ctx);
    },
});

// Get My Internships (Recruiter)
export const getMyInternships = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!recruiter || !recruiter.companyId) return [];

        const internships = await ctx.db
            .query("internships")
            .withIndex("by_company", (q) => q.eq("companyId", recruiter.companyId!))
            .order("desc")
            .collect();

        // Enrich if needed (e.g. Applicant counts)
        // For now return raw
        return internships;
    },
});

// Create Internship (Recruiter)
export const create = mutation({
    args: {
        title: v.string(),
        location: v.string(),
        type: v.string(),
        workMode: v.string(),
        stipend: v.string(),
        duration: v.string(),
        description: v.string(),
        requirements: v.array(v.string()),
        tags: v.array(v.string()),

        applicationDeadline: v.optional(v.number()),
        workDays: v.optional(v.string()),
        workHours: v.optional(v.string()),

        minEducation: v.optional(v.string()),
        requiredSkills: v.optional(v.array(v.string())),

        customApplyForm: v.optional(v.array(v.object({
            id: v.string(),
            question: v.string(),
            type: v.string(),
            options: v.optional(v.array(v.string())),
            isRequired: v.boolean(),
        }))),

        companyLogo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Resolve Recruiter & Company
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!recruiter || !recruiter.companyId) throw new Error("Recruiter not found or no company");

        const company = await ctx.db.get(recruiter.companyId);
        if (!company) throw new Error("Company not found");

        const internshipId = await ctx.db.insert("internships", {
            title: args.title,
            companyId: recruiter.companyId,
            location: args.location,
            type: args.type,
            workMode: args.workMode,
            stipend: args.stipend,
            duration: args.duration,
            description: args.description,
            requirements: args.requirements,
            tags: args.tags,

            applicationDeadline: args.applicationDeadline
                ? new Date(args.applicationDeadline).setHours(23, 59, 59, 999)
                : undefined,

            workDays: args.workDays,
            workHours: args.workHours,

            minEducation: args.minEducation,
            requiredSkills: args.requiredSkills,

            customApplyForm: args.customApplyForm,

            status: "Active",
            postedAt: Date.now(),
            views: 0,
            clicks: 0,
            companyLogo: company.logo,
            companyBanner: company.banner,
        });

        return internshipId;
    }
});

// Admin Dashboard Query
export const getInternshipsForAdmin = query({
    args: {},
    handler: async (ctx) => {
        // In real app, add admin check here:
        // const user = await ctx.auth.getUserIdentity();
        // if (!user || user.role !== "admin") throw new Error("Unauthorized");
        return await fetchInternships(ctx);
    }
});

// Query to get internship by ID (accepts string to handle invalid IDs gracefully)
export const getById = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const internshipId = ctx.db.normalizeId("internships", args.id);
        if (!internshipId) return null;

        const internship = await ctx.db.get(internshipId);
        if (!internship) return null;

        const company = await ctx.db.get(internship.companyId);

        let logoUrl = null;
        if (internship.companyLogo) {
            try {
                logoUrl = await ctx.storage.getUrl(internship.companyLogo);
            } catch (e) {
                console.error("Invalid storage ID for internship logo:", internship.companyLogo);
            }
        } else if (company?.logo) {
            try {
                logoUrl = await ctx.storage.getUrl(company.logo);
            } catch (e) {
                console.error("Invalid storage ID for company logo:", company.logo);
            }
        }

        return {
            ...internship,
            company: company ? { ...company, logoUrl } : null,
            logoUrl
        };
    },
});

// Update Internship (Edit) ->
export const update = mutation({
    args: {
        id: v.id("internships"),
        title: v.optional(v.string()),
        location: v.optional(v.string()),
        type: v.optional(v.string()),
        stipend: v.optional(v.string()),
        duration: v.optional(v.string()),
        description: v.optional(v.string()),
        requirements: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        minEducation: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    }
});

// Admin: Update Status (Approve/Reject)
export const updateStatus = mutation({
    args: {
        id: v.id("internships"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    }
});

export const deleteInternship = mutation({
    args: { id: v.id("internships") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const toggleFeatured = mutation({
    args: { id: v.id("internships"), isFeatured: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
    }
});

