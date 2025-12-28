"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Image as ImageIcon, Trash2, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data for Ads/Banners
const MOCK_ADS = [
    { id: 1, title: "Summer Internship Promo", type: "Hero Banner", views: 1200, clicks: 85, status: true, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" },
    { id: 2, title: "Sidebar: Top Companies", type: "Sidebar Widget", views: 4500, clicks: 320, status: true, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop" },
    { id: 3, title: "Featured Course Bundle", type: "Home Feed", views: 800, clicks: 40, status: false, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop" },
];

export default function AdminAdsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ads & Banners</h2>
                    <p className="text-muted-foreground">Manage promotional content and banners across the platform.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Ad
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_ADS.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                        <div className="h-40 bg-slate-100 relative">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            <Badge className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-md border-0">
                                {ad.type}
                            </Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{ad.title}</CardTitle>
                                <Switch checked={ad.status} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm text-slate-500 mb-4">
                                <span>{ad.views.toLocaleString()} Views</span>
                                <span>{ad.clicks.toLocaleString()} Clicks</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="w-full">Edit</Button>
                                <Button variant="destructive" size="icon" className="shrink-0 h-9 w-9">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
