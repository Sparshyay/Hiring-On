// Standard Topics Data
// Used to seed placeholder tests so cards appear on the UI

export const STANDARD_TOPICS = [
    { title: "Aptitude", category: "General", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "Logical Reasoning", category: "General", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "English Grammar", category: "General", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "Node.js", category: "Tech", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "SQL", category: "Tech", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "JavaScript Coding", category: "Tech", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "DSA", category: "Tech", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "HR Interview", category: "Management", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "Finance", category: "Management", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "Marketing", category: "Management", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },
    { title: "Medical Domain", category: "General", difficulty: "Beginner", questions: 10, duration: "15", type: "standard" },

    // Company Specific
    { title: "TCS Assessment", category: "Tech", difficulty: "Beginner", questions: 30, duration: "45", type: "standard", tags: ["TCS", "Placement"] },
    { title: "Infosys Assessment", category: "Tech", difficulty: "Beginner", questions: 30, duration: "45", type: "standard", tags: ["Infosys", "Placement"] },
    { title: "Deloitte Assessment", category: "Tech", difficulty: "Beginner", questions: 30, duration: "45", type: "standard", tags: ["Deloitte", "Placement"] },
    { title: "Amazon Assessment", category: "Tech", difficulty: "Beginner", questions: 30, duration: "45", type: "standard", tags: ["Amazon", "Placement"] },
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
