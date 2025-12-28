import { mutation } from "./_generated/server";
import { v } from "convex/values";

const MOCK_TESTS = [
    {
        title: "Computer Fundamentals",
        category: "Computer Fundamentals",
        questionsCount: 30,
        duration: 45,
        difficulty: "Beginner",
        description: "Put your tech skills to the test!",
        imageColor: "bg-[#FFD700]",
        type: "standard",
        status: "Published",
        tags: ["tech", "basics"]
    },
    {
        title: "Computer Networks",
        category: "CN (Computer Network)",
        questionsCount: 45,
        duration: 60,
        difficulty: "Intermediate",
        description: "Test your fundamentals first!",
        imageColor: "bg-[#FFD700]",
        type: "standard",
        status: "Published",
        tags: ["networking", "cs"]
    },
    {
        title: "Data Structure & Algorithms",
        category: "DSA",
        questionsCount: 50,
        duration: 90,
        difficulty: "Advanced",
        description: "Analyze & Improve your coding knowledge",
        imageColor: "bg-[#FFD700]",
        type: "standard",
        status: "Published",
        tags: ["dsa", "algorithms"]
    },
    {
        title: "Object Oriented Programming",
        category: "OOPS",
        questionsCount: 40,
        duration: 60,
        difficulty: "Intermediate",
        description: "Review your OOP prep with this mock test!",
        imageColor: "bg-[#FFD700]",
        type: "standard",
        status: "Published",
        tags: ["oops", "programming"]
    }
];

// Sample questions to populate for each test
const SAMPLE_QUESTIONS = [
    {
        type: "MCQ",
        question: "What is the primary function of the CPU?",
        options: ["Store data", "Process instructions", "Display graphics", "Connect to internet"],
        correctAnswer: "Process instructions",
        marks: 2,
        difficulty: "Beginner"
    },
    {
        type: "MCQ",
        question: "Which data structure uses LIFO?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: "Stack",
        marks: 2,
        difficulty: "Easy"
    },
    {
        type: "MCQ",
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
        marks: 1,
        difficulty: "Beginner"
    },
    {
        type: "MCQ",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        correctAnswer: "O(log n)",
        marks: 4,
        difficulty: "Intermediate"
    }
];

export const seedTests = mutation({
    args: {},
    handler: async (ctx) => {
        const tests = await ctx.db.query("tests").collect();
        // Simple check to avoid double seeding if names match
        const existingTitles = new Set(tests.map(t => t.title));

        for (const testData of MOCK_TESTS) {
            if (!existingTitles.has(testData.title)) {
                const testId = await ctx.db.insert("tests", {
                    ...testData,
                    tags: testData.tags
                });

                // Add some sample questions for this test
                for (const q of SAMPLE_QUESTIONS) {
                    await ctx.db.insert("questions", {
                        testId,
                        type: q.type,
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        marks: q.marks,
                        difficulty: q.difficulty,
                        subject: testData.category
                    });
                }
                console.log(`Seeded test: ${testData.title}`);
            }
        }
        return "Seeding Complete";
    }
});
