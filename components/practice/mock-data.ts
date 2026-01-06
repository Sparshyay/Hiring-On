export const ASSESSMENT_DATA = {
    "Tech": [
        { title: "Aptitude", category: "Aptitude", desc: "Put your skills into practice now!" },
        { title: "Quant", category: "Quant", desc: "Check your aptitude for number games!" },
        { title: "LRDI", category: "LRDI", desc: "Challenge and grow your logical ability!" },
        { title: "Verbal Ability", category: "Verbal Ability", desc: "Take this mock test to boost your vocab!" },
    ],
    "Cognitive": [
        { title: "Critical Thinking", category: "Cognitive", desc: "Analyze arguments and evaluate evidence." },
        { title: "Problem Solving", category: "Cognitive", desc: "Solve complex problems effectively." },
    ],
    "Management": [
        { title: "Financial Accounting", category: "Financial Accounting", desc: "Understand the world of finance!" },
        { title: "Brand Management", category: "Brand Management", desc: "Pathway To A Powerful Presence!" },
        { title: "Supply Chain", category: "Supply Chain Management", desc: "Unlock Operational Excellence!" },
        { title: "Micro-Economics", category: "Micro-Economics", desc: "Your Key To Business insights!" },
    ],
    "Exam Prep": [
        { title: "CAT Mock", category: "Exam Prep", desc: "Full length CAT mock test." },
        { title: "GMAT", category: "Exam Prep", desc: "Global MBA entrance prep." },
    ],
    "Gamified Assessments": [
        { title: "Code Challenge", category: "Gamified", desc: "Compete with others in coding." },
        { title: "Logic Puzzle", category: "Gamified", desc: "Fun logic puzzles to solve." },
    ]
};

// Helper to find a test by ID (which we'll generate consistently)
export const findTestById = (id: string) => {
    // ID format: "slugified-title" or we can iterate and check match
    // Let's assume we update the ID generation to be slugs.

    const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    for (const [category, items] of Object.entries(ASSESSMENT_DATA)) {
        for (const item of items) {
            const generatedId = `mock-${slugify(item.title)}`;
            // Check against the new format
            if (generatedId === id) return { ...item, id: generatedId };

            // Fallback for old "skill-" format (best effort, though ambiguous)
            // We can't really support skill-0 unambiguously. 
        }
    }
    return null;
};
