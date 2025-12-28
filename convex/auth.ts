import { query, mutation } from "./_generated/server";
// Auth functions for multi-table user system
import { v } from "convex/values";

/**
 * getUser:
 * Attempts to find the user in `admins`, `recruiters`, or `job_seekers`.
 * Returns the user object with an injected `role` field.
 */
export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        // 1. Check Admins
        const admin = await ctx.db
            .query("admins")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (admin) {
            return { ...admin, role: "admin", _id: admin._id };
        }

        // 2. Check Recruiters
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (recruiter) {
            // Recruiter might have a custom verification status
            return { ...recruiter, role: "recruiter", _id: recruiter._id };
        }

        // 3. Check Job Seekers
        const jobSeeker = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (jobSeeker) {
            // Handle resume URL if needed
            let resumeUrl = jobSeeker.resume;
            if (resumeUrl && !resumeUrl.startsWith("http") && !resumeUrl.startsWith("blob:")) {
                try {
                    resumeUrl = await ctx.storage.getUrl(resumeUrl) || "";
                } catch (e) {
                    console.error("Failed to resolve resume URL", e);
                }
            }

            return { ...jobSeeker, resume: resumeUrl, role: "candidate", _id: jobSeeker._id };
        }

        // Not found in any table (New User)
        return null;
    },
});

/**
 * syncUser:
 * Called after Clerk login. Identifies where to put the user.
 * - If they exist in any table, return ID.
 * - If new, default to `job_seekers` (Candidate).
 * - Exception: If we have a separate "Host Signup" flow that calls a specific mutation,
 *   that mutation should create the Recruiter record directly.
 *   This `syncUser` is primarily for the generic "Sign In" or "Sign Up" flow.
 */
export const syncUser = mutation({
    args: { role: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called syncUser without authentication");
        }

        const email = identity.email!;
        const requestedRole = args.role || "candidate"; // Default intent

        // 1. Fetch existing concurrent roles to check for collisions/persistence
        const existingAdmin = await ctx.db.query("admins").withIndex("by_email", q => q.eq("email", email)).unique();
        const existingRecruiter = await ctx.db.query("recruiters").withIndex("by_email", q => q.eq("email", email)).unique();
        const existingJobSeeker = await ctx.db.query("job_seekers").withIndex("by_email", q => q.eq("email", email)).unique();

        // SUPER ADMIN BYPASS
        if (email === "sicario.official28@gmail.com") {
            if (existingAdmin) return existingAdmin._id;
            // cleanup others
            if (existingRecruiter) await ctx.db.delete(existingRecruiter._id);
            if (existingJobSeeker) await ctx.db.delete(existingJobSeeker._id);
            return await ctx.db.insert("admins", {
                name: identity.name || "Super Admin",
                email: email,
                tokenIdentifier: identity.tokenIdentifier,
                role: "admin",
                image: identity.pictureUrl,
            });
        }

        // 2. Strict Role Enforcement Logic

        // Case A: User is already an Admin
        if (existingAdmin) {
            return existingAdmin._id;
        }

        // Case B: Intent = Recruiter
        if (requestedRole === "recruiter") {
            if (existingJobSeeker) {
                // COLLISION DETECTED: Soft handle
                // Return existing ID to allow frontend to redirect to Job Seeker Dashboard
                return existingJobSeeker._id;
            }
            if (existingRecruiter) {
                // Update token if needed
                if (existingRecruiter.tokenIdentifier !== identity.tokenIdentifier) {
                    await ctx.db.patch(existingRecruiter._id, { tokenIdentifier: identity.tokenIdentifier });
                }
                return existingRecruiter._id;
            }
            // Create new Recruiter
            // (Note: In a real app, we might want separate "create" mutation, but syncUser handles it here for simplicity)
            // Recruiters are "pending" by default
            return await ctx.db.insert("recruiters", {
                name: identity.name || "Recruiter",
                email: email,
                tokenIdentifier: identity.tokenIdentifier,
                companyId: undefined, // Will be set in onboarding
                verificationStatus: "pending",
                plan: "free",
                image: identity.pictureUrl,
            });
        }

        // Case C: Intent = Candidate (Job Seeker)
        if (requestedRole === "candidate" || requestedRole === "jobseeker") {
            if (existingRecruiter) {
                // COLLISION DETECTED: Soft handle
                // Return existing ID to allow frontend to redirect to Recruiter Dashboard
                return existingRecruiter._id;
            }
            if (existingJobSeeker) {
                // Update token if needed
                if (existingJobSeeker.tokenIdentifier !== identity.tokenIdentifier) {
                    await ctx.db.patch(existingJobSeeker._id, { tokenIdentifier: identity.tokenIdentifier });
                }
                return existingJobSeeker._id;
            }
            // Create New Job Seeker
            return await ctx.db.insert("job_seekers", {
                name: identity.name || "User",
                email: email,
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
                image: identity.pictureUrl,
            });
        }

        // Case D: Intent = Admin (Only allows logging into existing admin)
        if (requestedRole === "admin") {
            throw new Error("Access Denied: Not an administrator.");
        }

        return null;
    },
});

