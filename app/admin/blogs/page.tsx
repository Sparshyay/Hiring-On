"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Save } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminBlogsPage() {
    const blogs = useQuery(api.blogs.getAllBlogs);
    const createBlog = useMutation(api.blogs.createBlog);
    const deleteBlog = useMutation(api.blogs.deleteBlog);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = async () => {
        try {
            // Both create and update are handled by createBlog mutation which we updated to accept ID
            // Or we can differentiate. The backend logic I wrote handles both if ID is passed or not.
            // But wait, the backend createBlog I wrote handled ID? Yes: id: v.optional(v.id("blogs"))

            await createBlog({
                title,
                content,
                excerpt,
                coverImage,
                tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
                id: editingId ? (editingId as any) : undefined,
            });
            setIsCreateOpen(false);
            setEditingId(null);
            setTitle("");
            setContent("");
            setExcerpt("");
            setCoverImage("");
            setTags("");
            toast.success(editingId ? "Blog updated" : "Blog created");
        } catch (error) {
            toast.error("Failed to save blog post");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBlog({ id: id as any });
            toast.success("Blog post deleted");
        } catch (error) {
            toast.error("Failed to delete blog post");
        }
    };

    const handleEdit = (blog: any) => {
        setEditingId(blog._id);
        setTitle(blog.title);
        setContent(blog.content);
        setExcerpt(blog.excerpt || "");
        setCoverImage(blog.coverImage || "");
        setTags(blog.tags.join(", "));
        setIsCreateOpen(true);
    };

    const handleCreateNew = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setExcerpt("");
        setCoverImage("");
        setTags("");
        setIsCreateOpen(true);
    }

    if (blogs === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Blogs Management</h2>
                    <p className="text-muted-foreground">Create and manage content for the platform.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreateNew}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                            <DialogDescription>
                                Add a new article to the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="coverImage" className="text-right">
                                    Cover Image
                                </Label>
                                <Input
                                    id="coverImage"
                                    placeholder="Image URL"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="excerpt" className="text-right">
                                    Excerpt
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Short summary..."
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="content" className="text-right">
                                    Content
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder="Supports Markdown/HTML"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="col-span-3 min-h-[300px] font-mono text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tags" className="text-right">
                                    Tags
                                </Label>
                                <Input
                                    id="tags"
                                    placeholder="Comma separated"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> {editingId ? "Update Post" : "Save Post"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All Blog Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {blogs.map((blog) => (
                                <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-lg">{blog.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <Badge variant="outline" className={blog.authorRole === 'admin' ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                                                {blog.authorRole === 'admin' ? 'Admin' : 'Recruiter'}
                                            </Badge>
                                            <span className="font-medium">{blog.author}</span>
                                            <span>•</span>
                                            <span>{format(blog.publishedAt, "MMM d, yyyy")}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(blog)}
                                        >
                                            <Edit className="w-4 h-4 text-slate-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {blogs.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No blog posts yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
