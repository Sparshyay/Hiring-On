"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus } from "lucide-react";

export function TestsContent() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Test Management</h1>
                    <p className="text-muted-foreground">Create and manage practice assessments.</p>
                </div>
                <Button className="bg-primary hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create New Test
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Create New Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Test Title</Label>
                                <Input placeholder="e.g. Advanced React Patterns" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="coding">Coding</SelectItem>
                                        <SelectItem value="aptitude">Aptitude</SelectItem>
                                        <SelectItem value="interview">Mock Interview</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Describe the test..." className="min-h-[100px]" />
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Duration (mins)</Label>
                                <Input type="number" placeholder="60" />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Questions</Label>
                                <Input type="number" placeholder="20" />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                                <p className="font-medium text-slate-900">Upload Questions CSV</p>
                                <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to upload</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline">Cancel</Button>
                            <Button className="bg-primary hover:bg-orange-600 text-white">Save & Publish</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Total Tests</span>
                                <span className="font-bold text-xl">45</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Active Users</span>
                                <span className="font-bold text-xl">1.2k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Avg. Score</span>
                                <span className="font-bold text-xl text-green-400">76%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
