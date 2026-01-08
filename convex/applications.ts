import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        jobId: v.union(v.id("jobs"), v.id("internships")),
        resumeUrl: v.optional(v.string()),
        coverLetter: v.optional(v.string()),
        customAnswers: v.optional(v.array(v.object({
            questionId: v.string(),
            answer: v.any(),
        }))),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!user) throw new Error("Complete your profile (Candidate) to apply.");

        // Check if already applied
        const existing = await ctx.db
            .query("applications")
            .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
            .filter((q) => q.eq(q.field("userId"), user._id))
            .first();

        if (existing) throw new Error("Already applied");

        const appId = await ctx.db.insert("applications", {
            jobId: args.jobId,
            userId: user._id,
            status: "Applied",
            appliedAt: Date.now(),
            resumeUrl: args.resumeUrl || user.resume,
            coverLetter: args.coverLetter,
            customAnswers: args.customAnswers,
            timeline: [{
                status: "Applied",
                updatedAt: Date.now(),
                note: "Application submitted"
            }]
        });

        return appId;
    },
});

export const getMyApplication = query({
    args: { jobId: v.union(v.id("jobs"), v.id("internships")) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!user) return null;

        return await ctx.db
            .query("applications")
            .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
            .filter((q) => q.eq(q.field("userId"), user._id))
            .first();
    },
});

export const getMyApplications = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("job_seekers")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!user) return [];

        const applications = await ctx.db
            .query("applications")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Join with Job and Company data
        return await Promise.all(
            applications.map(async (app) => {
                const jobOrInternship = await ctx.db.get(app.jobId);
                if (!jobOrInternship) return null;

                const company = await ctx.db.get(jobOrInternship.companyId);

                return {
                    ...app,
                    job: {
                        _id: jobOrInternship._id,
                        title: jobOrInternship.title,
                        type: "stipend" in jobOrInternship ? "Internship" : "Job",
                        location: jobOrInternship.location,
                        status: jobOrInternship.status,
                    },
                    company: company ? {
                        name: company.name,
                        logo: company.logo,
                    } : null
                };
            })
        ).then(res => res.filter(Boolean).reverse()); // Newest first
    },
});

export const getRecruiterApplications = query({
    args: { jobId: v.optional(v.union(v.id("jobs"), v.id("internships"))) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        let applications;

        if (args.jobId) {
            const definedJobId = args.jobId;
            applications = await ctx.db
                .query("applications")
                .withIndex("by_job", (q) => q.eq("jobId", definedJobId))
                .collect();
        } else {
            // In a real app, restrict this to jobs owned by the recruiter
            // For now, fetching all applications (Admin/Demo mode)
            applications = await ctx.db.query("applications").collect();
        }

        // Join with User and Job data
        const enrichedApplications = await Promise.all(
            applications.map(async (app) => {
                // Ensure the user exists in job_seekers
                const user = await ctx.db.get(app.userId as any);
                const job = await ctx.db.get(app.jobId);

                // Check if user is actually a job_seeker (has resume, etc)
                // If checking by properties or ensuring DB consistency...
                // Assuming app.userId points to job_seekers table now.

                if (!user || !job) return null;

                // Note: user might be a generic object if we just did db.get(ID).
                // We assume it's a job_seeker. safely access props.
                const candidate = user as any; // Cast for safety if Typescript complains about mixed types in db.get

                // Resolve Resume URL (handle both storage ID and external URL)
                let resumeUrl = app.resumeUrl || candidate.resume;
                if (resumeUrl && !resumeUrl.startsWith("http") && !resumeUrl.startsWith("blob:")) {
                    try {
                        resumeUrl = await ctx.storage.getUrl(resumeUrl) || "";
                    } catch (e) {
                        console.error("Invalid storage ID for resume:", resumeUrl);
                        resumeUrl = "";
                    }
                }

                // Resolve User Avatar 
                let userAvatar = candidate.image;

                return {
                    ...app,
                    resumeUrl,
                    candidate: {
                        name: candidate.name || (candidate.firstName ? candidate.firstName + " " + (candidate.lastName || "") : "Candidate"),
                        email: candidate.email,
                        info: candidate, // Full profile for detail view
                        avatar: userAvatar,
                        role: candidate.role || candidate.course || "Candidate", // Fallback role
                    },
                    job: {
                        title: job.title,
                        companyId: job.companyId,
                    }
                };
            })
        );

        return enrichedApplications.filter(Boolean);
    },
});

