"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, Globe, MapPin, Mail, LogOut } from "lucide-react";
import { toast } from "sonner";
import { SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";

const companySchema = z.object({
    name: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email address"),
    website: z.string().optional().or(z.literal("")),
    location: z.string().min(2, "Location is required"),
    description: z.string().min(10, "Please provide a brief description"),
});

export default function OnboardingPage() {
    const router = useRouter();
    const completeOnboarding = useMutation(api.recruiters.completeOnboarding);
    const { user: rawUser, isRecruiter } = useUserRole();
    const user = rawUser as any;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-forward if user already has a company logic
    // We check if user.companyId is present.
    // REMOVED legacy redirect to plans. 
    // New flow: if companyId exists, layout handles redirect to pending/dashboard.
    // If we are here, we are filling details.

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            email: "",
            website: "",
            location: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof companySchema>) {
        setIsSubmitting(true);
        try {
            await completeOnboarding({
                name: values.name,
                email: values.email,
                website: values.website || undefined,
                location: values.location,
                description: values.description,
            });

            // Redirect to pending page directly
            router.push("/recruiter/pending");
        } catch (error) {
            console.error("Failed to create company:", error);
            toast.error("Failed to create company. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative">
            <div className="absolute top-4 right-4">
                <SignOutButton>
                    <Button variant="outline" className="text-muted-foreground hover:text-destructive gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </SignOutButton>
            </div>

            <Card className="w-full max-w-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">
                        Setup Your Company
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Tell us about your organization to start hiring top talent.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" className="pl-9" placeholder="Acme Corp" {...register("name")} />
                                </div>
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Official Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" className="pl-9" placeholder="careers@acme.com" {...register("email")} />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="website" className="pl-9" placeholder="https://acme.com" {...register("website")} />
                                </div>
                                {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Headquarters</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="location" className="pl-9" placeholder="San Francisco, CA" {...register("location")} />
                                </div>
                                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">About Company</Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe your company culture and mission..."
                                className="min-h-[100px] resize-none"
                                {...register("description")}
                            />
                            <p className="text-xs text-muted-foreground">This will be displayed on your company profile.</p>
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Submit for Verification"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
