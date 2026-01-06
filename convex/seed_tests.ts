
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Broad Topics Mapping
const TOPICS = [
    // Coding
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "DSA", "OOPS", "Computer Fundamentals", "Operating Systems", "DBMS", "Computer Networks",
    // Aptitude & Reasoning
    "Aptitude", "Quant", "Logical", "Reasoning", "Data Interpretation",
    // English
    "English", "Verbal Ability", "Grammar",
    // Domain
    "Financial Accounting", "Marketing", "Sales", "Economics", "Supply Chain", "Brand Management", "Micro-Economics", "Macro-Economics", "Retail Management", "Digital Marketing", "Banking Management", "Credit Risk Management"
];

function getTopicColor(topic: string) {
    const t = topic.toLowerCase();
    if (["python", "java", "c++", "c", "javascript", "react", "node"].some(k => t.includes(k))) return "bg-blue-500";
    if (["dsa", "oops", "computer", "dbms", "system"].some(k => t.includes(k))) return "bg-purple-500";
    if (["aptitude", "quant", "logical", "reasoning"].some(k => t.includes(k))) return "bg-green-500";
    if (["english", "verbal"].some(k => t.includes(k))) return "bg-teal-500";
    if (["financial", "marketing", "sales", "brand", "economics", "retail", "banking"].some(k => t.includes(k))) return "bg-orange-500";
    return "bg-slate-500";
}

