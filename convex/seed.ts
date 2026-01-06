import { mutation } from "./_generated/server";
import { REACT_QUESTIONS } from "./data/react_questions";
import { STANDARD_TOPICS, PLACEHOLDER_QUESTIONS } from "./data/standard_topics";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear existing data
        const existingCompanies = await ctx.db.query("companies").collect();
        for (const c of existingCompanies) await ctx.db.delete(c._id);

        const existingJobs = await ctx.db.query("jobs").collect();
        for (const j of existingJobs) await ctx.db.delete(j._id);

        const existingTests = await ctx.db.query("tests").collect();
        for (const t of existingTests) await ctx.db.delete(t._id);

        const existingQuestions = await ctx.db.query("questions").collect();
        for (const q of existingQuestions) await ctx.db.delete(q._id);

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

        // --- Search Data Seeding ---

        // Colleges
        const colleges = [
            { name: "IIT Bombay", city: "Mumbai", state: "Maharashtra", country: "India" },
            { name: "IIT Delhi", city: "New Delhi", state: "Delhi", country: "India" },
            { name: "BITS Pilani", city: "Pilani", state: "Rajasthan", country: "India" },
            { name: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", country: "India" },
            { name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", country: "India" },
            { name: "Manipal Institute of Technology", city: "Manipal", state: "Karnataka", country: "India" },
            { name: "SRM University", city: "Chennai", state: "Tamil Nadu", country: "India" },
            { name: "Amity University", city: "Noida", state: "Uttar Pradesh", country: "India" },
        ];
        for (const c of colleges) await ctx.db.insert("colleges", c);

        // Skills
        const skills = [
            { name: "React", type: "technical" },
            { name: "Node.js", type: "technical" },
            { name: "Python", type: "technical" },
            { name: "Java", type: "technical" },
            { name: "SQL", type: "technical" },
            { name: "Communication", type: "soft" },
            { name: "Leadership", type: "soft" },
            { name: "Figma", type: "tool" },
            { name: "Docker", type: "tool" },
            { name: "AWS", type: "tool" },
        ];
        for (const s of skills) await ctx.db.insert("skills", s);

        // Job Titles
        const titles = [
            { title: "Software Engineer", category: "Engineering" },
            { title: "Frontend Developer", category: "Engineering" },
            { title: "Backend Developer", category: "Engineering" },
            { title: "Product Manager", category: "Product" },
            { title: "Data Scientist", category: "Data" },
            { title: "UX Designer", category: "Design" },
            { title: "Marketing Specialist", category: "Marketing" },
        ];
        for (const t of titles) await ctx.db.insert("job_titles", t);

        // Locations
        const locations = [
            { city: "Bangalore", state: "Karnataka", country: "India" },
            { city: "Mumbai", state: "Maharashtra", country: "India" },
            { city: "Delhi", state: "Delhi", country: "India" },
            { city: "Hyderabad", state: "Telangana", country: "India" },
            { city: "Pune", state: "Maharashtra", country: "India" },
            { city: "Chennai", state: "Tamil Nadu", country: "India" },
            { city: "Gurgaon", state: "Haryana", country: "India" },
            { city: "Noida", state: "Uttar Pradesh", country: "India" },
        ];
        for (const l of locations) await ctx.db.insert("locations", l);

        // Seed Tests
        // Seed Tests
        const standardTests = [
            {
                title: "Frontend Development Fundamentals",
                category: "Engineering",
                difficulty: "Beginner",
                duration: 30,
                questionsCount: 5,
                description: "Test your knowledge of HTML, CSS, and basic JavaScript concepts.",
                rules: ["No googling", "30 minutes time limit"],
                tags: ["HTML", "CSS", "JS"],
                status: "Published",
                imageColor: "bg-blue-500",
                type: "standard",
                questions: [
                    {
                        question: "Which HTML5 element is used to specify a footer for a document or section?",
                        options: ["<footer>", "<bottom>", "<section>", "<end>"],
                        correctAnswer: "<footer>",
                        marks: 2,
                        explanation: "The <footer> tag defines a footer for a document or section."
                    },
                    {
                        question: "In CSS, which property is used to change the background color?",
                        options: ["color", "bgcolor", "background-color", "bg-color"],
                        correctAnswer: "background-color",
                        marks: 2,
                        explanation: "The background-color property sets the background color of an element."
                    },
                    {
                        question: "What is the correct syntax for referring to an external script called 'app.js'?",
                        options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"],
                        correctAnswer: "<script src='app.js'>",
                        marks: 2,
                        explanation: "The <script> tag with the src attribute is used to include external JavaScript files."
                    },
                    {
                        question: "Which CSS property controls the text size?",
                        options: ["text-style", "text-size", "font-size", "font-style"],
                        correctAnswer: "font-size",
                        marks: 2,
                        explanation: "The font-size property sets the size of the font."
                    },
                    {
                        question: "How do you add a comment in a JavaScript?",
                        options: ["<!-- This is a comment -->", "// This is a comment", "'This is a comment", "* This is a comment"],
                        correctAnswer: "// This is a comment",
                        marks: 2,
                        explanation: "Single line comments in JS start with //"
                    }
                ]
            },
            {
                title: "React.js Essentials",
                category: "Engineering",
                difficulty: "Intermediate",
                duration: 45,
                questionsCount: 5,
                description: "Validate your detailed understanding of React hooks, components, and lifecycle.",
                rules: ["No external libraries", "45 minutes time limit"],
                tags: ["React", "JS", "Frontend"],
                status: "Published",
                imageColor: "bg-indigo-500",
                type: "standard",
                questions: [
                    {
                        question: "Which hook is used to perform side effects in functional components?",
                        options: ["useEffect", "useState", "useContext", "useReducer"],
                        correctAnswer: "useEffect",
                        marks: 2,
                        explanation: "useEffect is used for side effects like data fetching, subscriptions, etc."
                    },
                    {
                        question: "What is the virtual DOM?",
                        options: ["A direct copy of the real DOM", "A lightweight representation of the real DOM", "A browser plugin", "None of the above"],
                        correctAnswer: "A lightweight representation of the real DOM",
                        marks: 2,
                        explanation: "React uses a Virtual DOM to optimize updates to the actual DOM."
                    },
                    {
                        question: "How do you pass data to a child component?",
                        options: ["State", "Props", "Context", "Redux"],
                        correctAnswer: "Props",
                        marks: 2,
                        explanation: "Props are used to pass data from parent to child."
                    },
                    {
                        question: "Which hook returns a mutable ref object?",
                        options: ["useRef", "useState", "useMemo", "useEffect"],
                        correctAnswer: "useRef",
                        marks: 2,
                        explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument."
                    },
                    {
                        question: "What prevents a component from re-rendering?",
                        options: ["React.memo", "useMemo", "shouldComponentUpdate", "All of the above"],
                        correctAnswer: "All of the above",
                        marks: 2,
                        explanation: "All these methods can be used to optimize and prevent unnecessary re-renders."
                    }
                ]
            },
            {
                title: "Backend System Design",
                category: "Engineering",
                difficulty: "Expert",
                duration: 60,
                questionsCount: 5,
                description: "Test your skills in designing scalable backend systems and databases.",
                rules: ["Analytical thinking required", "60 minutes"],
                tags: ["System Design", "Backend", "DB"],
                status: "Published",
                imageColor: "bg-slate-700",
                type: "standard",
                questions: [
                    {
                        question: "Which property of ACID guarantees that a transaction is either fully completed or not at all?",
                        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
                        correctAnswer: "Atomicity",
                        marks: 3,
                        explanation: "Atomicity ensures that all operations within a transaction are completed successfully; otherwise, the transaction is aborted."
                    },
                    {
                        question: "Which database type is best suited for handling relationships between data?",
                        options: ["Key-Value Store", "Document Store", "Relational Database (SQL)", "Graph Database"],
                        correctAnswer: "Graph Database",
                        marks: 3,
                        explanation: "Graph databases like Neo4j are optimized for traversing relationships."
                    },
                    {
                        question: "What is load balancing?",
                        options: ["Distributing network traffic across multiple servers", "Increasing database size", "Caching data", "Encrypting data"],
                        correctAnswer: "Distributing network traffic across multiple servers",
                        marks: 2,
                        explanation: "Load balancing improves distribution of workloads across multiple computing resources."
                    },
                    {
                        question: "Which HTTP method is idempotent?",
                        options: ["POST", "PUT", "PATCH", "CONNECT"],
                        correctAnswer: "PUT",
                        marks: 2,
                        explanation: "PUT is idempotent; calling it multiple times with the same data has the same effect."
                    },
                    {
                        question: "What is CAP theorem?",
                        options: ["Consistency, Availability, Partition Tolerance", "Consistency, Accuracy, Performance", "Capacity, Availability, Performance", "None"],
                        correctAnswer: "Consistency, Availability, Partition Tolerance",
                        marks: 3,
                        explanation: "CAP theorem states a distributed system can only deliver two of three guarantees."
                    }
                ]
            },
            {
                title: "Personalized AI Assessment",
                category: "AI Generated",
                difficulty: "Intermediate",
                duration: 30,
                questionsCount: 5,
                description: "A dynamic assessment tailored to your specific profile and skill gaps.",
                rules: ["Adaptive difficulty", "30 minutes"],
                tags: ["AI", "Adaptive"],
                status: "Published",
                imageColor: "bg-purple-600",
                type: "ai_generated",
                questions: [
                    {
                        question: "What is the primary benefit of using AI in software testing?",
                        options: ["Automated test generation", "Faster execution", "Improved accuracy", "All of the above"],
                        correctAnswer: "All of the above",
                        marks: 2,
                        explanation: "AI can automate generation, execution, and analysis of tests."
                    },
                    {
                        question: "Which of the following is a supervised learning algorithm?",
                        options: ["K-Means", "Linear Regression", "Apriori", "DBSCAN"],
                        correctAnswer: "Linear Regression",
                        marks: 2,
                        explanation: "Linear Regression uses labeled training data."
                    },
                    {
                        question: "What is overfitting in machine learning?",
                        options: ["Model performs well on training data but poor on new data", "Model performs poor on training data", "Model is too simple", "None"],
                        correctAnswer: "Model performs well on training data but poor on new data",
                        marks: 2,
                        explanation: "Overfitting happens when a model learns noise in the training data."
                    },
                    {
                        question: "Which neural network architecture is best for image recognition?",
                        options: ["RNN", "CNN", "LSTM", "Transformer"],
                        correctAnswer: "CNN",
                        marks: 2,
                        explanation: "Convolutional Neural Networks (CNNs) are designed for image processing."
                    },
                    {
                        question: "What does NLP stand for?",
                        options: ["Natural Logic Processing", "Neural Language Programming", "Natural Language Processing", "Network Layer Protocol"],
                        correctAnswer: "Natural Language Processing",
                        marks: 2,
                        explanation: "NLP enables computers to understand human language."
                    }
                ]
            }
        ];

        // --- SEED STANDARD TESTS (From seed.ts array) ---
        for (const testData of standardTests) {
            const { questions, ...testInfo } = testData;
            const testId = await ctx.db.insert("tests", testInfo as any);

            for (const q of questions) {
                await ctx.db.insert("questions", {
                    testId,
                    type: "MCQ",
                    question: q.question,
                    correctAnswer: q.correctAnswer,
                    options: q.options,
                    marks: q.marks,
                    explanation: q.explanation
                });
            }
        }
        for (const testData of REACT_QUESTIONS) {
            const testId = await ctx.db.insert("tests", {
                title: testData.title,
                category: testData.category,
                questionsCount: testData.questions,
                duration: parseInt(testData.duration),
                description: "Master React.js with our curated assessment.",
                difficulty: testData.difficulty,
                type: testData.type,
                status: "Published",
                tags: ["React.js", testData.difficulty],
            });

            for (const q of testData.questionsData) {
                await ctx.db.insert("questions", {
                    testId,
                    type: "MCQ",
                    question: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    marks: 1
                });
            }
        }

        // --- SEED STANDARD TOPICS (Placeholders) ---
        for (const topic of STANDARD_TOPICS) {
            const testId = await ctx.db.insert("tests", {
                title: topic.title,
                category: topic.category,
                questionsCount: topic.questions,
                duration: parseInt(topic.duration),
                description: `Practice ${topic.title} questions.`,
                difficulty: topic.difficulty,
                type: topic.type,
                status: "Published",
                tags: topic.tags || [topic.category],
            });

            // Add placeholder questions
            for (let i = 0; i < 5; i++) {
                await ctx.db.insert("questions", {
                    testId,
                    type: "MCQ",
                    question: PLACEHOLDER_QUESTIONS[0].text,
                    options: PLACEHOLDER_QUESTIONS[0].options,
                    correctAnswer: PLACEHOLDER_QUESTIONS[0].correctAnswer,
                    explanation: PLACEHOLDER_QUESTIONS[0].explanation,
                    marks: 1
                });
            }
        }

        return "Seeding complete with search data and tests";
    },
});
