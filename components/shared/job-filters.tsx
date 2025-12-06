"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function JobFilters() {
    return (
        <div className="space-y-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium h-auto py-1 px-2">
                    Clear all
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Filter criteria..." className="pl-9 h-10 bg-slate-50 border-slate-200" />
            </div>

            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                <Accordion type="multiple" defaultValue={["job-type", "roles", "experience"]} className="w-full space-y-2">

                    {/* Job Type */}
                    <AccordionItem value="job-type" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Job Classification</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => (
                                    <div key={type} className="flex items-center space-x-3 group">
                                        <Checkbox id={`type-${type}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`type-${type}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Experience Level */}
                    <AccordionItem value="experience" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Experience Level</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {[
                                    { label: "Fresher / Entry Level", value: "entry" },
                                    { label: "Junior (1-3 yrs)", value: "junior" },
                                    { label: "Mid Level (3-5 yrs)", value: "mid" },
                                    { label: "Senior (5-8 yrs)", value: "senior" },
                                    { label: "Lead / Manager", value: "lead" }
                                ].map((exp) => (
                                    <div key={exp.value} className="flex items-center space-x-3 group">
                                        <Checkbox id={`exp-${exp.value}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`exp-${exp.value}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{exp.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Roles / Categories */}
                    <AccordionItem value="roles" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Roles & Categories</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {[
                                    "Software Development",
                                    "Web Development",
                                    "Mobile App Dev",
                                    "Data Science & AI",
                                    "Sales & Business Dev",
                                    "Digital Marketing",
                                    "Product Management",
                                    "UI/UX Design",
                                    "Human Resources",
                                    "Finance & Accounting"
                                ].map((role) => (
                                    <div key={role} className="flex items-center space-x-3 group">
                                        <Checkbox id={`role-${role}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`role-${role}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{role}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Salary Range */}
                    <AccordionItem value="salary" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Salary Range</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pt-2 px-1">
                                <Slider defaultValue={[5]} max={50} min={0} step={1} className="w-full" />
                                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                    <span>0 LPA</span>
                                    <span>50+ LPA</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Work Mode */}
                    <AccordionItem value="work-mode" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Work Mode</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["On-site", "Remote", "Hybrid"].map((mode) => (
                                    <div key={mode} className="flex items-center space-x-3 group">
                                        <Checkbox id={`mode-${mode}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`mode-${mode}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{mode}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Location (Cities) */}
                    <AccordionItem value="locations" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Top Locations</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai"].map((city) => (
                                    <div key={city} className="flex items-center space-x-3 group">
                                        <Checkbox id={`city-${city}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`city-${city}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{city}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>


                    {/* Date Posted */}
                    <AccordionItem value="date-posted" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-slate-800">Date Posted</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {["Past 24 hours", "Past Week", "Past Month", "Any Time"].map((item) => (
                                    <div key={item} className="flex items-center space-x-3 group">
                                        <Checkbox id={`posted-${item}`} className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <Label htmlFor={`posted-${item}`} className="text-sm text-slate-600 font-medium group-hover:text-primary cursor-pointer transition-colors">{item}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </ScrollArea>
        </div>
    );
}
