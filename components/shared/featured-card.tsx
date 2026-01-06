import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeaturedCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
    postedTime?: string;
    logo?: string;
    variant?: "internship" | "job";
    logoColor?: string;
    bannerColor?: string;
}

export function FeaturedCard({
    id,
    title,
    company,
    location,
    type,
    salary,
    postedTime = "2 days ago",
    logo,
    variant = "job",
    logoColor = "bg-blue-500",
    bannerColor = "from-blue-500 to-blue-600"
}: FeaturedCardProps) {
    const href = variant === "internship" ? `/internships/${id}` : `/jobs/${id}`;

    return (
        <Link href={href} className="h-full block">
            <Card className="group relative overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl h-full min-h-[280px] flex flex-col">
                {/* Colored Banner */}
                <div className={cn("h-16 bg-gradient-to-r", bannerColor)} />

                {/* Content */}
                <div className="flex-1 p-5 pt-0 flex flex-col">
                    {/* Logo and Save Button */}
                    <div className="flex items-start justify-between -mt-6 mb-3">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md",
                            logoColor
                        )}>
                            {logo || company[0]}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 h-7 px-2 rounded-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Bookmark className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Company and Title */}
                    <div className="mb-3 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 text-sm">{company}</h4>
                            <span className="text-xs text-slate-400">{postedTime}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {title}
                        </h3>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium px-2 py-0.5 rounded-md text-xs">
                            {type}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium px-2 py-0.5 rounded-md text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location}
                        </Badge>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-sm font-bold text-slate-900">{salary}</div>
                        <Button
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 h-8 text-xs font-medium"
                            onClick={(e) => {
                                e.preventDefault();
                                // Let the Link handle navigation
                            }}
                        >
                            Apply now
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
