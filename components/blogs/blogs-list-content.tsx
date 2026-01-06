"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

export function BlogsListContent() {
    const blogs = useQuery(api.blogs.getAllBlogs);

    if (blogs === undefined) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    const HERO_POST = blogs[0];
    const SIDE_POSTS = blogs.slice(1, 4);
    const PAST_POSTS = blogs.slice(4);

    if (!HERO_POST) { // No blogs at all
        return (
            <div className="container mx-auto px-4 py-20 text-center text-slate-500">
                <h2 className="text-2xl font-bold">No blogs published yet.</h2>
                <p>Check back later for insights!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                    Latest Insights
                </h1>
                <p className="text-lg text-slate-600">
                    Discover the latest trends, expert advice, and success stories from our team.
                </p>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Hero Card */}
                <Link href={`/blogs/${HERO_POST.slug}`} className="block relative rounded-3xl overflow-hidden group shadow-lg h-[500px]">
                    <img
                        src={HERO_POST.coverImage || "https://images.unsplash.com/photo-1499750310159-52f8f6f324e1?q=80&w=2574"}
                        alt={HERO_POST.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 text-white space-y-4">
                        <div className="flex gap-2">
                            {HERO_POST.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight max-w-lg group-hover:underline decoration-2 underline-offset-4">
                            {HERO_POST.title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <span>{new Date(HERO_POST.publishedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>By {HERO_POST.author}</span>
                        </div>
                    </div>
                </Link>

                {/* Side Stack */}
                <div className="flex flex-col gap-6">
                    {SIDE_POSTS.map((post) => (
                        <Link href={`/blogs/${post.slug}`} key={post._id} className="flex gap-4 group cursor-pointer">
                            <div className="w-1/3 h-32 rounded-xl overflow-hidden shrink-0 relative">
                                <img
                                    src={post.coverImage || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2670"}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-5 bg-slate-100 text-slate-600">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h3 className="font-bold text-lg leading-snug text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {new Date(post.publishedAt).toLocaleDateString()} • {post.author}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Past Posts Grid */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-900">More from the Past</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PAST_POSTS.map((post) => (
                        <Link href={`/blogs/${post.slug}`} key={post._id} className="group cursor-pointer space-y-3">
                            <div className="rounded-2xl overflow-hidden aspect-video relative shadow-sm">
                                <img
                                    src={post.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574"}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {post.tags.map(tag => (
                                        <Badge key={tag} className="bg-white text-slate-800 hover:bg-white shadow-sm font-normal text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{post.author}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center pt-8">
                    <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700">
                        Load More Post
                    </Button>
                </div>
            </div>

        </div>
    );
}