export const updateStatus = mutation({
    args: {
        applicationId: v.id("applications"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const application = await ctx.db.get(args.applicationId);
        if (!application) throw new Error("Application not found");

        await ctx.db.patch(args.applicationId, {
            status: args.status,
        });

        // Trigger Notification on Status Change
        if (args.status !== application.status) {
            const job = await ctx.db.get(application.jobId);
            if (job) {
                const company = await ctx.db.get(job.companyId);
                const companyName = company ? company.name : "the company";

                let message = `Your application status for ${job.title} at ${companyName} has been updated to ${args.status}.`;
                let type = "info";

                if (args.status === "Shortlisted") {
                    message = `Congratulations! You have been shortlisted for ${job.title} at ${companyName}!`;
                    type = "success";
                } else if (args.status === "Rejected") {
                    message = `Update on your application for ${job.title} at ${companyName}.`;
                    // type = "error"; // Keeping info or error? Error might be too harsh visually if red badge is default. "info" or neutral.
                    type = "info";
                } else if (args.status.includes("Interview")) {
                    message = `Great news! An interview has been scheduled for ${job.title} at ${companyName}.`;
                    type = "success";
                }

                await ctx.db.insert("notifications", {
                    userId: application.userId,
                    type: type,
                    message: message,
                    link: `/profile/applications`,
                    isRead: false,
                    createdAt: Date.now(),
                });
            }
        }
    },
});

export const getJobApplicationStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();

        if (!recruiter || !recruiter.companyId) return [];

        // Fetch jobs and internships for this company
        const jobs = await ctx.db
            .query("jobs")
            .filter((q) => q.eq(q.field("companyId"), recruiter.companyId))
            .collect();

        const internships = await ctx.db
            .query("internships")
            .filter((q) => q.eq(q.field("companyId"), recruiter.companyId))
            .collect();

        const allPostings = [...jobs.map(j => ({ ...j, type: "Job" })), ...internships.map(i => ({ ...i, type: "Internship" }))];

        // Fetch application counts
        // Optimization: In production, store this count on the Job document or use an aggregation table.
        // For now, we'll just count per job.
        return await Promise.all(
            allPostings.map(async (post) => {
                // Determine the correct index or filter mainly by jobId field in applications
                // The 'applications' table uses 'jobId' field which stores ID of job OR internship.
                const count = (await ctx.db
                    .query("applications")
                    .withIndex("by_job", (q) => q.eq("jobId", post._id as any))
                    .collect()).length;

                return {
                    id: post._id,
                    title: post.title,
                    type: post.type,
                    status: post.status,
                    created_at: post._creationTime,
                    applicationCount: count,
                };
            })
        );
    },
});

export const getAllJobApplicationStats = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db.query("jobs").collect();
        const internships = await ctx.db.query("internships").collect();

        const allPostings = [...jobs.map(j => ({ ...j, type: "Job" })), ...internships.map(i => ({ ...i, type: "Internship" }))];

        return await Promise.all(
            allPostings.map(async (post) => {
                const count = (await ctx.db
                    .query("applications")
                    .withIndex("by_job", (q) => q.eq("jobId", post._id as any))
                    .collect()).length;

                return {
                    id: post._id,
                    title: post.title,
                    type: post.type,
                    status: post.status,
                    created_at: post._creationTime,
                    applicationCount: count,
                    companyId: post.companyId,
                    // Minimal company info if needed, but ID is enough for now
                };
            })
        );
    },
});
