"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCard } from "./test-card";
import { useRouter } from "next/navigation";

// Mock Data for Company Mocks
const COMPANY_MOCKS = {
    "Tech": [
        { title: "DevOps Engineer", company: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
        { title: "Software Engineer", company: "Adobe", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" }, // Using PS icon as Adobe proxy or finding better
        { title: "Mobile / App Developer", company: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { title: "Machine Learning Engineer", company: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    ],
    "Management": [
        { title: "Product Manager", company: "Google", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" },
        { title: "Business Analyst", company: "McKinsey", logo: "https://upload.wikimedia.org/wikipedia/commons/1/14/McKinsey_%26_Company_Mark_%282019%29.svg" },
    ],
    "General": [
        { title: "HR Interview", company: "LinkedIn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" },
    ]
};

export function CompanyMockInterviews() {
    const router = useRouter();

    return (
        <section className="mb-12">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-900">Company Mock Interview</h2>
                </div>
                <p className="text-slate-500">Unravel the art of cracking interviews with AI-powered guided practice.</p>
            </div>

            <Tabs defaultValue="Tech" className="w-full">
                <TabsList className="w-full justify-start h-auto bg-transparent p-0 mb-6 gap-2 flex-wrap border-b border-transparent">
                    {Object.keys(COMPANY_MOCKS).map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-full border border-slate-200 px-6 py-2 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none bg-white hover:bg-slate-50 transition-all font-medium"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(COMPANY_MOCKS).map(([tab, items]) => (
                    <TabsContent key={tab} value={tab} className="mt-0">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 justify-center">
                            {items.map((item, i) => (
                                <div key={i} className="h-full">
                                    <TestCard
                                        id={`company-${i}`}
                                        title={item.title}
                                        category={item.company}
                                        questions={10} // Dummy
                                        duration="30 mins" // Dummy
                                        difficulty="Hard" // Dummy
                                        description={`Mock interview for ${item.title} at ${item.company}`}
                                        onClick={() => router.push(`/practice/company/${encodeURIComponent(item.company)}`)}
                                        // Custom override for company card look
                                        customLogo={item.logo}
                                        customBannerColor="bg-white" // Clean look for companies
                                        hideStats={true} // Clean look
                                        buttonText="Start Interview"
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
}
