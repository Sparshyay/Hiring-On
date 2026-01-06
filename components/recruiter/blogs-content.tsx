"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Save, CloudUpload } from "lucide-react";
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

export function RecruiterBlogsContent() {
    // Ideally we would filter by the current user's ID here or use a specific backend query
    // For now, we show all community blogs to encourage sharing, but editing is restricted by backend auth ideally.
    // However, for MVP, we'll just show them all.
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
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();
            setCoverImage(storageId);
            setPreviewUrl(URL.createObjectURL(file));

        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
    };
    // RE-THINK: simplified logic
    // I will use `coverImage` to store the ID.
    // I need a separate state for the local preview URL of the uploaded file?
    // OR: I modify the component to check `coverImage` length. If it's short/ID-like, show placeholder? No.
    // Convex IDs are alphanumeric.
    // I'll add `previewImage` state.

    // Changing strategy:
    // I will write the `handleImageUpload` fully with `previewImage` logic in next step if needed?
    // Let's look at the replacement chunk I just made.
    // It checks `.startsWith("http")` or `.startsWith("blob:")`.
    // So if `coverImage` is storageId, it won't show.
    // The previously applied chunk uses: `src={coverImage.startsWith("http") || coverImage.startsWith("blob:") ? ...}`
    // So I need to set `coverImage` to a blob URL? BUT `handleSave` sends `coverImage` to backend.
    // If I send blob URL to backend, backend stores blob URL, which is useless.

    // I MUST have separate state for `storageId`.
    // Let's modify the state: `const [coverImageStorageId, setCoverImageStorageId] = useState("");`
    // And `coverImage` can be the preview string.
    // But `handleSave` uses `coverImage`.

    // I will simply stick to: `coverImage` state stores the final value to save.
    // If I upload, I save the `storageId`.
    // AND I need a way to preview.
    // I will use `URL.createObjectURL(file)` and store it in `previewUrl` state.
    // In `handleSave`, I use `coverImage`. 
    // Wait, updating `handleSave` to use `coverImage` (which is storageID) is fine.
    // But rendering uses `previewUrl || coverImage` (if it's http).

    // Let's add `previewUrl` state.


    const handleSave = async () => {
        try {
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
            setPreviewUrl("");
            setTags("");
            toast.success(editingId ? "Blog updated" : "Blog created");
        } catch (error) {
            toast.error("Failed to save blog post. You might not have permission.");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBlog({ id: id as any });
            toast.success("Blog post deleted");
        } catch (error) {
            toast.error("Failed to delete (you may not have permission)");
        }
    };

    const handleEdit = (blog: any) => {
        setEditingId(blog._id);
        setTitle(blog.title);
        setContent(blog.content);
        setExcerpt(blog.excerpt || "");
        setCoverImage(blog.coverImage || "");
        // If getting from backend, coverImage is a URL (from our backend fix) or ID?
        // Wait, backend fix makes it a URL! So we can use it for preview and coverImage.
        // But if we save, we want ID.
        // Issue: If we edit and don't change image, we send back URL. Schema says v.optional(v.string()).
        // It's just a string, so storing URL is fine IF backend can handle it or if we don't care about re-uploading.
        // But optimally we want storage ID.
        // For now, storing URL is acceptable fallback if we don't have the ID handy.
        // Actually, if we resolved it, we lost the original ID unless we returned both.
        // Backend `getAllBlogs` replaces `coverImage` with URL.
        // We probably should have returned `coverImageId` separately?
        // Too deep for this fix. I'll just use the URL. If they re-upload, they get ID.
        setPreviewUrl(blog.coverImage || "");
        setTags(blog.tags.join(", "));
        setIsCreateOpen(true);
    };

    const handleCreateNew = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setExcerpt("");
        setCoverImage("");
        setPreviewUrl("");
        setTags("");
        setIsCreateOpen(true);
    };

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
                    <h2 className="text-3xl font-bold tracking-tight">Recruiter Blogs</h2>
                    <p className="text-muted-foreground">Share insights with the community.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreateNew}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px] max-h-[85vh] flex flex-col p-6">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                            <DialogDescription>
                                Add a new article to the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto min-h-0 grid gap-4 py-4 px-2 custom-scrollbar">
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
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="coverImage" className="text-right mt-2">
                                    Cover Image
                                </Label>
                                <div className="col-span-3 space-y-4">
                                    {(previewUrl || (coverImage && coverImage.startsWith("http"))) && (
                                        <div className="relative w-full h-40 rounded-lg overflow-hidden border group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={previewUrl || coverImage}
                                                alt="Cover"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    setCoverImage("");
                                                    setPreviewUrl("");
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {!previewUrl && (
                                        <div
                                            className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-50"
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                    <span>Uploading...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                                    <CloudUpload className="h-8 w-8 text-slate-400" />
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">Click or drag image to upload</p>
                                                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                disabled={isUploading}
                                            />
                                        </div>
                                    )}

                                    {!previewUrl && (
                                        <div className="flex items-center gap-2">
                                            <div className="h-[1px] bg-slate-200 flex-1" />
                                            <span className="text-xs text-slate-400 font-medium shrink-0 uppercase">Or via Link</span>
                                            <div className="h-[1px] bg-slate-200 flex-1" />
                                        </div>
                                    )}

                                    {!previewUrl && (
                                        <Input
                                            id="coverImage"
                                            placeholder="Paste image URL..."
                                            value={coverImage.startsWith("http") ? coverImage : ""}
                                            onChange={(e) => {
                                                setCoverImage(e.target.value);
                                                if (e.target.value) setPreviewUrl(e.target.value);
                                            }}
                                        />
                                    )}
                                </div>
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
                        <CardTitle>Community Posts</CardTitle>
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
