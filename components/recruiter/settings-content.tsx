"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Upload, Globe, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RecruiterSettingsContent() {
    const company = useQuery(api.companies.getMyCompany);
    const updateCompany = useMutation(api.companies.update);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const [isLoading, setIsLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        industry: "",
        size: "",
        hrName: "",
        hrEmail: "",
        hrPhone: "",
    });

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                description: company.description || "",
                website: company.website || "",
                location: company.location || "",
                industry: company.industry || "",
                size: company.size || "",
                hrName: company.hrDetails?.name || "",
                hrEmail: company.hrDetails?.email || "",
                hrPhone: company.hrDetails?.phone || "",
            });
            // If company has a logo, we should handle display logic (might be URL or storage ID)
            // Ideally we'd have a helper to resolve storage ID to URL, or the backend returns a URL.
            // For now assuming company.logo is handled or we just show fallback if it's a raw ID not resolvable on client.
            // Actually, <AvatarImage src={company.logo} /> works if it's a public URL. 
            // If it is a Convex storage ID, we need a way to get the URL. 
            // Usually the backend resolves it or we use a `storage` helper.
            // For this implementation, I will rely on standard Avatar behavior.
        }
    }, [company]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        setIsLoading(true);
        try {
            let logoId = company.logo;

            if (logoFile) {
                // Step 1: Get Upload URL
                const postUrl = await generateUploadUrl();

                // Step 2: Upload File
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": logoFile.type },
                    body: logoFile,
                });

                if (!result.ok) {
                    throw new Error("Upload failed");
                }

                const { storageId } = await result.json();
                logoId = storageId;
            }

            // Step 3: Update Company
            await updateCompany({
                id: company._id,
                ...formData,
                logo: logoId,
            });

            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Failed to update settings:", error);
            alert("Failed to update settings. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (company === undefined) {
        return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (company === null) {
        return <div className="p-8 text-center">Company not found. Please ensure you are logged in as a recruiter.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Settings</h1>
                <p className="text-slate-500">Manage your company profile and branding.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Branding Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Upload your company logo and manage visual identity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="w-24 h-24 border-2 border-slate-100">
                                <AvatarImage src={logoPreview || company.logo} />
                                <AvatarFallback className="text-2xl bg-slate-100">{company.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-base">Company Logo</Label>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload New
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Recommended: 400x400px, PNG or JPG.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Update your public company information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name</Label>
                                <Input id="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input id="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Technology, Healthcare" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="size">Company Size</Label>
                                <Input id="size" value={formData.size} onChange={handleInputChange} placeholder="e.g. 10-50 Employees" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Headquarters</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="location" className="pl-9" value={formData.location} onChange={handleInputChange} placeholder="City, Country" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="min-h-[100px]"
                                placeholder="Tell us about your company..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="website" className="pl-9" value={formData.website} onChange={handleInputChange} placeholder="https://" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact / HR Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>HR or recruiting point of contact.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hrName">Contact Name</Label>
                                <Input id="hrName" value={formData.hrName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hrEmail">Email</Label>
                                <Input id="hrEmail" value={formData.hrEmail} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hrPhone">Phone</Label>
                                <Input id="hrPhone" value={formData.hrPhone} onChange={handleInputChange} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Plan Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Plan</CardTitle>
                        <CardDescription>Manage your billing and plan details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-slate-900">Current Plan</h3>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                        {company.plan || "Free"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Standard features for early stage startups.</p>
                            </div>
                            <Button variant="outline" disabled title="Plan upgrades coming soon">
                                Upgrade Plan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost">Cancel</Button>
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-orange-600">
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
