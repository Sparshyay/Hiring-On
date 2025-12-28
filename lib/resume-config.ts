export const RESUME_ROLES = [
    { id: "software-developer", label: "Software Developer", category: "tech" },
    { id: "data-analyst", label: "Data Analyst", category: "data" },
    { id: "product-manager", label: "Product Manager", category: "management" },
    { id: "ui-ux-designer", label: "UI/UX Designer", category: "design" },
    { id: "marketing", label: "Business / Marketing", category: "business" },
    { id: "sales", label: "Sales", category: "business" },
    { id: "finance", label: "Finance & Accounts", category: "finance" },
    { id: "civil-mech", label: "Civil / Mech Engineering", category: "engineering" },
    { id: "content-writer", label: "Content Writer", category: "creative" },
    { id: "hr", label: "Human Resources", category: "management" },
    { id: "teacher", label: "Teacher / Academic", category: "education" },
] as const;

export const EXPERIENCE_LEVELS = [
    { id: "fresher", label: "Fresher (0-1 yrs)" },
    { id: "mid", label: "Mid-Level (2-5 yrs)" },
    { id: "senior", label: "Senior (5+ yrs)" },
] as const;

export const RESUME_TYPES = [
    { id: "ats", label: "ATS-Friendly (Standard)", description: "Best for corporate/tech jobs. Simple layout." },
    { id: "modern", label: "Modern", description: "Clean with some styling. Good for startups." },
    { id: "creative", label: "Creative", description: "Visual-heavy. Best for designers/artists." },
] as const;

// Configuration determines WHICH sections to show and in WHAT ORDER
export const getResumeConfig = (roleId: string, levelId: string, typeId: string) => {
    let sections = ["header", "summary", "skills", "experience", "education", "projects", "certifications"];

    // 1. Role-based adjustments
    if (roleId === "ui-ux-designer" || roleId === "content-writer") {
        // Designers need Portfolio prominently
        sections = ["header", "summary", "skills", "portfolio", "experience", "projects", "education"];
    } else if (roleId === "software-developer") {
        // Devs need Skills & Projects high up
        sections = ["header", "summary", "skills", "experience", "projects", "education", "certifications"];
    }

    // 2. Experience-based adjustments
    if (levelId === "fresher") {
        // Freshers: Education is king. Experience is usually internships (so maybe lower or renamed).
        // Move education to top after summary
        sections = sections.filter(s => s !== "education");
        sections.splice(2, 0, "education");
    } else if (levelId === "senior") {
        // Seniors: Experience first. Education last.
        sections = sections.filter(s => s !== "education");
        sections.push("education");
    }

    // 3. Type-based adjustments (Mostly affects rendering style, but maybe content too)
    // ATS usually validates all fields.

    return {
        sections,
        labels: getLabelsForRole(roleId),
        // Placeholders can be dynamic
        placeholders: getPlaceholders(roleId)
    };
};

const getLabelsForRole = (roleId: string): { [key: string]: string } => {
    switch (roleId) {
        case "software-developer": return { skills: "Technical Skills", projects: "Projects / Open Source" };
        case "product-manager": return { skills: "Product Skills & Tools", projects: "Key Initiatives" };
        case "marketing": return { experience: "Campaigns & Experience", projects: "Case Studies" };
        default: return { skills: "Skills", experience: "Work Experience", projects: "Projects" };
    }
};

const getPlaceholders = (roleId: string) => {
    switch (roleId) {
        case "software-developer": return { summary: "Passionate Full Stack Developer with experience in..." };
        case "data-analyst": return { summary: "Data Analyst skilled in SQL, Python and Tableau..." };
        default: return { summary: "Professional with experience in..." };
    }
}
