import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get Recruiter Dashboard Stats
export const getDashboardStats = query({
    args: { userId: v.id("recruiters"), companyId: v.optional(v.id("companies")) },
    handler: async (ctx, args) => {
        // If no companyId, we can't show company specific stats
        // In a real app, we'd look up the user's company
        if (!args.companyId) {
            return {
                activeJobs: 0,
                totalApplications: 0,
                totalViews: 0,
                shortlisted: 0,
            };
        }

        const jobs = await ctx.db
            .query("jobs")
            .withIndex("by_company", (q) => q.eq("companyId", args.companyId!))
            .collect();

        const activeJobs = jobs.filter(j => j.status === "Active").length;
        const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

        // Count applications for these jobs
        // This is expensive in a real DB without aggression, but okay for MVP
        let totalApplications = 0;
        let shortlisted = 0;

        for (const job of jobs) {
            const apps = await ctx.db
                .query("applications")
                .withIndex("by_job", (q) => q.eq("jobId", job._id))
                .collect();

            totalApplications += apps.length;
            shortlisted += apps.filter(a => a.status.includes("Shortlisted") || a.status === "Selected").length;
        }

        return {
            activeJobs,
            totalApplications,
            totalViews,
            shortlisted,
        };
    },
});

export const getRecentActivities = query({
    args: { userId: v.id("recruiters") },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId as any))
            .order("desc")
            .take(10);

        return notifications;
    },
});

export const getAllRecruiters = query({
    args: {},
    handler: async (ctx) => {
        const recruiters = await ctx.db
            .query("recruiters")
            .collect();

        // Enhance with company details if needed
        const recruitersWithCompany = await Promise.all(
            recruiters.map(async (recruiter) => {
                let company = null;
                if (recruiter.companyId) {
                    company = await ctx.db.get(recruiter.companyId);
                }
                return { ...recruiter, company };
            })
        );

        return recruitersWithCompany;
    },
});

export const verifyRecruiter = mutation({
    args: { userId: v.id("recruiters"), status: v.string() }, // status: "verified" | "rejected"
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { verificationStatus: args.status });
    },
});

export const updateRecruiterPlan = mutation({
    args: { userId: v.id("recruiters"), plan: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { plan: args.plan });
        const user = await ctx.db.get(args.userId);
        if (user?.companyId) {
            const company = await ctx.db.get(user.companyId);
            if (company) {
                await ctx.db.patch(user.companyId, { plan: args.plan });
            }
        }
    },
});

export const deleteRecruiter = mutation({
    args: { userId: v.id("recruiters") },
    handler: async (ctx, args) => {
        const recruiter = await ctx.db.get(args.userId);
        if (!recruiter) return;

        if (recruiter.companyId) {
            await ctx.db.delete(recruiter.companyId);
        }

        await ctx.db.delete(args.userId);
    },
});

export const selfHealRecruiter = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const email = identity.email!;

        // Find company by email
        const company = await ctx.db
            .query("companies")
            .filter((q) => q.eq(q.field("email"), email))
            .first();

        if (!company) {
            console.log("Self-heal: No company found for", email);
            return;
        }

        // Find recruiter
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (recruiter && !recruiter.companyId) {
            console.log("Self-heal: Linking company", company._id, "to recruiter", recruiter._id);
            await ctx.db.patch(recruiter._id, { companyId: company._id });
        }
    },
});

export const completeOnboarding = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        description: v.optional(v.string()),
        location: v.optional(v.string()),
        website: v.optional(v.string()),
        logo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const existingCompany = await ctx.db
            .query("companies")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        let companyId;
        if (existingCompany) {
            companyId = existingCompany._id;
            await ctx.db.patch(companyId, {
                name: args.name,
                description: args.description,
                location: args.location,
                website: args.website,
                logo: args.logo,
                status: "Pending",
                plan: "free",
            });
        } else {
            companyId = await ctx.db.insert("companies", {
                name: args.name,
                email: args.email,
                description: args.description,
                location: args.location,
                website: args.website,
                logo: args.logo,
                status: "Pending",
                plan: "free",
            });
        }

        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!recruiter) throw new Error("Recruiter not found");

        await ctx.db.patch(recruiter._id, {
            companyId: companyId,
            verificationStatus: "pending",
            plan: "free",
        });

        return "success";
    },
});
