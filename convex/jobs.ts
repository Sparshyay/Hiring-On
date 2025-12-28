import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const jobs = await ctx.db.query("jobs").order("desc").take(args.limit || 20);

        // Join with company data and resolve URLs
        const jobsWithCompany = await Promise.all(
            jobs.map(async (job) => {
                const company = await ctx.db.get(job.companyId);
                let logoUrl = null;
                if (job.companyLogo) {
                    try {
                        logoUrl = await ctx.storage.getUrl(job.companyLogo);
                    } catch (e) {
                        console.error("Invalid storage ID for job logo:", job.companyLogo);
                    }
                } else if (company?.logo) {
                    try {
                        logoUrl = await ctx.storage.getUrl(company.logo);
                    } catch (e) {
                        console.error("Invalid storage ID for company logo:", company.logo);
                    }
                }

                return {
                    ...job,
                    company: company ? { ...company, logoUrl } : null,
                    logoUrl
                };
            })
        );

        return jobsWithCompany;
    },
});

export const getAllJobsAdmin = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db.query("jobs").order("desc").collect();

        // Fetch company names for each job
        const jobsWithCompany = await Promise.all(
            jobs.map(async (job) => {
                const company = await ctx.db.get(job.companyId);
                return { ...job, companyName: company?.name || "Unknown" };
            })
        );

        return jobsWithCompany;
    },
});

// Query to get job by ID (accepts string to handle invalid IDs gracefully)
export const getById = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const jobId = ctx.db.normalizeId("jobs", args.id);
        if (!jobId) return null;
        const job = await ctx.db.get(jobId);
        if (!job) return null;
        const company = await ctx.db.get(job.companyId);

        let logoUrl = null;
        if (job.companyLogo) {
            try {
                logoUrl = await ctx.storage.getUrl(job.companyLogo);
            } catch (e) {
                console.error("Invalid storage ID for job logo:", job.companyLogo);
            }
        } else if (company?.logo) {
            try {
                logoUrl = await ctx.storage.getUrl(company.logo);
            } catch (e) {
                console.error("Invalid storage ID for company logo:", company.logo);
            }
        }

        return {
            ...job,
            company: company ? { ...company, logoUrl } : null,
            logoUrl
        };
    },
});

// New query to ensure fresh registration and bypass any stale state
export const getPublicJob = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        // Try to normalize as ID, if fails, return null
        const jobId = ctx.db.normalizeId("jobs", args.id);
        if (!jobId) return null;

        const job = await ctx.db.get(jobId);
        if (!job) return null;

        const company = await ctx.db.get(job.companyId);

        let logoUrl = null;
        if (job.companyLogo) {
            try {
                logoUrl = await ctx.storage.getUrl(job.companyLogo);
            } catch (e) {
                console.error("Invalid storage ID for job logo:", job.companyLogo);
            }
        } else if (company?.logo) {
            try {
                logoUrl = await ctx.storage.getUrl(company.logo);
            } catch (e) {
                console.error("Invalid storage ID for company logo:", company.logo);
            }
        }

        return {
            ...job,
            company: company ? { ...company, logoUrl } : null,
            logoUrl
        };
    },
});

export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db.query("jobs").order("desc").take(4);
        const jobsWithCompany = await Promise.all(
            jobs.map(async (job) => {
                const company = await ctx.db.get(job.companyId);
                let logoUrl = null;
                if (job.companyLogo) {
                    try {
                        logoUrl = await ctx.storage.getUrl(job.companyLogo);
                    } catch (e) {
                        console.error("Invalid storage ID for job logo:", job.companyLogo);
                    }
                } else if (company?.logo) {
                    try {
                        logoUrl = await ctx.storage.getUrl(company.logo);
                    } catch (e) {
                        console.error("Invalid storage ID for company logo:", company.logo);
                    }
                }
                return {
                    ...job,
                    company: company ? { ...company, logoUrl } : null,
                    logoUrl
                };
            })
        );
        return jobsWithCompany;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        companyId: v.id("companies"),
        location: v.string(),
        type: v.string(),
        workMode: v.string(),
        salary: v.string(),
        salaryDuration: v.optional(v.string()),

        description: v.string(),
        requirements: v.array(v.string()),
        tags: v.array(v.string()),

        applicationDeadline: v.optional(v.number()),
        workDays: v.optional(v.string()),
        workHours: v.optional(v.string()),

        minExperience: v.optional(v.number()),
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
        const id = await ctx.db.insert("jobs", {
            companyId: args.companyId,
            title: args.title,
            description: args.description,
            location: args.location,
            type: args.type,
            workMode: args.workMode,
            salary: args.salary,
            salaryDuration: args.salaryDuration || "year", // Default to year

            applicationDeadline: args.applicationDeadline,
            workDays: args.workDays,
            workHours: args.workHours,

            requirements: args.requirements,
            tags: args.tags,

            minExperience: args.minExperience,
            minEducation: args.minEducation,
            requiredSkills: args.requiredSkills,

            customApplyForm: args.customApplyForm,

            companyLogo: args.companyLogo,

            postedAt: Date.now(),
            status: "active",

            // Default analytics
            views: 0,
            clicks: 0,
        });
        return id;
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("jobs"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    }
});

export const deleteJob = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const toggleFeatured = mutation({
    args: { id: v.id("jobs"), isFeatured: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
    }
});