// Helper to get questions based on category
const getQuestionsForCategory = (category: string, count: number = 5, difficulty: string = "Beginner") => {
    const questions = [];
    const base = category.toLowerCase();

    if (base.includes("python")) {
        questions.push(
            { type: "mcq", question: "What is the output of print(2**3)?", options: ["6", "8", "9", "Error"], correct: "8", explanation: "2 to the power of 3 is 8." },
            { type: "mcq", question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["List", "Dictionary", "Tuple", "Set"], correct: "List", explanation: "Lists are ordered and mutable." },
            { type: "mcq", question: "How do you insert a comment in Python?", options: ["//", "#", "/*", "<!--"], correct: "#", explanation: "# is used for comments." },
            { type: "mcq", question: "Which method removes whitespace from beginning and end?", options: ["strip()", "trim()", "clean()", "cut()"], correct: "strip()", explanation: "strip() removes leading and trailing whitespace." },
            { type: "mcq", question: "What is the correct file extension for Python files?", options: [".py", ".pt", ".pyt", ".python"], correct: ".py", explanation: "Python files end in .py" },
            { type: "mcq", question: "Which operator is used for floor division?", options: ["/", "//", "%", "#"], correct: "//", explanation: "// is floor division." },
            { type: "mcq", question: "What is the output of 'HELLO'.lower()?", options: ["hello", "Hello", "HELLO", "Error"], correct: "hello", explanation: "lower() converts to lowercase." },
            { type: "mcq", question: "Which keyword is used to create a class?", options: ["class", "struct", "object", "def"], correct: "class", explanation: "class is the keyword." },
            { type: "mcq", question: "How to create a variable with value 5?", options: ["x = 5", "int x = 5", "x : 5", "val x = 5"], correct: "x = 5", explanation: "Python is dynamically typed." },
            { type: "mcq", question: "Which statement is used to stop a loop?", options: ["stop", "break", "exit", "return"], correct: "break", explanation: "break stops the loop." }
        );
    } else if (base.includes("aptitude") || base.includes("quant") || base.includes("reasoning")) {
        if (difficulty === "Beginner") {
            questions.push(
                { type: "mcq", question: "What is 20% of 150?", options: ["20", "25", "30", "35"], correct: "30", explanation: "10% is 15. 20% is 30." },
                { type: "mcq", question: "If a car travels 60km in 1 hour, what is its speed?", options: ["30km/h", "60km/h", "120km/h", "10km/h"], correct: "60km/h", explanation: "Speed = Distance/Time." },
                { type: "mcq", question: "Simplify: 10 + 2 * 3", options: ["36", "16", "24", "12"], correct: "16", explanation: "BODMAS: 2*3=6, 10+6=16." },
                { type: "mcq", question: "Which number is even?", options: ["23", "45", "12", "99"], correct: "12", explanation: "Ends in 2." },
                { type: "mcq", question: "What is the square of 12?", options: ["124", "144", "122", "164"], correct: "144", explanation: "12 * 12 = 144." },
                { type: "mcq", question: "Find x if 2x = 10", options: ["2", "5", "10", "20"], correct: "5", explanation: "x = 10/2 = 5." },
                { type: "mcq", question: "Average of 2, 4, 6, 8, 10?", options: ["5", "6", "7", "8"], correct: "6", explanation: "Sum=30. 30/5 = 6." },
                { type: "mcq", question: "100 - 45 = ?", options: ["55", "65", "45", "35"], correct: "55", explanation: "Simple subtraction." },
                { type: "mcq", question: "What comes next: 2, 4, 8, 16, ?", options: ["24", "30", "32", "64"], correct: "32", explanation: "Doubling pattern." },
                { type: "mcq", question: "Cost of 5 pens is $25. Cost of 1 pen?", options: ["$2", "$5", "$10", "$20"], correct: "$5", explanation: "25/5 = 5." }
            );
        } else if (difficulty === "Intermediate") {
            questions.push(
                { type: "mcq", question: "A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?", options: ["65 sec", "89 sec", "100 sec", "150 sec"], correct: "89 sec", explanation: "Speed=240/24=10m/s. Total dist=240+650=890m. Time=890/10=89s." },
                { type: "mcq", question: "A and B together can complete a piece of work in 4 days. If A alone can complete the same work in 12 days, in how many days can B alone complete that work?", options: ["4 days", "5 days", "6 days", "7 days"], correct: "6 days", explanation: "1/A + 1/B = 1/4. 1/12 + 1/B = 1/4 => 1/B = 1/6." },
                { type: "mcq", question: "If selling price is doubled, the profit triples. Find the profit percent.", options: ["66.66", "100", "120", "150"], correct: "100", explanation: "Let CP=x, SP=y. Profit=y-x. New SP=2y. New Profit=2y-x. Given 2y-x = 3(y-x) => 2x=y. Profit% = (2x-x)/x * 100 = 100%." },
                { type: "mcq", question: "Simple interest on a certain sum at a certain annual rate of interest is 1/9 of the sum. If the numbers representing rate percent and time in years be equal, then rate of interest is:", options: ["3.33%", "5%", "6.66%", "10%"], correct: "3.33%", explanation: "SI = P*R*T/100. P/9 = P*R*R/100 => R^2 = 100/9 => R=10/3." },
                { type: "mcq", question: "A bag contains 50 P, 25 P and 10 P coins in the ratio 5: 9: 4, amounting to Rs. 206. Find the number of coins of each type respectively.", options: ["200, 360, 160", "150, 300, 120", "200, 300, 150", "None"], correct: "200, 360, 160", explanation: "Let coins be 5x, 9x, 4x. Val: 5x/2 + 9x/4 + 4x/10 = 206. Solve x=40." },
                { type: "mcq", question: "Two numbers are in ratio 3:5. If 9 is subtracted from each, the new numbers are in ratio 12:23. The smaller number is:", options: ["27", "33", "49", "55"], correct: "33", explanation: "Solve (3x-9)/(5x-9) = 12/23. x=11. Smaller=33." },
                { type: "mcq", question: "Find the odd man out: 3, 5, 11, 14, 17, 21", options: ["21", "17", "14", "3"], correct: "14", explanation: "14 is the only even number and not prime-ish in this context maybe? Actually 14 and 21 are not prime. 3,5,11,17 are prime. 21 is odd. 14 even." },
                { type: "mcq", question: "Look at this series: 36, 34, 30, 28, 24, ... What comes next?", options: ["20", "22", "23", "26"], correct: "22", explanation: "-2, -4, -2, -4 pattern." },
                { type: "mcq", question: "Which word does NOT belong with the others?", options: ["Tulip", "Rose", "Bud", "Daisy"], correct: "Bud", explanation: "Others are flowers. Bud is a stage." },
                { type: "mcq", question: "Book is to Reading as Fork is to:", options: ["Drawing", "Writing", "Eating", "Cooking"], correct: "Eating", explanation: "Tool for action." }
            );
        } else {
            // Expert
            questions.push(
                { type: "mcq", question: "A, B, C subscribe Rs. 50,000 for a business. A subscribes Rs. 4000 more than B and B Rs. 5000 more than C. Out of a total profit of Rs. 35,000, A receives:", options: ["Rs. 8400", "Rs. 11900", "Rs. 13600", "Rs. 14700"], correct: "Rs. 14700", explanation: "x + x+5000 + x+9000 = 50000 => x=12000. Ratio A:B:C = 21:17:12. A's share = 21/50 * 35000." },
                { type: "mcq", question: "The probability that a card drawn from a pack of 52 cards will be a diamond or a king is:", options: ["2/13", "4/13", "1/13", "1/52"], correct: "4/13", explanation: "Diamonds=13. Kings=4. King of Diamonds is common. (13+4-1)/52 = 16/52 = 4/13." },
                { type: "mcq", question: "A clock is set right at 5 a.m. The clock loses 16 minutes in 24 hours. What will be the true time when the clock indicates 10 p.m. on 4th day?", options: ["11 p.m.", "12 p.m.", "1 p.m.", "2 p.m."], correct: "11 p.m.", explanation: "Time from 5am to 10pm 4th day = 89 hours. Clock loses 16min/24hr. True time logic applies." },
                { type: "mcq", question: "Find the unit digit in the product (2467)^153 x (341)^72.", options: ["1", "3", "7", "9"], correct: "7", explanation: "7^153 -> 7^1 = 7. 1^72 = 1. 7*1=7." },
                { type: "mcq", question: "If log 27 = 1.431, then the value of log 9 is:", options: ["0.932", "0.945", "0.954", "0.958"], correct: "0.954", explanation: "log 27 = 3 log 3 = 1.431 => log 3 = 0.477. log 9 = 2 log 3 = 0.954." },
                { type: "mcq", question: "A boat takes 90 minutes less to travel 36 miles downstream than to travel the same distance upstream. If speed of boat in still water is 10 mph, speed of stream is:", options: ["2 mph", "2.5 mph", "3 mph", "4 mph"], correct: "2 mph", explanation: "36/(10-s) - 36/(10+s) = 90/60. Solve for s." },
                { type: "mcq", question: "Present ages of Sameer and Anand are in ratio 5 : 4. Three years hence number, ratio will be 11 : 9. What is Anand's present age?", options: ["24", "27", "40", "Cannot be determined"], correct: "24", explanation: "(5x+3)/(4x+3) = 11/9. x=6. Anand = 24." },
                { type: "mcq", question: "Two pipes A and B can fill a tank in 15 minutes and 20 minutes respectively. Both pipes are opened together but after 4 minutes, pipe A is turned off. What is the total time required to fill the tank?", options: ["10 min", "11 min", "12 min", "14 min 40 sec"], correct: "14 min 40 sec", explanation: "Part filled in 4 min = 4(1/15 + 1/20) = 7/15. Rem = 8/15. B takes 20 * 8/15 = 32/3 min = 10m 40s. Total = 14m 40s." },
                { type: "mcq", question: "The H.C.F. of two numbers is 23 and the other two factors of their L.C.M. are 13 and 14. The larger of the two numbers is:", options: ["276", "299", "322", "345"], correct: "322", explanation: "Numbers are 23*13 and 23*14." },
                { type: "mcq", question: "In how many different ways can the letters of the word 'CORPORATION' be arranged so that the vowels always come together?", options: ["810", "1440", "2880", "50400"], correct: "50400", explanation: "CRPRTN (6) + OOAIO (5). (6+1)! / 2! * (5! / 3!)." }
            );
        }
    } else if (base.includes("react")) {
        questions.push(
            { type: "mcq", question: "Hook for side effects?", options: ["useState", "useEffect", "useMemo", "useCallback"], correct: "useEffect", explanation: "useEffect handles side effects." },
            { type: "mcq", question: "What is JSX?", options: ["JavaScript XML", "Java Syntax Extension", "JSON X", "None"], correct: "JavaScript XML", explanation: "JSX is syntax extension for JS." },
            { type: "mcq", question: "How do you pass data to components?", options: ["State", "Props", "Render", "PropTypes"], correct: "Props", explanation: "Props are used to pass data." },
            { type: "mcq", question: "Which hook is used for state?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: "useState", explanation: "useState manages state." },
            { type: "mcq", question: "Can React hooks be used in class components?", options: ["Yes", "No", "Only some", "With a wrapper"], correct: "No", explanation: "Hooks are for functional components." },
            { type: "mcq", question: "What is the Virtual DOM?", options: ["A direct copy of Real DOM", "A lightweight representation of Real DOM", "A browser extension", "None"], correct: "A lightweight representation of Real DOM", explanation: "React uses it to optimize updates." },
            { type: "mcq", question: "Method to prevent default behavior?", options: ["preventDefault()", "stopPropagation()", "prevent()", "stop()"], correct: "preventDefault()", explanation: "Standard JS method." },
            { type: "mcq", question: "What creates a context?", options: ["React.createContext", "React.makeContext", "React.context", "new Context"], correct: "React.createContext", explanation: "API to create context." }
        );
    } else if (base.includes("computer fundamentals")) {
        questions.push(
            { type: "mcq", question: "What is the brain of the computer?", options: ["CPU", "RAM", "HDD", "GPU"], correct: "CPU", explanation: "CPU processes instructions." },
            { type: "mcq", question: "Which memory is volatile?", options: ["ROM", "RAM", "Flash", "Hard Disk"], correct: "RAM", explanation: "RAM loses data on power loss." },
            { type: "mcq", question: "1 Byte equals how many bits?", options: ["4", "8", "16", "32"], correct: "8", explanation: "1 Byte = 8 bits." },
            { type: "mcq", question: "Which is an Output device?", options: ["Keyboard", "Mouse", "Printer", "Scanner"], correct: "Printer", explanation: "Printer produces output." },
            { type: "mcq", question: "Which is an Input device?", options: ["Monitor", "Speaker", "Scanner", "Projector"], correct: "Scanner", explanation: "Scanner inputs data." }
        );
    } else if (base.includes("cn") || base.includes("network")) {
        questions.push(
            { type: "mcq", question: "OSI model has how many layers?", options: ["5", "6", "7", "4"], correct: "7", explanation: "OSI model consists of 7 layers." },
            { type: "mcq", question: "HTTP uses which port?", options: ["80", "443", "21", "22"], correct: "80", explanation: "Port 80 is standard for HTTP." },
            { type: "mcq", question: "What is IPv4 length?", options: ["32 bits", "64 bits", "128 bits", "16 bits"], correct: "32 bits", explanation: "IPv4 addresses are 32-bit." },
            { type: "mcq", question: "Protocol for sending email?", options: ["POP3", "SMTP", "IMAP", "HTTP"], correct: "SMTP", explanation: "Simple Mail Transfer Protocol." },
            { type: "mcq", question: "Which layer provides encryption?", options: ["Network", "Transport", "Presentation", "Session"], correct: "Presentation", explanation: "Presentation layer handles formatting/encryption." }
        );
    } else if (base.includes("financial")) {
        questions.push(
            { type: "mcq", question: "Assets = Liabilities + ?", options: ["Equity", "Revenue", "Expenses", "Debt"], correct: "Equity", explanation: "Fundamental accounting equation." },
            { type: "mcq", question: "GAAP stands for?", options: ["General Accepted Accounting Principles", "Global Accounting Audit Protocol", "General Audit Plan", "None"], correct: "General Accepted Accounting Principles", explanation: "Standard accounting principles." }
        );
    }

    // Fill the rest with placeholders to match requested count
    let i = 1;
    while (questions.length < count) {
        questions.push({
            type: "mcq",
            question: `Sample Question ${questions.length + 1} for ${category} (Placeholder)`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: "Option A",
            explanation: "This is a placeholder explanation."
        });
        i++;
    }

    return questions.slice(0, count);
};

export const seedTests = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Clear existing tests
        const existingTests = await ctx.db.query("tests").collect();
        for (const t of existingTests) {
            await ctx.db.delete(t._id);
        }

        // 2. Clear existing questions
        const existingQuestions = await ctx.db.query("questions").collect();
        for (const q of existingQuestions) {
            await ctx.db.delete(q._id);
        }

        console.log("Cleared existing data. Seeding new tests... VERSION 3");

        // 3. Generate and Insert Tests & Questions
        const difficulties = ["Beginner", "Intermediate", "Expert"];

        for (const topic of TOPICS) {
            for (const diff of difficulties) {
                // Determine mock params based on difficulty
                let duration = 30;
                let qCount = 10;
                if (diff === "Intermediate") { duration = 45; qCount = 10; }
                if (diff === "Expert") { duration = 90; qCount = 30; }

                const testData = {
                    title: `${topic} ${diff} Assessment`,
                    category: topic,
                    duration: duration,
                    questionsCount: qCount,
                    difficulty: diff,
                    description: `A ${diff.toLowerCase()} level assessment to test your ${topic} skills.`,
                    imageColor: getTopicColor(topic),
                    status: "Published",
                    type: "Skill Assessment",
                    tags: [topic.toLowerCase(), "practice", diff.toLowerCase()]
                };

                // Create Test
                const testId = await ctx.db.insert("tests", {
                    ...testData,
                    tags: testData.tags, // Explicitly pass tags
                    questions: [] // Initial empty
                });

                // Generate Questions with Difficulty
                const questions = getQuestionsForCategory(topic, qCount, diff);

                // We also need to insert into 'questions' table for strict relationships used by getTestById
                for (const q of questions) {
                    await ctx.db.insert("questions", {
                        testId: testId,
                        type: q.type,
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correct, // Mapping 'correct' to 'correctAnswer' for table
                        explanation: q.explanation,
                        marks: diff === "Beginner" ? 2 : (diff === "Intermediate" ? 4 : 5),
                        difficulty: diff,
                        codeTemplate: ""
                    });
                }

                // Update Test with embedded questions for schema compliance
                await ctx.db.patch(testId, {
                    questions: questions.map(q => ({
                        type: q.type,
                        question: q.question,
                        options: q.options,
                        correct: q.correct
                    }))
                });
            }
        }

        return `Successfully seeded ${TOPICS.length * 3} tests across ${TOPICS.length} topics!`;
    },
});
