"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Facebook, Linkedin, Twitter, Link as LinkIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

export function BlogDetailsContent() {
    const params = useParams();
    const slug = params?.slug as string;

    const blog = useQuery(api.blogs.getBySlug, slug ? { slug } : "skip");

    if (blog === undefined) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!blog) {
        return <div className="p-20 text-center text-slate-500">Post not found</div>;
    }

    // Extract headings for Table of Contents (Supports both Markdown and HTML, H1-H6)
    const headings = [
        ...(blog.content.match(/^#{1,6}\s+(.*)$/gm)?.map(h => h.replace(/^#{1,6}\s+/, "").trim()) || []),
        ...(blog.content.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/gi)?.map(h => h.replace(/<\/?h[1-6].*?>/gi, "").trim()) || [])
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-slate-900">
                {blog.coverImage ? (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-80" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map(tag => (
                                <Badge key={tag} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-0">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-10 h-10 border-2 border-white">
                                    <AvatarImage src={blog.authorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} />
                                    <AvatarFallback>{blog.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-semibold">{blog.author}</p>
                                    <p className="text-white/70">{blog.authorRole === 'admin' ? 'Admin' : 'Recruiter'}</p>
                                </div>
                            </div>
                            <span className="text-white/50">•</span>
                            <span>{format(blog.publishedAt, "MMM d, yyyy")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / TOC */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 space-y-8">
                            {headings.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-4">Table of Contents</h3>
                                    <ul className="space-y-3 text-sm border-l-2 border-slate-100 pl-4">
                                        {headings.map((heading, idx) => (
                                            <li key={idx}>
                                                <span className="text-slate-500 block py-1 cursor-default">
                                                    {heading}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold text-slate-900 mb-4">Share this</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                        <Facebook className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Article */}
                    <div className="col-span-1 lg:col-span-8 lg:col-start-4">
                        <div className="prose prose-lg max-w-none text-slate-600 prose-headings:text-slate-900 prose-headings:font-bold prose-img:rounded-xl">
                            {blog.excerpt && (
                                <p className="lead text-xl text-slate-900 font-medium mb-8">
                                    {blog.excerpt}
                                </p>
                            )}
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
