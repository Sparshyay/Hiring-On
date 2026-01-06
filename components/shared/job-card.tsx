import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Building2, Clock, Briefcase, Share2, Heart, Users, Hourglass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

function BookmarkButton({ id, type, className }: { id: string, type: string, className?: string }) {
    const toggleBookmark = useMutation(api.user_actions.toggleBookmark);
    const bookmarks = useQuery(api.user_actions.getBookmarks, { type });

    // Check if bookmarked
    const isBookmarked = bookmarks?.some(b => b.targetId === id) || false;
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        setIsLoading(true);
        try {
            await toggleBookmark({ type, targetId: id });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn("text-slate-400 hover:text-primary transition-colors z-10 p-1 rounded-full hover:bg-slate-100", className)}
        >
            <Heart className={cn("w-5 h-5", isBookmarked ? "fill-primary text-primary" : "")} />
        </button>
    );
}

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    salaryDuration?: string;
    tags: string[];
    logo?: string;
    variant?: "grid" | "list";
    applicationDeadline?: number;
    postedAt?: number;
    isFeatured?: boolean;
    bookmarkType?: string;
}

function getDaysLeft(deadline: number | undefined) {
    if (!deadline) return null;
    const diff = deadline - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
}

function timeAgo(date: number | undefined) {
    if (!date) return "Recently";
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    return "Recently";
}

export function JobCard({ id, title, company, location, type, salary, salaryDuration, tags, variant = "grid", applicationDeadline, postedAt, isFeatured, logo, bookmarkType = "job" }: JobCardProps) {
    // Mock data to match the UI requirement since backend doesn't provide all these yet
    const experience = "0-2 years";
    const postedDate = timeAgo(postedAt);
    const daysLeft = getDaysLeft(applicationDeadline);
    const applicants = "100+ Applied";

    const formattedSalary = salaryDuration === 'month' ? `${salary}/mo` : salary;

    if (variant === "list") {
        return (
            <Card className="group hover:bg-slate-50/50 transition-all duration-300 hover:shadow-md border-slate-200 hover:border-primary/20 p-5 flex flex-col sm:flex-row gap-5 relative bg-white">
                {/* Save Button Absolute */}
                {/* Save Button Absolute */}
                <BookmarkButton id={id} type="job" className="absolute top-4 right-4" />

                {/* Logo Section */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-slate-100 bg-white flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    {/* Placeholder for logo if image url existed */}
                    <span className="text-2xl font-bold text-slate-700">{company[0]}</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Header */}
                    <div>
                        <h3 className="font-bold text-lg sm:text-xl text-slate-900 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="font-medium text-slate-600 mt-1">
                            {company}
                        </p>
                    </div>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {experience}
                        </span>
                        <span className="w-px h-3 bg-slate-300 hidden sm:block" />
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {location}
                        </span>
                        <span className="w-px h-3 bg-slate-300 hidden sm:block" />
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {type}
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                        {tags.map((tag, i) => (
                            <span key={tag} className="flex items-center">
                                {tag}
                                {i < tags.length - 1 && <span className="mx-2 text-slate-300">•</span>}
                            </span>
                        ))}
                    </div>

                    {/* Footer / Bottom Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-dashed border-slate-200 mt-2">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                Everyone can apply
                            </span>
                            {daysLeft !== null && (
                                <span className={`flex items-center gap-1 ${daysLeft < 5 ? 'text-red-500' : 'text-slate-400'}`}>
                                    <Hourglass className="w-3 h-3" /> {daysLeft} days left
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-slate-400">
                                <Users className="w-3 h-3" /> {applicants}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-900 text-base">
                                {formattedSalary}
                            </span>
                            <div className="flex gap-2 items-center">
                                <Share2 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                                <Button size="sm" className="bg-primary hover:bg-orange-600 text-white rounded-full px-6" asChild>
                                    <Link href={`/jobs/${id}`}>Apply</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Grid View (Compact)
    return (
        <Card className={cn(
            "group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col p-5 bg-white relative overflow-hidden border",
            isFeatured ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "border-slate-200 hover:border-primary/20 hover:bg-slate-50/50"
        )}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            {/* Company Logo Background */}
            <div className="absolute top-0 right-0 w-full h-32 overflow-hidden pointer-events-none opacity-[0.03]">
                {company && <div className="text-[10rem] font-bold text-slate-900 absolute -top-10 -right-10 select-none">{company[0]}</div>}
            </div>

            {/* Save Button Absolute - Connected to Backend */}
            <BookmarkButton id={id} type={bookmarkType} />

            {isFeatured && (
                <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                    FEATURED
                </div>
            )}
            <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-xl font-bold text-slate-700 shadow-sm">
                    {company[0]}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 mt-1">
                        {company}
                    </p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3" /> {location}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {type}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Briefcase className="w-3 h-3" /> {experience}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-normal hover:bg-slate-50">
                            {tag}
                        </Badge>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-xs text-slate-400 self-center">+{tags.length - 3}</span>
                    )}
                </div>
            </div>

            <div className="border-t border-dashed border-slate-200 my-4" />

            <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                    {formattedSalary}
                </span>
                <Button size="sm" className="bg-primary hover:bg-orange-600 text-white rounded-full px-6" asChild>
                    <Link href={`/jobs/${id}`}>Apply</Link>
                </Button>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                <span>{postedDate}</span>
                {daysLeft && <span>{daysLeft} days left</span>}
            </div>
        </Card>
    );
}
