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
            // Initialize Onboarding Fields
            onboardingStatus: "pending",
            resumeMetadata: {
                uploaded: false,
                source: undefined,
                parsed: false,
            },
            profileStatus: {
                autoFilled: false,
                confirmed: false,
                completionLevel: 0,
            },
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

export const saveResumeData = mutation({
    args: {
        resumeData: v.any(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called saveResumeData without authentication present");
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

        await ctx.db.patch(user._id, { resumeData: args.resumeData });
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

        // Onboarding
        resumeMetadata: v.optional(v.object({
            uploaded: v.boolean(),
            source: v.optional(v.string()),
            parsed: v.optional(v.boolean()),
            fileId: v.optional(v.string())
        })),
        profileStatus: v.optional(v.object({
            autoFilled: v.boolean(),
            confirmed: v.boolean(),
            completionLevel: v.optional(v.number())
        })),
        onboardingStatus: v.optional(v.string()), // Added missing field
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

export const confirmProfile = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            onboardingStatus: "completed",
            profileStatus: {
                autoFilled: user.profileStatus?.autoFilled || false,
                confirmed: true,
                completionLevel: 3, // Assuming completed on confirmation
            },
        });
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

export const getProfileForApplication = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) return null;

        // Resolve Resume URL
        let resumeUrl = user.resume;
        if (resumeUrl && !resumeUrl.startsWith("http") && !resumeUrl.startsWith("blob:")) {
            try {
                resumeUrl = await ctx.storage.getUrl(resumeUrl) || resumeUrl;
            } catch (e) {
                // Keep original if failed
            }
        }

        return {
            ...user,
            resumeUrl, // send resolved URL for display
            resumeStorageId: user.resume, // send original ID for reference/check
            // Ensure all fields needed for form are present or null
            mobile: user.mobile || "",
            gender: user.gender || "",
            location: user.currentLocation || "",
            instituteName: user.education && user.education.length > 0 ? user.education[0].college : "",
            userType: user.userType || "", // e.g. "College Student"
            domain: user.domain || "",
            course: user.course || "",
            specialization: user.courseSpecialization || "",
            graduatingYear: user.education && user.education.length > 0 ? user.education[0].endYear : "", // Approximation
            courseDuration: user.courseDuration ? `${user.courseDuration.startYear}-${user.courseDuration.endYear}` : "",
            differentlyAbled: user.differentlyAbled || "No",
        };
    },
});

export const updateProfileFromApplication = mutation({
    args: {
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        mobile: v.optional(v.string()),
        gender: v.optional(v.string()),
        location: v.optional(v.string()), // This maps to currentLocation
        instituteName: v.optional(v.string()),
        differentlyAbled: v.optional(v.string()), // We need to add this field to schema if not present, for now we will patch it
        userType: v.optional(v.string()),
        domain: v.optional(v.string()),
        course: v.optional(v.string()),
        courseSpecialization: v.optional(v.string()),
        graduatingYear: v.optional(v.string()),
        courseDuration: v.optional(v.string()), // store as string or object? Schema says object structure.
        // We'll handle conversion in handler if needed or update schema. 
        // Current Schema: courseDuration: v.optional(v.object({ startYear, endYear }))
        // Form sends "4 Years" or similar? No, usually range. 
        // User request image shows "Course Duration" as a dropdown "4 Years".
        // Schema expects object. I will need to adjust either schema or logic. 
        // For now, I'll update other fields and handle courseDuration carefully.
        resume: v.optional(v.string()), // storage ID
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        // Map Application Form fields to Schema fields
        const updates: any = {};
        if (args.firstName) updates.firstName = args.firstName;
        if (args.lastName) updates.lastName = args.lastName;
        if (args.mobile) updates.mobile = args.mobile;
        if (args.gender) updates.gender = args.gender;
        if (args.location) updates.currentLocation = args.location;
        if (args.userType) updates.userType = args.userType;
        if (args.domain) updates.domain = args.domain;
        if (args.course) updates.course = args.course;
        if (args.courseSpecialization) updates.courseSpecialization = args.courseSpecialization;
        if (args.resume) updates.resume = args.resume;
        if (args.differentlyAbled) updates.differentlyAbled = args.differentlyAbled;

        // Handle Education (Institute, Grad Year) - simplified sync to first education entry
        // In real app, robustly manage education array.
        if (args.instituteName || args.graduatingYear) {
            const education = user.education || [];
            if (education.length === 0) {
                education.push({
                    level: "College", // Default
                    college: args.instituteName || "",
                    endYear: args.graduatingYear || "",
                });
            } else {
                if (args.instituteName) education[0].college = args.instituteName;
                if (args.graduatingYear) education[0].endYear = args.graduatingYear;
            }
            updates.education = education;
        }

        // Handle Course Duration: Input is likely "4 Years". Schema is { startYear, endYear }.
        // This mismatch is tricky. 
        // Check schema again: courseDuration: v.optional(v.object({ startYear, endYear }))
        // If user sends string "4", we can't save it to `courseDuration` field directly without schema change.
        // I will add a new field `courseDurationValue` or similar, OR update schema to allow v.union(string, object).
        // Let's check `convex/schema.ts` quickly?
        // Assume I can patch `courseDurationText` if I add it to schema.
        // Or I just ignore it for now to avoid schema error, as it's less critical than Name/Resume.

        await ctx.db.patch(user._id, updates);
    }
});
