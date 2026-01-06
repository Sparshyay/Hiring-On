"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, User, Mail, ShieldAlert } from "lucide-react";

export function SettingsContent() {
    const user = useQuery(api.users.getUser);

    // Placeholder states for settings not yet in schema
    const [emailPreferences, setEmailPreferences] = useState({
        marketing: true,
        updates: true,
        jobs: true
    });

    if (user === undefined) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Update your personal account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input defaultValue={user?.name} disabled className="bg-slate-50" />
                                <p className="text-xs text-muted-foreground">To change your name, please contact support.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input defaultValue={user?.email} disabled className="bg-slate-50" />
                                <p className="text-xs text-muted-foreground">This is your primary login email.</p>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium text-destructive mb-2">Delete Account</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Permanently delete your account and all of your content. This action cannot be undone.
                                </p>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Manage your email preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                    <span>Marketing emails</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Receive emails about new products, features, and more.
                                    </span>
                                </Label>
                                <Switch
                                    id="marketing"
                                    checked={emailPreferences.marketing}
                                    onCheckedChange={(c) => setEmailPreferences(prev => ({ ...prev, marketing: c }))}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="updates" className="flex flex-col space-y-1">
                                    <span>Security updates</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Receive emails about your account security.
                                    </span>
                                </Label>
                                <Switch
                                    id="updates"
                                    checked={emailPreferences.updates}
                                    onCheckedChange={(c) => setEmailPreferences(prev => ({ ...prev, updates: c }))}
                                    disabled // enforced usually
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="jobs" className="flex flex-col space-y-1">
                                    <span>Job Recommendations</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Receive tailored job alerts based on your profile.
                                    </span>
                                </Label>
                                <Switch
                                    id="jobs"
                                    checked={emailPreferences.jobs}
                                    onCheckedChange={(c) => setEmailPreferences(prev => ({ ...prev, jobs: c }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Manage who can see your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="public-profile" className="flex flex-col space-y-1">
                                    <span>Public Profile</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Allow recruiters to find your profile in search.
                                    </span>
                                </Label>
                                <Switch id="public-profile" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
