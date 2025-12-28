"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { useCreateCompany } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

const plans = [
    { name: "Free", price: "$0", features: ["1 Job Post", "Basic Analytics", "Community Support"] },
    { name: "Pro", price: "$49", features: ["10 Job Posts", "Advanced Analytics", "Priority Support", "AI Shortlisting"] },
    { name: "Enterprise", price: "$199", features: ["Unlimited Jobs", "Dedicated Account Manager", "API Access", "Custom Branding"] },
];

export default function HostSignupPage() {
    const router = useRouter();
    const createCompany = useCreateCompany();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        description: "",
        location: "",
        website: "",
        plan: "Starter",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // @ts-ignore
            await createCompany({
                ...formData,
                logo: "https://github.com/shadcn.png", // Default logo
            });
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep(4); // Success step
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {step === 1 ? "Create Employer Account" :
                            step === 2 ? "Select a Plan" :
                                step === 3 ? "Payment Details" : "Verification Pending"}
                    </h1>
                    <p className="text-muted-foreground">
                        {step === 4 ? "Your account is under review." : "Join thousands of companies hiring with HIRING-ON."}
                    </p>
                </div>

                {/* Steps Indicator */}
                {step < 4 && (
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${step >= i ? "bg-primary" : "bg-slate-200"}`} />
                        ))}
                    </div>
                )}

                <Card className="border-slate-200 shadow-xl">
                    <CardContent className="p-8">
                        {step === 1 && (
                            <form onSubmit={handleNext} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Company Name</Label>
                                        <Input id="name" required value={formData.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input id="email" type="email" required value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input id="website" required value={formData.website} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" required value={formData.location} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" required value={formData.description} onChange={handleInputChange} />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white">Next: Select Plan</Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Starter Plan - Enabled */}
                                    <div
                                        className={`relative border rounded-3xl p-8 cursor-pointer transition-all bg-white hover:shadow-xl ${formData.plan === "Starter" ? "ring-2 ring-slate-900 border-transparent shadow-xl" : "border-slate-200"}`}
                                        onClick={() => setFormData({ ...formData, plan: "Starter" })}
                                    >
                                        <h3 className="font-medium text-lg text-slate-900">Starter Plan</h3>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-5xl font-bold tracking-tight text-slate-900">₹0</span>
                                            <span className="text-lg text-muted-foreground">/month</span>
                                        </div>
                                        <p className="mt-4 text-muted-foreground">For new companies just starting to hire.</p>

                                        <div className="mt-8">
                                            <Button
                                                className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white h-12 flex items-center justify-between px-6 group"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, plan: "Starter" });
                                                    setStep(3);
                                                }}
                                            >
                                                Select Plan
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <p className="font-medium text-sm">Features included:</p>
                                            <ul className="space-y-3 text-sm text-muted-foreground">
                                                {["1 Active Job Post", "Basic Analytics", "Community Support", "72 hour review time"].map((f) => (
                                                    <li key={f} className="flex items-start gap-3">
                                                        <span className="text-orange-500 font-bold mt-0.5">✶</span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Pro Plan - Disabled */}
                                    <div className="relative border rounded-3xl p-8 opacity-60 bg-slate-50 cursor-not-allowed border-slate-200">
                                        <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                                            Coming Soon
                                        </div>
                                        <h3 className="font-medium text-lg text-slate-900">Pro Plan</h3>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-5xl font-bold tracking-tight text-slate-900">₹4,999</span>
                                            <span className="text-lg text-muted-foreground">/month</span>
                                        </div>
                                        <p className="mt-4 text-muted-foreground">For growing teams hiring frequently.</p>

                                        <div className="mt-8">
                                            <Button disabled className="w-full rounded-full bg-slate-200 text-slate-400 h-12 flex items-center justify-between px-6">
                                                Select Plan
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <p className="font-medium text-sm">Features included:</p>
                                            <ul className="space-y-3 text-sm text-muted-foreground">
                                                {["10 Active Job Posts", "Advanced Analytics", "Priority Email Support", "AI Resume Shortlisting"].map((f) => (
                                                    <li key={f} className="flex items-start gap-3">
                                                        <span className="text-slate-400 font-bold mt-0.5">✶</span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Enterprise plans are currently invite-only.</p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 text-center">
                                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                    <p className="font-medium">No Payment Required</p>
                                    <p className="text-sm text-muted-foreground">The Starter plan is completely free.</p>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 text-green-800 rounded-lg">
                                    <span className="font-bold">Selected Plan: {formData.plan}</span>
                                    <span>₹0/mo</span>
                                </div>
                                <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-orange-600 text-white" disabled={isLoading}>
                                    {isLoading ? "Setting up Dashboard..." : "Complete Signup"}
                                </Button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Welcome Aboard!</h2>
                                    <p className="text-muted-foreground mt-2">
                                        Your company account has been created successfully.
                                        You now have full access to the recruiter dashboard.
                                    </p>
                                </div>
                                <Button className="w-full bg-primary hover:bg-orange-600 text-white" onClick={() => router.push("/recruiter")}>
                                    Go to Recruiter Dashboard
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
