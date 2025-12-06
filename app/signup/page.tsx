"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignUp routing="path" path="/signup" />
        </div>
    );
}
