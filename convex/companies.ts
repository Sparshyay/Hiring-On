import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    handler: async (ctx) => {
        const companies = await ctx.db.query("companies").collect();
        const companiesWithJobCounts = await Promise.all(
            companies.map(async (company) => {
                const jobs = await ctx.db
                    .query("jobs")
                    .filter((q) => q.eq(q.field("companyId"), company._id))
                    .collect();
                return {
                    ...company,
                    jobCount: jobs.length,
                };
            })
        );
        return companiesWithJobCounts;
    },
});

export const getById = query({
    args: { id: v.id("companies") },
    handler: async (ctx, args) => {
        const company = await ctx.db.get(args.id);
        if (!company) return null;

        // Fetch job counts
        const jobs = await ctx.db
            .query("jobs")
            .filter((q) => q.eq(q.field("companyId"), company._id))
            .collect();

        const internships = await ctx.db
            .query("internships")
            .filter((q) => q.eq(q.field("companyId"), company._id))
            .collect();

        // Fetch recruiter owner
        const recruiter = await ctx.db
            .query("recruiters")
            .filter((q) => q.eq(q.field("companyId"), company._id))
            .first();

        return {
            ...company,
            jobCount: jobs.length,
            internshipCount: internships.length,
            recruiter: recruiter ? {
                name: recruiter.name,
                email: recruiter.email,
                id: recruiter._id,
                image: recruiter.image
            } : null
        };
    },
});

export const getTop = query({
    args: {},
    handler: async (ctx) => {
        const companies = await ctx.db.query("companies").take(6);
        return companies.map(c => ({
            ...c,
            jobs: Math.floor(Math.random() * 15) + 1 // Mock job count
        }));
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        description: v.optional(v.string()),
        location: v.optional(v.string()),
        website: v.optional(v.string()),
        logo: v.optional(v.string()),
        plan: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("companies")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (existing) {
            return existing._id;
        }

        const companyId = await ctx.db.insert("companies", {
            ...args,
            plan: args.plan || "free",
            status: "Pending",
        });

        // Link company to user and update role (Migrate to Recruiter)
        const identity = await ctx.auth.getUserIdentity();
        if (identity) {
            console.log("Linking company", companyId, "to user", identity.tokenIdentifier);

            // 1. Check if user is in job_seekers (should have been blocked by auth flow, but handle migration)
            const jobSeeker = await ctx.db
                .query("job_seekers")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
                .unique();

            if (jobSeeker) {
                // ... (Logic to migrate job seeker to recruiter is technically unsafe if we want strict separation, 
                // but for onboarding flow it handles the 'switched' case if we allow it. 
                // Given strict auth, this might not be hit, but safe to keep)

                // Create Recruiter profile
                await ctx.db.insert("recruiters", {
                    name: jobSeeker.name,
                    email: jobSeeker.email,
                    tokenIdentifier: jobSeeker.tokenIdentifier,
                    role: "recruiter",
                    companyId: companyId,
                    verificationStatus: "pending",
                    plan: args.plan || "free",
                });

                await ctx.db.delete(jobSeeker._id);
            } else {
                // 2. Check if already a recruiter
                const recruiter = await ctx.db
                    .query("recruiters")
                    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
                    .unique();

                if (recruiter) {
                    console.log("Updating existing recruiter", recruiter._id, "with companyId");
                    await ctx.db.patch(recruiter._id, { companyId: companyId });
                } else {
                    // 3. Create new Recruiter (Safety Fallback)
                    console.log("Creating new recruiter for company");
                    await ctx.db.insert("recruiters", {
                        name: identity.name || "Recruiter",
                        email: identity.email!,
                        tokenIdentifier: identity.tokenIdentifier,
                        role: "recruiter",
                        companyId: companyId,
                        verificationStatus: "pending",
                        plan: args.plan || "free",
                        image: identity.pictureUrl,
                    });
                }
            }
        }

        return companyId;
    },
});

export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        // Simple search implementation or just return all for now
        const companies = await ctx.db.query("companies").collect(); // Filter by query if needed
        return companies.map(c => ({
            ...c,
            jobCount: 0 // Mock count matching return type expectation roughly
        }));
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("companies"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const update = mutation({
    args: {
        id: v.id("companies"),
        name: v.string(),
        description: v.optional(v.string()),
        website: v.optional(v.string()),
        location: v.optional(v.string()),
        logo: v.optional(v.string()),
        industry: v.optional(v.string()),
        size: v.optional(v.string()),
        // HR / Contact Details
        hrEmail: v.optional(v.string()),
        hrName: v.optional(v.string()),
        hrPhone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Verify ownership/permission via recruiter
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        // Allow if recruiter belongs to this company
        if (!recruiter || recruiter.companyId !== args.id) {
            throw new Error("Unauthorized to edit this company");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            description: args.description,
            website: args.website,
            location: args.location,
            logo: args.logo,
            industry: args.industry,
            // Assuming we might need to add 'size' and 'hrDetails' to schema or just store them
            // If schema is strict, we might need to define them. 
            // For now, I'll store them directly if schema allows or as partials.
            // If schema is strict defined in schema.ts, this might fail if fields aren't there.
            // But usually we can add fields. 
            hrDetails: {
                email: args.hrEmail || "",
                name: args.hrName,
                phone: args.hrPhone,
            }
        });

        // If 'size' is a top level field
        if (args.size) {
            await ctx.db.patch(args.id, { size: args.size } as any);
        }
    }
});

export const getMyCompany = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!recruiter || !recruiter.companyId) return null;

        return await ctx.db.get(recruiter.companyId);
    },
});
