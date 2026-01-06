import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchGlobal = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const searchQuery = args.query;
        if (!searchQuery || searchQuery.length < 2) return [];

        const [jobs, internships, companies, candidates] = await Promise.all([
            // Jobs
            ctx.db.query("jobs")
                .withSearchIndex("search_title", (q) => q.search("title", searchQuery))
                .take(3),

            // Internships
            ctx.db.query("internships")
                .withSearchIndex("search_title", (q) => q.search("title", searchQuery))
                .take(3),

            // Companies
            ctx.db.query("companies")
                .withSearchIndex("search_name", (q) => q.search("name", searchQuery))
                .take(3),

            // Candidates (Job Seekers)
            ctx.db.query("job_seekers")
                .withSearchIndex("search_name", (q) => q.search("name", searchQuery))
                .take(3),
        ]);

        const results = [
            ...jobs.map(j => ({ type: "Job", id: j._id, title: j.title, subtitle: j.location, link: `/jobs/${j._id}` })),
            ...internships.map(i => ({ type: "Internship", id: i._id, title: i.title, subtitle: i.location, link: `/internships/${i._id}` })),
            ...companies.map(c => ({ type: "Company", id: c._id, title: c.name, subtitle: c.industry || "Company", link: `/company/${c._id}` })),
            ...candidates.map(u => ({ type: "Candidate", id: u._id, title: u.name, subtitle: u.headline || "Job Seeker", link: `/candidate/${u._id}` })),
        ];

        return results;
    },
});

export const searchJobTitles = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("job_titles")
            .withSearchIndex("search_title", (q) => q.search("title", args.query))
            .take(10);
    },
});

export const searchCompanies = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("companies")
            .withSearchIndex("search_name", (q) => q.search("name", args.query))
            .take(10);
    },
});

export const searchLocations = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query) return [];
        return await ctx.db
            .query("locations")
            .withSearchIndex("search_city", (q) => q.search("city", args.query))
            .take(10);
    },
});
