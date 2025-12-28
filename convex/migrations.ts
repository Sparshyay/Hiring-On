import { mutation } from "./_generated/server";

export const migrateUsers = mutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const results = {
            migratedToJobSeekers: 0,
            migratedToRecruiters: 0,
            migratedToAdmins: 0,
            skipped: 0,
        };

        for (const user of users) {
            // 1. Check if user already exists in target tables to avoid duplicates
            const existingJobSeeker = await ctx.db.query("job_seekers").withIndex("by_token", q => q.eq("tokenIdentifier", user.tokenIdentifier)).unique();
            const existingRecruiter = await ctx.db.query("recruiters").withIndex("by_token", q => q.eq("tokenIdentifier", user.tokenIdentifier)).unique();
            const existingAdmin = await ctx.db.query("admins").withIndex("by_token", q => q.eq("tokenIdentifier", user.tokenIdentifier)).unique();

            if (existingJobSeeker || existingRecruiter || existingAdmin) {
                results.skipped++;
                continue;
            }

            const role = user.role || "candidate";

            if (role === "admin") {
                await ctx.db.insert("admins", {
                    name: user.name,
                    email: user.email,
                    tokenIdentifier: user.tokenIdentifier,
                    role: "admin",
                });
                results.migratedToAdmins++;
            } else if (role === "recruiter") {
                // Map legacy fields if possible
                await ctx.db.insert("recruiters", {
                    name: user.name,
                    email: user.email,
                    tokenIdentifier: user.tokenIdentifier,
                    role: "recruiter",
                    verificationStatus: user.verificationStatus || "pending",
                    mobile: user.mobile,
                    about: user.about,
                    // If companyId was stored in user, migrate it. 
                    // Note: original user schema didn't have companyId explicitly in the validator I saw, 
                    // but if it's there as 'any', we could try. 
                    // Assuming for now simple basic migration.
                });
                results.migratedToRecruiters++;
            } else {
                // Default to Job Seeker
                await ctx.db.insert("job_seekers", {
                    name: user.name,
                    email: user.email,
                    tokenIdentifier: user.tokenIdentifier,
                    role: user.role || "candidate",
                    isRequestingAdmin: user.isRequestingAdmin,

                    // Profile Data
                    about: user.about,
                    mobile: user.mobile,
                    currentLocation: user.currentLocation,

                    // Resume Data
                    resume: user.resume,
                    skills: user.skills,
                    experience: user.experience,
                    education: user.education,
                    certificates: user.certificates,
                    projects: user.projects,
                    achievements: user.achievements,
                    responsibilities: user.responsibilities,
                    hobbies: user.hobbies,
                    socialLinks: user.socialLinks,

                    // Extended Profile
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    gender: user.gender,
                    userType: user.userType,

                    // Domains
                    domain: user.domain,
                    course: user.course,
                    courseDuration: user.courseDuration,
                    courseSpecialization: user.courseSpecialization,

                    // Professional
                    organization: user.organization,
                    purpose: user.purpose,
                    preferredWorkLocation: user.preferredWorkLocation,

                    // Personal
                    pronouns: user.pronouns,
                    dateOfBirth: user.dateOfBirth,
                    currentAddress: user.currentAddress,
                    permanentAddress: user.permanentAddress,
                });
                results.migratedToJobSeekers++;
            }
        }
        return results;
    },
});
