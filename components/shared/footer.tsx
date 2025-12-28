import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-white border-t py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-0">
                            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="h-24 w-24" />
                            <Image src="/hiring-on.svg" alt="HIRING-ON" width={300} height={100} className="h-28 w-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Connecting talent with opportunity. The modern platform for job seekers and recruiters.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
                            <li><Link href="/companies" className="hover:text-primary">Companies</Link></li>
                            <li><Link href="/practice" className="hover:text-primary">Practice Tests</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Connect</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Twitter</a></li>
                            <li><a href="#" className="hover:text-primary">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary">Instagram</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} HIRING-ON. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
