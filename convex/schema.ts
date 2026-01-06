import { defineSchema, defineTable } from "convex/server";


import { v } from "convex/values";

export default defineSchema({
    // --- User Tables (Separated) ---
    admins: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        role: v.optional(v.string()), // "admin"
        image: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"]).index("by_email", ["email"]),

    recruiters: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        role: v.optional(v.string()), // "recruiter"
        companyId: v.optional(v.id("companies")),
        verificationStatus: v.optional(v.string()), // "pending", "verified", "rejected"
        plan: v.optional(v.string()), // "free", "pro", "enterprise"
        mobile: v.optional(v.string()),
        about: v.optional(v.string()),
        image: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"]).index("by_email", ["email"]),

    job_seekers: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        role: v.optional(v.string()), // "candidate"
        isRequestingAdmin: v.optional(v.boolean()), // For admin flow

        // Onboarding & Strict Application Flow
        onboardingStatus: v.optional(v.string()), // "pending", "completed", "skipped"
        resumeMetadata: v.optional(v.object({
            uploaded: v.boolean(),
            source: v.optional(v.string()), // "pdf", "ai-generated"
            parsed: v.optional(v.boolean()),
            fileId: v.optional(v.string()), // storage ID
        })),
        profileStatus: v.optional(v.object({
            autoFilled: v.boolean(),
            confirmed: v.boolean(),
            completionLevel: v.optional(v.number()), // 1, 2, 3
        })),

        // Profile Data
        image: v.optional(v.string()),
        about: v.optional(v.string()),
        headline: v.optional(v.string()),
        mobile: v.optional(v.string()),
        currentLocation: v.optional(v.string()),

        // Resume Data
        resume: v.optional(v.string()),
        skills: v.optional(v.array(v.string())),
        resumeData: v.optional(v.any()), // Stores JSON data for the Resume Builder
        experience: v.optional(v.array(v.any())),
        education: v.optional(v.array(v.any())),
        certificates: v.optional(v.array(v.any())),
        projects: v.optional(v.array(v.any())),
        achievements: v.optional(v.array(v.any())),
        responsibilities: v.optional(v.array(v.any())),
        hobbies: v.optional(v.array(v.string())),
        socialLinks: v.optional(v.any()),

        // Extended Profile
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        username: v.optional(v.string()),
        gender: v.optional(v.string()),
        userType: v.optional(v.string()), // "student", "professional"

        // Education/Domain details
        domain: v.optional(v.string()),
        domainId: v.optional(v.id("domains")),
        course: v.optional(v.string()),
        courseId: v.optional(v.id("courses")),
        courseSpecialization: v.optional(v.string()),
        specializationId: v.optional(v.id("specializations")),
        courseDuration: v.optional(v.object({
            startYear: v.string(),
            endYear: v.string(),
        })),

        // Professional details
        organization: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        purpose: v.optional(v.string()),
        careerGoals: v.optional(v.string()),
        preferredWorkLocation: v.optional(v.string()),

        // Personal
        pronouns: v.optional(v.string()),
        dateOfBirth: v.optional(v.string()),
        currentAddress: v.optional(v.any()),
        permanentAddress: v.optional(v.any()),
        differentlyAbled: v.optional(v.string()), // "Yes" or "No"
    }).index("by_token", ["tokenIdentifier"]).index("by_email", ["email"]).searchIndex("search_name", { searchField: "name" }),

    // Deprecated but kept for reference if needed during migration, or remove if comfortable.
    // Deprecated but kept for reference and migration. All fields optional.
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        role: v.optional(v.string()),

        // Legacy fields to pass validation
        about: v.optional(v.string()),
        achievements: v.optional(v.array(v.any())),
        certificates: v.optional(v.array(v.any())),
        course: v.optional(v.string()),
        courseDuration: v.optional(v.any()),
        courseId: v.optional(v.string()),
        courseSpecialization: v.optional(v.string()),
        currentAddress: v.optional(v.any()),
        currentLocation: v.optional(v.string()),
        dateOfBirth: v.optional(v.string()),
        domain: v.optional(v.string()),
        domainId: v.optional(v.string()),
        education: v.optional(v.array(v.any())),
        experience: v.optional(v.array(v.any())),
        firstName: v.optional(v.string()),
        gender: v.optional(v.string()),
        hobbies: v.optional(v.array(v.string())),
        lastName: v.optional(v.string()),
        mobile: v.optional(v.string()),
        organization: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        permanentAddress: v.optional(v.any()),
        preferredWorkLocation: v.optional(v.string()),
        projects: v.optional(v.array(v.any())),
        pronouns: v.optional(v.string()),
        purpose: v.optional(v.string()),
        responsibilities: v.optional(v.array(v.any())),
        resume: v.optional(v.string()),
        skills: v.optional(v.array(v.string())),
        socialLinks: v.optional(v.any()),
        specializationId: v.optional(v.string()),
        userType: v.optional(v.string()),
        username: v.optional(v.string()),
        verificationStatus: v.optional(v.string()),
        isRequestingAdmin: v.optional(v.boolean()),
    }).index("by_token", ["tokenIdentifier"]),

    // --- Search Datasets ---
    // --- Master Data ---
    domains: defineTable({
        name: v.string(), // e.g., Engineering, Medical
        description: v.optional(v.string()),
    }).searchIndex("search_name", { searchField: "name" }),

    courses: defineTable({
        name: v.string(), // e.g., B.Tech, MBA
        domainId: v.id("domains"),
        duration: v.optional(v.string()), // e.g., "4 Years"
        type: v.optional(v.string()), // UG, PG, Diploma
    }).index("by_domain", ["domainId"]).searchIndex("search_name", { searchField: "name" }),

    specializations: defineTable({
        name: v.string(), // e.g., Computer Science, Finance
        courseId: v.id("courses"),
    }).index("by_course", ["courseId"]).searchIndex("search_name", { searchField: "name" }),

    universities: defineTable({
        name: v.string(),
        shortName: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        type: v.optional(v.string()), // Central, State, Private
        naacGrade: v.optional(v.string()),
        nirfRank: v.optional(v.number()),
        website: v.optional(v.string()),
    }).searchIndex("search_name", { searchField: "name" }),

    colleges: defineTable({
        name: v.string(),
        shortName: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        country: v.string(),
        universityId: v.optional(v.id("universities")),
        instituteType: v.optional(v.string()), // Govt, Private
        approvalBody: v.optional(v.string()), // UGC, AICTE
        website: v.optional(v.string()),
        tier: v.optional(v.string()), // Tier 1, 2, 3
    }).searchIndex("search_name", { searchField: "name" }).index("by_university", ["universityId"]),

    skills: defineTable({
        name: v.string(),
        category: v.optional(v.string()), // replaces type roughly
        domain: v.optional(v.string()),
        rolesApplicable: v.optional(v.array(v.string())),
        synonyms: v.optional(v.array(v.string())),
        popularityScore: v.optional(v.number()),
        type: v.optional(v.string()), // Added to fix schema validation error
    }).searchIndex("search_name", { searchField: "name" }),

    roles: defineTable({
        name: v.string(),
        domain: v.optional(v.string()),
        description: v.optional(v.string()),
    }).searchIndex("search_name", { searchField: "name" }),

    aliases: defineTable({
        name: v.string(), // e.g., "IITB"
        targetId: v.string(), // ID of the university/college/skill
        targetTable: v.string(), // "universities", "colleges", "skills"
        type: v.string(), // "abbreviation", "misspelling"
    }).searchIndex("search_name", { searchField: "name" }),

    job_titles: defineTable({
        title: v.string(),
        category: v.string(),
    }).searchIndex("search_title", { searchField: "title" }),

    locations: defineTable({
        city: v.string(),
        state: v.string(),
        country: v.string(),
    }).searchIndex("search_city", { searchField: "city" }),

    // Updated Companies with Search
    companies: defineTable({
        name: v.string(),
        logo: v.optional(v.string()),
        banner: v.optional(v.string()), // Added Banner
        description: v.optional(v.string()),
        location: v.optional(v.string()),
        website: v.optional(v.string()),
        email: v.optional(v.string()), // Added top-level email
        industry: v.optional(v.string()),
        headquarters: v.optional(v.string()),
        status: v.string(),
        plan: v.string(),
        size: v.optional(v.string()), // e.g., "1-10", "11-50", "51-200"

        // HR Details
        hrDetails: v.optional(v.object({
            email: v.string(),
            name: v.optional(v.string()),
            phone: v.optional(v.string()),
        })),

        // Social
        socialLinks: v.optional(v.array(v.object({
            platform: v.string(), // LinkedIn, Twitter
            url: v.string(),
        }))),
    }).searchIndex("search_name", { searchField: "name" }),

    // Tests Schema
    tests: defineTable({
        title: v.string(),
        category: v.string(), // Aptitude, Coding, Company Mock, etc.
        difficulty: v.string(), // "Beginner", "Intermediate", "Expert"
        duration: v.number(), // in minutes
        questionsCount: v.number(),
        description: v.optional(v.string()),
        rules: v.optional(v.array(v.string())),
        tags: v.array(v.string()),
        isPremium: v.optional(v.boolean()),
        imageColor: v.optional(v.string()),
        type: v.optional(v.string()), // "standard" | "ai_generated"
        status: v.string(), // Published, Draft
        questions: v.optional(v.array(v.object({
            type: v.string(),
            question: v.string(),
            options: v.optional(v.array(v.string())),
            correct: v.string(),
        }))),
    }),

    questions: defineTable({
        testId: v.optional(v.id("tests")), // Made optional for question bank
        type: v.string(), // MCQ, CODE
        question: v.string(), // HTML/Markdown content
        options: v.optional(v.array(v.string())), // For MCQ
        correctAnswer: v.string(), // Option index or expected output
        explanation: v.optional(v.string()),
        marks: v.number(),
        // Question Bank Fields
        subject: v.optional(v.string()),
        difficulty: v.optional(v.string()), // "Beginner", "Intermediate", "Expert"
        tags: v.optional(v.array(v.string())),

        // Coding specific
        codeTemplate: v.optional(v.string()),
        testCases: v.optional(v.array(v.object({
            input: v.string(),
            output: v.string(),
            isHidden: v.boolean(),
        }))),
    }).index("by_test", ["testId"]),

    test_attempts: defineTable({
        userId: v.string(), // Relaxed from v.id("job_seekers") to handle legacy data
        testId: v.id("tests"),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.string(), // ongoing, completed
        score: v.optional(v.number()),
        totalCorrect: v.optional(v.number()),
        totalWrong: v.optional(v.number()),
        totalSkipped: v.optional(v.number()),
        accuracy: v.optional(v.number()),
    }).index("by_user", ["userId"]).index("by_test", ["testId"]),

    test_answers: defineTable({
        attemptId: v.id("test_attempts"),
        questionId: v.id("questions"),
        selectedOption: v.optional(v.string()), // For MCQ
        code: v.optional(v.string()), // For Coding
        isCorrect: v.optional(v.boolean()),
        timeSpent: v.number(), // in seconds
        status: v.string(), // answered, skipped, review
        marksObtained: v.optional(v.number()),
    }).index("by_attempt", ["attemptId"]),

    // Notifications (New)
    notifications: defineTable({
        userId: v.string(),
        type: v.string(), // "application", "shortlist", "system"
        message: v.string(),
        link: v.optional(v.string()),
        isRead: v.boolean(),
        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Billing History (New)
    billing_history: defineTable({
        companyId: v.id("companies"),
        amount: v.number(),
        date: v.number(),
        plan: v.string(), // "Basic", "Pro"
        invoiceUrl: v.optional(v.string()),
        status: v.string(), // "Paid", "Pending"
    }).index("by_company", ["companyId"]),

    // Jobs (Updated)
    jobs: defineTable({
        title: v.string(),
        companyId: v.id("companies"),
        location: v.string(),
        type: v.string(), // Full-time, Contract
        workMode: v.optional(v.string()), // Remote, Hybrid, On-site
        salary: v.string(),
        salaryDuration: v.optional(v.string()), // "month", "year"
        description: v.string(),
        responsibilities: v.optional(v.string()), // HTML/Markdown
        requirements: v.array(v.string()),
        postedAt: v.number(),
        applicationDeadline: v.optional(v.number()), // Timestamp

        workDays: v.optional(v.string()), // e.g. "5 Days", "Mon-Fri"
        workHours: v.optional(v.string()), // e.g. "9 AM - 6 PM"

        status: v.string(), // Pending, Active, Paused, Closed
        tags: v.array(v.string()),

        isFeatured: v.optional(v.boolean()),

        // Analytics
        views: v.optional(v.number()),
        clicks: v.optional(v.number()),

        // Branding
        companyLogo: v.optional(v.string()),
        companyBanner: v.optional(v.string()),

        // Smart Eligibility
        minExperience: v.optional(v.number()),
        minEducation: v.optional(v.string()),
        requiredSkills: v.optional(v.array(v.string())),

        // Custom Apply Form
        customApplyForm: v.optional(v.array(v.object({
            id: v.string(),
            question: v.string(),
            type: v.string(), // text, file, boolean, mcq
            options: v.optional(v.array(v.string())), // for mcq
            isRequired: v.boolean(),
        }))),
    }).index("by_company", ["companyId"]).searchIndex("search_title", { searchField: "title" }).index("by_status", ["status"]),

    // Internships (Mirrors Jobs)
    internships: defineTable({
        title: v.string(),
        companyId: v.id("companies"),
        location: v.string(),
        type: v.string(), // Full-time, Part-time
        workMode: v.optional(v.string()), // Remote, Hybrid, On-site
        stipend: v.string(), // e.g. "10k/month"
        duration: v.string(), // e.g. "6 months"
        description: v.string(),
        responsibilities: v.optional(v.string()), // HTML/Markdown
        requirements: v.array(v.string()),
        postedAt: v.number(),
        applicationDeadline: v.optional(v.number()), // Timestamp

        workDays: v.optional(v.string()), // e.g. "5 Days", "Mon-Fri"
        workHours: v.optional(v.string()), // e.g. "9 AM - 6 PM"

        status: v.string(), // Pending, Active, Paused, Closed
        tags: v.array(v.string()),

        isFeatured: v.optional(v.boolean()),

        // Analytics
        views: v.optional(v.number()),
        clicks: v.optional(v.number()),

        // Branding
        companyLogo: v.optional(v.string()),
        companyBanner: v.optional(v.string()),

        // Smart Eligibility
        minEducation: v.optional(v.string()),
        requiredSkills: v.optional(v.array(v.string())),

        // Custom Apply Form
        customApplyForm: v.optional(v.array(v.object({
            id: v.string(),
            question: v.string(),
            type: v.string(), // text, file, boolean, mcq
            options: v.optional(v.array(v.string())), // for mcq
            isRequired: v.boolean(),
        }))),
    }).index("by_company", ["companyId"]).searchIndex("search_title", { searchField: "title" }).index("by_status", ["status"]),

    // Banners
    banners: defineTable({
        title: v.string(),
        imageUrl: v.string(),
        link: v.optional(v.string()),
        type: v.string(),
        position: v.optional(v.number()),
        isActive: v.boolean(),
    }),

    // Job Applications (Updated)
    applications: defineTable({
        jobId: v.union(v.id("jobs"), v.id("internships")),
        userId: v.id("job_seekers"), // Candidates apply
        status: v.string(), // "Applied", "Shortlisted", "Rejected", "Selected"
        appliedAt: v.number(),
        resumeUrl: v.optional(v.string()),
        coverLetter: v.optional(v.string()),
        customAnswers: v.optional(v.array(v.object({
            questionId: v.string(),
            answer: v.any(),
        }))),
        timeline: v.optional(v.array(v.object({
            status: v.string(),
            updatedAt: v.number(),
            note: v.optional(v.string())
        }))),
        notes: v.optional(v.string()), // Internal Recruiter Notes
        feedback: v.optional(v.string()), // Candidate facing feedback
    }).index("by_job", ["jobId"]).index("by_user", ["userId"]),

    // Blogs
    blogs: defineTable({
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        author: v.string(), // Display Name
        authorId: v.optional(v.string()), // ID of the user (Admin or Recruiter)
        authorRole: v.optional(v.string()), // "admin" or "recruiter"
        authorImage: v.optional(v.string()),
        tags: v.array(v.string()),
        publishedAt: v.number(),
        isPublished: v.boolean(),
    }).searchIndex("search_title", { searchField: "title" })
        .index("by_slug", ["slug"])
        .index("by_authorId", ["authorId"]),

    // Bookmarks & Watchlist
    bookmarks: defineTable({
        userId: v.string(), // Clerk ID or User ID (prefer consistent)
        type: v.string(), // "job", "internship", "practice_paper", "question"
        targetId: v.string(), // ID of the item
        createdAt: v.number(),
    }).index("by_user", ["userId"]).index("by_user_type", ["userId", "type"]).index("by_target", ["targetId", "userId"]), // Compound for quick check

    // Recently Viewed History
    recentlyViewed: defineTable({
        userId: v.string(),
        type: v.string(), // "job", "internship"
        targetId: v.string(),
        viewedAt: v.number(),
        metadata: v.optional(v.object({
            title: v.string(),
            subtitle: v.optional(v.string()), // Company or Category
            link: v.string(),
        })),
    }).index("by_user", ["userId"]).index("by_user_type", ["userId", "type"]),
});
