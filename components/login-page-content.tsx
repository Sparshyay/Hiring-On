"use client";

import { SignIn } from "@clerk/nextjs";

export function LoginPageContent() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignIn routing="path" path="/login" />
        </div>
    );
}
