import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user && user.resume) {
            // Check if it's a URL (http, https, blob) - if so, return as is (legacy or external)
            if (user.resume.startsWith("http") || user.resume.startsWith("blob:")) {
                return user;
            }

            // Otherwise assume it's a Storage ID
            try {
                const url = await ctx.storage.getUrl(user.resume);
                if (url) {
                    return { ...user, resume: url };
                }
            } catch (e) {
                // If it fails (e.g. invalid ID format that slipped through), return original
                console.error("Failed to resolve resume URL:", e);
                return user;
            }
        }

        return user;
    },
});

// Replaces createUser with a more robust syncUser
// Syncs Clerk user to Convex
export const syncUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called syncUser without authentication present");
        }

        // Check all tables
        const admin = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (admin) return admin._id;

        const recruiter = await ctx.db.query("recruiters").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (recruiter) return recruiter._id;

        const jobSeeker = await ctx.db.query("job_seekers").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (jobSeeker) return jobSeeker._id;

        // Create new Job Seeker by default
        const userId = await ctx.db.insert("job_seekers", {
            name: identity.name || "User",
            email: identity.email!,
            tokenIdentifier: identity.tokenIdentifier,
            role: "candidate",
            resume: "",
            skills: [],
            experience: [],
            education: [],
            certificates: [],
            projects: [],
            achievements: [],
            responsibilities: [],
            hobbies: [],
        });

        return userId;
    },
});

export const createUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        role: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createUser without authentication present");
        }

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user !== null) {
            return user._id;
        }

        const userId = await ctx.db.insert("job_seekers", {
            name: args.name,
            email: args.email,
            tokenIdentifier: identity.tokenIdentifier,
            role: args.role || "candidate",
            resume: "",
            skills: [],
            experience: [],
            education: [],
            certificates: [],
            projects: [],
            achievements: [],
            responsibilities: [],
            hobbies: [],
        });

        return userId;
    },
});

export const updateResume = mutation({
    args: {
        resume: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called updateResume without authentication present");
        }

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, { resume: args.resume });
    },
});

export const updateProfile = mutation({
    args: {
        // Basic Details
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        username: v.optional(v.string()),
        mobile: v.optional(v.string()),
        gender: v.optional(v.string()),
        userType: v.optional(v.string()),
        domain: v.optional(v.string()),
        domainId: v.optional(v.id("domains")),
        course: v.optional(v.string()),
        courseId: v.optional(v.id("courses")),
        courseSpecialization: v.optional(v.string()),
        specializationId: v.optional(v.id("specializations")),
        courseDuration: v.optional(v.object({
            startYear: v.string(),
            endYear: v.string(),
        })),
        organization: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        purpose: v.optional(v.string()),
        role: v.optional(v.string()),
        preferredWorkLocation: v.optional(v.string()),
        currentLocation: v.optional(v.string()),

        // New fields
        careerGoals: v.optional(v.string()),

        // Resume & About
        resume: v.optional(v.string()),
        about: v.optional(v.string()),

        // Skills
        skills: v.optional(v.array(v.string())),

        // Education
        education: v.optional(v.array(v.any())),

        // Experience
        experience: v.optional(v.array(v.any())),

        // Accomplishments
        certificates: v.optional(v.array(v.any())),
        projects: v.optional(v.array(v.any())),
        achievements: v.optional(v.array(v.any())),
        responsibilities: v.optional(v.array(v.any())),

        // Personal Details
        pronouns: v.optional(v.string()),
        dateOfBirth: v.optional(v.string()),
        currentAddress: v.optional(v.any()),
        permanentAddress: v.optional(v.any()),
        hobbies: v.optional(v.array(v.string())),

        // Social Links
        socialLinks: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("You must be logged in to update your profile.");
        }

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User profile not found. Are you a recruiter?");
        }

        // Filter out undefined values
        const updates: any = {};
        Object.keys(args).forEach((key) => {
            const value = args[key as keyof typeof args];
            if (value !== undefined) {
                updates[key] = value;
            }
        });

        await ctx.db.patch(user._id, updates);
        return user._id;
    },
});

export const checkProfileCompletion = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { isComplete: false, missingFields: ["authentication"] };
        }

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            return { isComplete: false, missingFields: ["user record"] };
        }

        // Check required fields
        const missingFields: string[] = [];

        if (!user.firstName) missingFields.push("firstName");
        if (!user.username) missingFields.push("username");
        if (!user.email) missingFields.push("email");
        if (!user.mobile) missingFields.push("mobile");
        if (!user.gender) missingFields.push("gender");
        if (!user.userType) missingFields.push("userType");
        if (!user.domain) missingFields.push("domain");
        if (!user.currentLocation) missingFields.push("currentLocation");

        return {
            isComplete: missingFields.length === 0,
            missingFields,
        };
    },
});

export const getAllCandidates = query({
    args: {},
    handler: async (ctx) => {
        const candidates = await ctx.db
            .query("job_seekers")
            .collect(); // All in job_seekers are candidates by definition? Or filter by role="candidate" if needed.
        return candidates;
    },
});

export const becomeRecruiter = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            // Check if already recruiter
            const existing = await ctx.db.query("recruiters").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
            if (existing) throw new Error("Already a recruiter");
            throw new Error("User not found or is an admin.");
        }

        // Migration: Job Seeker -> Recruiter
        await ctx.db.insert("recruiters", {
            name: user.name,
            email: user.email,
            tokenIdentifier: user.tokenIdentifier,
            role: "recruiter",
            verificationStatus: "pending",
            plan: "free",
        });

        await ctx.db.delete(user._id);
    },
});
