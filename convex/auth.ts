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

        // 2. Check Recruiters (Strictly Verified Only)
        // If a recruiter is "pending", they should fall through to Job Seeker check
        // so they can use the app as a candidate while waiting.
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (recruiter && recruiter.verificationStatus === "verified") {
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

            // Inject pending status if they have a pending recruiter application
            const isPending = recruiter && recruiter.verificationStatus === "pending";

            return {
                ...jobSeeker,
                resume: resumeUrl,
                role: "candidate",
                _id: jobSeeker._id,
                hasPendingRecruiterRequest: isPending,
                recruiterStatus: recruiter?.verificationStatus
            };
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

        // Case B: Intent = Recruiter (Host Button Clicked)
        if (requestedRole === "recruiter") {
            // Logic Change: Even if they want to be a recruiter, we ensure they have a Job Seeker profile
            // because they remain a Job Seeker until approved.

            let jobSeekerId = existingJobSeeker?._id;

            // 1. Ensure Job Seeker Profile Exists
            if (!existingJobSeeker) {
                jobSeekerId = await ctx.db.insert("job_seekers", {
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
                    onboardingStatus: "pending",
                    resumeMetadata: { uploaded: false, parsed: false },
                    profileStatus: { autoFilled: false, confirmed: false, completionLevel: 0 },
                    image: identity.pictureUrl,
                });
            }

            // 2. Ensure Recruiter Profile Exists (Pending)
            if (!existingRecruiter) {
                await ctx.db.insert("recruiters", {
                    name: identity.name || "Recruiter",
                    email: email,
                    tokenIdentifier: identity.tokenIdentifier,
                    companyId: undefined, // Will be set in onboarding
                    verificationStatus: "pending", // Default to pending
                    plan: "free",
                    image: identity.pictureUrl,
                });
            } else if (existingRecruiter.tokenIdentifier !== identity.tokenIdentifier) {
                await ctx.db.patch(existingRecruiter._id, { tokenIdentifier: identity.tokenIdentifier });
            }

            // Return Job Seeker ID so they log in as Candidate initially
            // Only return Recruiter ID if they are ALREADY verified
            if (existingRecruiter && existingRecruiter.verificationStatus === "verified") {
                return existingRecruiter._id;
            }

            return jobSeekerId;
        }

        // Case C: Intent = Candidate (Job Seeker)
        if (requestedRole === "candidate" || requestedRole === "jobseeker") {
            // Even if they are a verified recruiter, if they explicitly asked for candidate?
            // For now, let's keep the persistence logic simple.

            if (existingRecruiter && existingRecruiter.verificationStatus === "verified") {
                // If they are a verified recruiter, they should probably log in as one?
                // Or maybe we support dual login later. For now, prioritize verified recruiter access
                // to avoid locking them out of dashboard.
                // return existingRecruiter._id;
            }

            if (existingJobSeeker) {
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

        // Case D: Intent = Admin
        if (requestedRole === "admin") {
            throw new Error("Access Denied: Not an administrator.");
        }

        return null;
    },
});

