"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"; // If needed, though dropdowns usually shouldn't scroll internally if possible, but list is long.
import { useClerk, useUser } from "@clerk/nextjs";
import {
    User,
    Settings,
    LogOut,
    Briefcase,
    Bookmark,
    Clock,
    Award,
    FileText,
    Layers,
    Users,
    Video,
    BookOpen,
    LifeBuoy,
    ChevronRight,
    LayoutDashboard,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    if (!user) return null;

    const userInitials = user.fullName
        ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-slate-200 p-0 hover:bg-transparent overflow-hidden">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <span className="text-xl font-bold">Profile</span>
                    {/* Close button visualization only, functionality isn't standard in DropdownMenu without controlled state overriding outside click */}
                    {/* We will omit the 'X' for now as Dropdown behaves differently, clicking outside closes it. */}
                </div>

                <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* User Profile Section */}
                    <div className="p-6 pb-2">
                        <div className="flex items-start gap-4">
                            {/* Circular Progress Avatar Placeholder */}
                            <div className="relative w-20 h-20 shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="40" cy="40" r="36" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                                    <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="6" fill="transparent" strokeDasharray="226.19" strokeDashoffset="56.5" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-sm">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={user.imageUrl} />
                                        <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded-full text-[10px] font-bold text-blue-600 border border-slate-200">
                                    75%
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg truncate leading-tight">{user.fullName}</h3>
                                <p className="text-sm text-slate-500 truncate mb-1">{user.primaryEmailAddress?.emailAddress}</p>
                                <Link href="/profile/edit" className="text-blue-600 font-semibold text-sm flex items-center hover:underline">
                                    Edit Profile <ChevronRight className="w-4 h-4 ml-0.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 relative overflow-hidden">
                            <div className="flex-1 relative z-10">
                                <h4 className="font-bold text-slate-900 text-sm">You're missing out</h4>
                                <p className="text-xs text-slate-600 mb-2">on opportunities to create an impact!</p>
                                <Link href="/profile" className="text-blue-600 text-xs font-bold flex items-center hover:underline">
                                    Complete my profile <ChevronRight className="w-3 h-3 ml-0.5" />
                                </Link>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-20px] opacity-10 text-orange-600">
                                <AlertCircle className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 flex items-center justify-center w-10 text-orange-300">
                                <AlertCircle className="w-10 h-10 opacity-50" />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Menu Items */}
                    <div className="py-2">
                        <DropdownMenuLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-6">For Users</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            {[
                                { label: "Registrations/Applications", icon: User, href: "/profile" },
                                { label: "My Jobs & Internships", icon: Briefcase, href: "/profile" },
                                { label: "My Opportunities", icon: Layers, href: "/profile" },
                                { label: "Referrals", icon: Users, href: "/profile" },
                                { label: "My Rounds", icon: LayoutDashboard, href: "/profile" }, // approximated
                                { label: "Watchlist", icon: LayoutDashboard, href: "/profile" }, // approximated icon as Heart usually
                                { label: "Bookmarked Questions", icon: Bookmark, href: "/profile" },
                                { label: "Recently Viewed", icon: Clock, href: "/profile" },
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} className="w-full">
                                    <DropdownMenuItem className="px-6 py-3 cursor-pointer">
                                        <item.icon className="w-5 h-5 mr-3 text-slate-500" />
                                        <span className="text-slate-700 font-medium text-sm">{item.label}</span>
                                    </DropdownMenuItem>
                                </Link>
                            ))}
                        </DropdownMenuGroup>
                    </div>

                    <Separator />

                    <div className="py-2">
                        <DropdownMenuGroup>
                            <Link href="/profile">
                                <DropdownMenuItem className="px-6 py-3 cursor-pointer">
                                    <Settings className="w-5 h-5 mr-3 text-slate-500" />
                                    <span className="text-slate-700 font-medium text-sm">Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/">
                                <DropdownMenuItem className="px-6 py-3 cursor-pointer">
                                    <Award className="w-5 h-5 mr-3 text-slate-500" />
                                    <span className="text-slate-700 font-medium text-sm">Pro Subscription</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                    </div>

                    <Separator />

                    {/* Footerish items */}
                    <div className="py-2 pb-4">
                        <Link href="/contact">
                            <DropdownMenuItem className="px-6 py-3 cursor-pointer">
                                <LifeBuoy className="w-5 h-5 mr-3 text-slate-500" />
                                <span className="text-slate-700 font-medium text-sm">Contact Us</span>
                            </DropdownMenuItem>
                        </Link>

                        <div className="px-6 mt-2">
                            <Button
                                variant="outline"
                                className="w-full rounded-full border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                onClick={() => signOut(() => router.push("/"))}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
