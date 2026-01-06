import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
            <p className="text-slate-600 mb-8">The page you are looking for does not exist.</p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    );
}
