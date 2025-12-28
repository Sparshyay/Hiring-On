// Standard Topics Data
// Used to seed placeholder tests so cards appear on the UI

export const STANDARD_TOPICS = [
    { title: "Aptitude", category: "Aptitude", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "Logical Reasoning", category: "Logical Reasoning", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "English Grammar", category: "English Grammar", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "Node.js", category: "Node.js", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "SQL", category: "SQL", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "JavaScript Coding", category: "JavaScript Coding", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "DSA", category: "DSA", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "HR Interview", category: "HR Interview", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "Finance", category: "Finance", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "Marketing", category: "Marketing", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },
    { title: "Medical Domain", category: "Medical Domain", difficulty: "Novice", questions: 10, duration: "15", type: "standard" },

    // Company Specific
    { title: "TCS Assessment", category: "Company Specific", difficulty: "Novice", questions: 30, duration: "45", type: "standard", tags: ["TCS", "Placement"] },
    { title: "Infosys Assessment", category: "Company Specific", difficulty: "Novice", questions: 30, duration: "45", type: "standard", tags: ["Infosys", "Placement"] },
    { title: "Deloitte Assessment", category: "Company Specific", difficulty: "Novice", questions: 30, duration: "45", type: "standard", tags: ["Deloitte", "Placement"] },
    { title: "Amazon Assessment", category: "Company Specific", difficulty: "Novice", questions: 30, duration: "45", type: "standard", tags: ["Amazon", "Placement"] },
];

// Placeholder questions to ensure the tests are valid
export const PLACEHOLDER_QUESTIONS = [
    {
        text: "This is a placeholder question for this topic. Actual content coming soon.",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "Content is being prepared."
    }
];
