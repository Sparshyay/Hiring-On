import { mutation } from "./_generated/server";

export const resetUser = mutation({
    args: {},
    handler: async (ctx) => {
        const email = "sparshsinghdeshmukh@gmail.com";
        const recruiter = await ctx.db
            .query("recruiters")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (recruiter) {
            if (recruiter.companyId) {
                await ctx.db.delete(recruiter.companyId);
            }
            await ctx.db.delete(recruiter._id);
            console.log("Deleted recruiter and company for", email);
        } else {
            console.log("No recruiter found for", email);
        }

        // Also check job seekers
        const jobSeeker = await ctx.db
            .query("job_seekers")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (jobSeeker) {
            await ctx.db.delete(jobSeeker._id);
            console.log("Deleted job seeker for", email);
        }
    },
});
