import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 md:py-20 relative overflow-hidden">
            {/* Subtle Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7A3D] via-[#234B73] to-[#FF7A3D]"></div>

            <div className="container mx-auto px-6 md:px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 text-center md:text-left">
                    <div className="space-y-6 flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-0 bg-white/5 p-2 rounded-xl backdrop-blur-sm">
                            <Image src="/logo-full.png" alt="Hiring On" width={500} height={150} className="h-28 w-auto" />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Connecting world-class talent with global opportunities. The modern platform for ambitious job seekers and forward-thinking recruiters.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg tracking-wide">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/jobs" className="hover:text-[#FF7A3D] transition-colors">Browse Jobs</Link></li>
                            <li><Link href="/companies" className="hover:text-[#FF7A3D] transition-colors">Companies</Link></li>
                            <li><Link href="/practice" className="hover:text-[#FF7A3D] transition-colors">Practice Tests</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg tracking-wide">AI Tools</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/resume-builder" className="hover:text-[#FF7A3D] transition-colors flex items-center gap-2 justify-center md:justify-start">Resume Builder <span className="text-[10px] bg-[#FF7A3D]/20 text-[#FF7A3D] px-2 py-0.5 rounded-full font-bold border border-[#FF7A3D]/30">NEW</span></Link></li>
                            <li><span className="text-slate-600 cursor-not-allowed flex items-center gap-2 justify-center md:justify-start">Mock Interview <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Soon</span></span></li>
                            <li><span className="text-slate-600 cursor-not-allowed flex items-center gap-2 justify-center md:justify-start">Profile Analysis <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Soon</span></span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg tracking-wide">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-[#FF7A3D] transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-[#FF7A3D] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#FF7A3D] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white text-lg tracking-wide">Connect</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-[#FF7A3D] transition-colors">Twitter (X)</a></li>
                            <li><a href="#" className="hover:text-[#FF7A3D] transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-[#FF7A3D] transition-colors">Instagram</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} HIRING-ON. All rights reserved.</p>
                    <p>Designed with ❤️ for Careers.</p>
                </div>
            </div>
        </footer>
    );
}
