import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bookmark, Clock } from "lucide-react";
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
    logoColor = "bg-blue-500"
}: FeaturedCardProps) {
    return (
        <Card className="group relative overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl p-6">
            {/* Header with Logo and Save Button */}
            <div className="flex items-start justify-between mb-6">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md",
                    logoColor
                )}>
                    {logo || company[0]}
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 h-8 px-3 rounded-lg">
                    <Bookmark className="w-4 h-4 mr-1" />
                    Save
                </Button>
            </div>

            {/* Company and Title */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">{company}</h4>
                    <span className="text-xs text-slate-400">{postedTime}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium px-3 py-1 rounded-lg">
                    {type}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium px-3 py-1 rounded-lg">
                    {location}
                </Badge>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                    <div className="text-sm font-bold text-slate-900">{salary}</div>
                    <div className="text-xs text-slate-500">Bangalore, India</div>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-10 font-medium">
                    Apply now
                </Button>
            </div>
        </Card>
    );
}
