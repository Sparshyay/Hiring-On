import { mutation } from "./_generated/server";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear existing data
        const existingCompanies = await ctx.db.query("companies").collect();
        for (const c of existingCompanies) await ctx.db.delete(c._id);

        const existingJobs = await ctx.db.query("jobs").collect();
        for (const j of existingJobs) await ctx.db.delete(j._id);

        // Create Companies
        const techCorpId = await ctx.db.insert("companies", {
            name: "TechCorp",
            logo: "T",
            description: "Leading the way in innovative software solutions.",
            location: "Pune, India",
            website: "https://techcorp.com",
            email: "contact@techcorp.com",
            plan: "Pro",
            status: "Verified",
        });

        const designStudioId = await ctx.db.insert("companies", {
            name: "DesignStudio",
            logo: "D",
            description: "We craft beautiful digital experiences.",
            location: "Indore, India",
            website: "https://designstudio.com",
            email: "hello@designstudio.com",
            plan: "Starter",
            status: "Verified",
        });

        const dataSystemsId = await ctx.db.insert("companies", {
            name: "DataSystems",
            logo: "DS",
            description: "Big data solutions for enterprise.",
            location: "Bhopal, India",
            website: "https://datasystems.com",
            email: "info@datasystems.com",
            plan: "Enterprise",
            status: "Verified",
        });

        const growthCoId = await ctx.db.insert("companies", {
            name: "GrowthCo",
            logo: "G",
            description: "Helping businesses grow faster.",
            location: "Pune, India",
            website: "https://growthco.com",
            email: "jobs@growthco.com",
            plan: "Pro",
            status: "Verified",
        });

        // Create Jobs
        await ctx.db.insert("jobs", {
            title: "Senior Frontend Engineer",
            companyId: techCorpId,
            location: "Pune, India",
            type: "Full-time",
            salary: "₹12L - ₹18L",
            description: "We are looking for an experienced Senior Frontend Engineer to join our core product team.",
            requirements: ["5+ years React", "TypeScript", "Next.js"],
            postedAt: Date.now(),
            status: "Active",
            tags: ["React", "TypeScript", "Next.js"],
        });

        await ctx.db.insert("jobs", {
            title: "Product Designer",
            companyId: designStudioId,
            location: "Indore, India",
            type: "Contract",
            salary: "₹8L - ₹12L",
            description: "Join our design team to create stunning user interfaces.",
            requirements: ["Figma", "UI/UX", "Prototyping"],
            postedAt: Date.now() - 86400000, // 1 day ago
            status: "Active",
            tags: ["Figma", "UI/UX", "Prototyping"],
        });

        await ctx.db.insert("jobs", {
            title: "Backend Developer",
            companyId: dataSystemsId,
            location: "Bhopal, India",
            type: "Full-time",
            salary: "₹10L - ₹15L",
            description: "Build scalable backend systems processing millions of requests.",
            requirements: ["Node.js", "PostgreSQL", "AWS"],
            postedAt: Date.now() - 172800000, // 2 days ago
            status: "Active",
            tags: ["Node.js", "PostgreSQL", "AWS"],
        });

        await ctx.db.insert("jobs", {
            title: "Marketing Manager",
            companyId: growthCoId,
            location: "Pune, India",
            type: "Full-time",
            salary: "₹6L - ₹9L",
            description: "Lead our marketing initiatives and drive growth.",
            requirements: ["SEO", "Content Marketing", "Analytics"],
            postedAt: Date.now() - 259200000, // 3 days ago
            status: "Active",
            tags: ["SEO", "Content", "Analytics"],
        });

        return "Seeding complete";
    },
});
