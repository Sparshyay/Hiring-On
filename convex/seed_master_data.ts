import { mutation } from "./_generated/server";

export const seed = mutation({
    handler: async (ctx) => {
        // --- 1. DOMAINS ---
        const domains = [
            { name: "Engineering", description: "B.Tech, M.Tech, BE, ME" },
            { name: "Management", description: "MBA, BBA, PGDM" },
            { name: "Science", description: "B.Sc, M.Sc, Ph.D" },
            { name: "Commerce", description: "B.Com, M.Com, CA" },
            { name: "Arts", description: "BA, MA" },
            { name: "Medical", description: "MBBS, MD, BDS" },
            { name: "Design", description: "B.Des, M.Des" },
            { name: "Law", description: "LLB, LLM" },
        ];

        const domainIds: Record<string, any> = {};
        for (const d of domains) {
            // Check existence to avoid dupes if running multiple times (naive check)
            const existing = await ctx.db.query("domains").withSearchIndex("search_name", q => q.search("name", d.name)).first();
            if (!existing) {
                domainIds[d.name] = await ctx.db.insert("domains", d);
            } else {
                domainIds[d.name] = existing._id;
            }
        }

        // --- 2. COURSES ---
        const courses = [
            { name: "B.Tech", domain: "Engineering", duration: "4 Years", type: "UG" },
            { name: "B.E.", domain: "Engineering", duration: "4 Years", type: "UG" },
            { name: "M.Tech", domain: "Engineering", duration: "2 Years", type: "PG" },
            { name: "MBA", domain: "Management", duration: "2 Years", type: "PG" },
            { name: "BBA", domain: "Management", duration: "3 Years", type: "UG" },
            { name: "B.Sc", domain: "Science", duration: "3 Years", type: "UG" },
            { name: "MBBS", domain: "Medical", duration: "5.5 Years", type: "UG" },
            { name: "B.Des", domain: "Design", duration: "4 Years", type: "UG" },
        ];

        const courseIds: Record<string, any> = {};
        for (const c of courses) {
            if (domainIds[c.domain]) {
                const existing = await ctx.db.query("courses").withSearchIndex("search_name", q => q.search("name", c.name)).first();
                if (!existing) {
                    courseIds[c.name] = await ctx.db.insert("courses", {
                        name: c.name,
                        domainId: domainIds[c.domain],
                        duration: c.duration,
                        type: c.type
                    });
                } else {
                    courseIds[c.name] = existing._id;
                }
            }
        }

        // --- 3. UNIVERSITIES (IITs, NITs, IIITs, Top NIRF) ---
        // Helper to insert University and Main Campus College
        const insertUniAndCollege = async (name: string, shortName: string, city: string, state: string, type: string, rank?: number) => {
            let uniId;
            const existingUni = await ctx.db.query("universities").withSearchIndex("search_name", q => q.search("name", name)).first();
            if (!existingUni) {
                uniId = await ctx.db.insert("universities", { name, shortName, city, state, type, nirfRank: rank });
            } else {
                uniId = existingUni._id;
            }

            // Also insert as a "College" (The Institute itself)
            const existingCollege = await ctx.db.query("colleges").withSearchIndex("search_name", q => q.search("name", name)).first();
            if (!existingCollege) {
                await ctx.db.insert("colleges", {
                    name, shortName, city, state, country: "India",
                    universityId: uniId, instituteType: type === "Private" ? "Private" : "Government",
                    tier: rank && rank <= 20 ? "Tier 1" : "Tier 2"
                });
            }
            return uniId;
        };

        // IITs
        await insertUniAndCollege("Indian Institute of Technology Bombay", "IIT Bombay", "Mumbai", "Maharashtra", "Central", 3);
        await insertUniAndCollege("Indian Institute of Technology Delhi", "IIT Delhi", "New Delhi", "Delhi", "Central", 2);
        await insertUniAndCollege("Indian Institute of Technology Madras", "IIT Madras", "Chennai", "Tamil Nadu", "Central", 1);
        await insertUniAndCollege("Indian Institute of Technology Kanpur", "IIT Kanpur", "Kanpur", "Uttar Pradesh", "Central", 4);
        await insertUniAndCollege("Indian Institute of Technology Kharagpur", "IIT Kharagpur", "Kharagpur", "West Bengal", "Central", 5);
        await insertUniAndCollege("Indian Institute of Technology Roorkee", "IIT Roorkee", "Roorkee", "Uttarakhand", "Central", 6);
        await insertUniAndCollege("Indian Institute of Technology Guwahati", "IIT Guwahati", "Guwahati", "Assam", "Central", 7);
        await insertUniAndCollege("Indian Institute of Technology Hyderabad", "IIT Hyderabad", "Hyderabad", "Telangana", "Central", 8);
        await insertUniAndCollege("Indian Institute of Technology Indore", "IIT Indore", "Indore", "Madhya Pradesh", "Central", 14);
        await insertUniAndCollege("Indian Institute of Technology (BHU) Varanasi", "IIT BHU", "Varanasi", "Uttar Pradesh", "Central", 15);

        // NITs
        await insertUniAndCollege("National Institute of Technology Tiruchirappalli", "NIT Trichy", "Tiruchirappalli", "Tamil Nadu", "Central", 9);
        await insertUniAndCollege("National Institute of Technology Karnataka", "NIT Surathkal", "Surathkal", "Karnataka", "Central", 12);
        await insertUniAndCollege("National Institute of Technology Rourkela", "NIT Rourkela", "Rourkela", "Odisha", "Central", 16);
        await insertUniAndCollege("National Institute of Technology Warangal", "NIT Warangal", "Warangal", "Telangana", "Central", 21);
        await insertUniAndCollege("Motilal Nehru National Institute of Technology", "MNNIT Allahabad", "Prayagraj", "Uttar Pradesh", "Central", 40);

        // IIITs
        await insertUniAndCollege("International Institute of Information Technology Hyderabad", "IIIT Hyderabad", "Hyderabad", "Telangana", "Private", 50);
        await insertUniAndCollege("Indraprastha Institute of Information Technology Delhi", "IIIT Delhi", "New Delhi", "Delhi", "State", 60);

        // Top Universities (Non-Engg specific)
        await insertUniAndCollege("Indian Institute of Science", "IISc", "Bengaluru", "Karnataka", "Deemed", 1);
        await insertUniAndCollege("Jawaharlal Nehru University", "JNU", "New Delhi", "Delhi", "Central", 2);
        await insertUniAndCollege("Jamia Millia Islamia", "JMI", "New Delhi", "Delhi", "Central", 3);
        await insertUniAndCollege("Banaras Hindu University", "BHU", "Varanasi", "Uttar Pradesh", "Central", 5);
        await insertUniAndCollege("University of Delhi", "DU", "New Delhi", "Delhi", "Central", 6);
        await insertUniAndCollege("Anna University", "Anna Univ", "Chennai", "Tamil Nadu", "State", 13);

        // Private / Deemed
        await insertUniAndCollege("Birla Institute of Technology and Science", "BITS Pilani", "Pilani", "Rajasthan", "Private", 20);
        await insertUniAndCollege("Vellore Institute of Technology", "VIT", "Vellore", "Tamil Nadu", "Private", 11);
        await insertUniAndCollege("Manipal Academy of Higher Education", "Manipal", "Manipal", "Karnataka", "Private", 7);
        await insertUniAndCollege("Amrita Vishwa Vidyapeetham", "Amrita", "Coimbatore", "Tamil Nadu", "Private", 10);

        // State Universities (Affiliating)
        const rgpv = await insertUniAndCollege("Rajiv Gandhi Proudyogiki Vishwavidyalaya", "RGPV", "Bhopal", "Madhya Pradesh", "State");
        const davv = await insertUniAndCollege("Devi Ahilya Vishwavidyalaya", "DAVV", "Indore", "Madhya Pradesh", "State");
        const vtu = await insertUniAndCollege("Visvesvaraya Technological University", "VTU", "Belagavi", "Karnataka", "State");
        const aktu = await insertUniAndCollege("Dr. A.P.J. Abdul Kalam Technical University", "AKTU", "Lucknow", "Uttar Pradesh", "State");

        // Affiliated Colleges (Sample)
        const addAffiliatedCollege = async (name: string, city: string, state: string, uniId: any) => {
            const existing = await ctx.db.query("colleges").withSearchIndex("search_name", q => q.search("name", name)).first();
            if (!existing) {
                await ctx.db.insert("colleges", {
                    name, city, state, country: "India",
                    universityId: uniId, instituteType: "Private", approvalBody: "AICTE", tier: "Tier 3"
                });
            }
        };

        await addAffiliatedCollege("Gyan Ganga Institute of Technology and Sciences", "Jabalpur", "Madhya Pradesh", rgpv);
        await addAffiliatedCollege("Lakshmi Narain College of Technology", "Bhopal", "Madhya Pradesh", rgpv);
        await addAffiliatedCollege("Institute of Engineering and Technology", "Indore", "Madhya Pradesh", davv); // IET DAVV
        await addAffiliatedCollege("Medicaps University", "Indore", "Madhya Pradesh", rgpv); // Technically now a private university, but often listed.
        await addAffiliatedCollege("Acropolis Institute of Technology and Research", "Indore", "Madhya Pradesh", rgpv);

        // --- 4. SKILLS ---
        const skills = [
            // Tech
            "React", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js", "Django", "Spring Boot",
            "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "Go", "Rust", "Swift", "Kotlin",
            "SQL", "PostgreSQL", "MongoDB", "Redis", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
            "Machine Learning", "Deep Learning", "Data Science", "Artificial Intelligence", "NLP",
            "Git", "GitHub", "CI/CD", "Terraform", "System Design",
            // Design
            "Figma", "Adobe XD", "Photoshop", "Illustrator", "UI Design", "UX Research", "Prototyping",
            // Management
            "Project Management", "Agile", "Scrum", "Product Management", "Market Research", "Digital Marketing",
            // Soft
            "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management"
        ];

        for (const s of skills) {
            const existing = await ctx.db.query("skills").withSearchIndex("search_name", q => q.search("name", s)).first();
            if (!existing) {
                await ctx.db.insert("skills", { name: s, category: "General", popularityScore: Math.floor(Math.random() * 50) + 50 });
            }
        }

        return "Database enriched with Indian context data!";
    }
});
