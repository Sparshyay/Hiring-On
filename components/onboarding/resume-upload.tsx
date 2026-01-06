"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface ResumeUploadProps {
    onParsingComplete: (data: any, fileId: string) => void;
    onCancel: () => void;
}

export function ResumeUpload({ onParsingComplete, onCancel }: ResumeUploadProps) {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const extractDetails = useAction(api.ai.extractDetailsFromResume);

    const [isUploading, setIsUploading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "success">("idle");

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        try {
            setStatus("uploading");
            setIsUploading(true);

            // 1. Get Upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload File
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();
            setStatus("parsing");
            setIsParsing(true);
            setIsUploading(false);

            // 3. Parse with AI
            const parsedData = await extractDetails({ storageId });

            setStatus("success");
            toast.success("Resume parsed successfully!");

            // 4. Callback
            onParsingComplete(parsedData, storageId);

        } catch (error) {
            console.error("Upload/Parse error:", error);
            setStatus("idle");
            toast.error("Failed to process resume. Please try again.");
        } finally {
            setIsUploading(false);
            setIsParsing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Upload Your Resume</h3>
                <p className="text-muted-foreground text-sm">
                    We'll extract your details to auto-fill your profile.
                </p>
            </div>

            <div className="w-full max-w-sm">
                {status === "idle" && (
                    <label
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 border-muted-foreground/25 hover:border-primary/50 transition-all"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="mb-2 text-sm text-gray-500 font-medium">Click to upload PDF</p>
                            <p className="text-xs text-gray-400">PDF (MAX. 5MB)</p>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                )}

                {(status === "uploading" || status === "parsing") && (
                    <div className="flex flex-col items-center justify-center w-full h-48 border rounded-xl bg-muted/10 p-6 space-y-4">
                        <div className="relative h-16 w-16">
                            <Loader2 className="h-16 w-16 animate-spin text-primary/30" />
                            <FileText className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-medium">
                                {status === "uploading" ? "Uploading..." : "Analyzing with AI..."}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {status === "uploading" ? "Sending your file to secure storage" : "Extracting skills, education & experience"}
                            </p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center justify-center w-full h-48 border border-green-200 bg-green-50 rounded-xl p-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="font-medium text-green-700">Ready to Review!</h4>
                    </div>
                )}
            </div>

            {status === "idle" && (
                <Button variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            )}
        </div>
    );
}
