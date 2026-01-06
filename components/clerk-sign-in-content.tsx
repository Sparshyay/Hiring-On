import { SignIn } from "@clerk/nextjs";

export function ClerkSignInContent() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignIn forceRedirectUrl="/" />
        </div>
    );
}
