"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useClerk, useUser } from "@clerk/nextjs";
import {
    User,
    Settings,
    LogOut,
    Briefcase,
    Bookmark,
    FileText,
    Layers,
    Users,
    LayoutDashboard,
    Building,
    BarChart,
    ChevronRight,
    LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ProfileDropdown() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const convexUser = useQuery(api.auth.getUser);

    if (!user) return null;

    const userInitials = user.fullName
        ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    const role = convexUser?.role || "candidate";

    const jobSeekerItems = [
        { label: "Profile", icon: User, href: "/profile" },
        { label: "Registrations/Applications", icon: Layers, href: "/profile/applications" },
        { label: "Watchlist", icon: Bookmark, href: "/profile/watchlist" },
        { label: "Bookmarked Questions", icon: Bookmark, href: "/profile/bookmarks" },
        { label: "Recently Viewed", icon: Briefcase, href: "/profile/recent" },
        { label: "Mentor Sessions", icon: Users, href: "/profile/mentors" },
        { label: "Courses", icon: FileText, href: "/profile/courses" },
        { label: "Certificates", icon: BarChart, href: "/profile/certificates" },
        { label: "Settings", icon: Settings, href: "/settings" },
    ];

    const recruiterItems = [
        { label: "Company Profile", icon: Building, href: "/recruiter/settings" },
        { label: "Job/Internship Posts", icon: Briefcase, href: "/recruiter/jobs" },
        { label: "Blogs", icon: FileText, href: "/recruiter/blogs" },
        { label: "Applicants", icon: Users, href: "/recruiter/candidates" },
        { label: "Settings", icon: Settings, href: "/settings" },
    ];

    const adminItems = [
        { label: "Platform Management", icon: LayoutDashboard, href: "/admin" },
        { label: "Companies", icon: Building, href: "/admin/companies" },
        { label: "Recruiters", icon: Users, href: "/admin/recruiters" },
        { label: "Jobs", icon: Briefcase, href: "/admin/jobs" },
        { label: "Blogs", icon: FileText, href: "/admin/blogs" },
        { label: "Analytics", icon: BarChart, href: "/admin/analytics" },
    ];

    let menuItems = jobSeekerItems;
    let label = "User";

    if (role === "recruiter") {
        menuItems = recruiterItems;
        label = "Recruiter Dashboard";
    } else if (role === "admin") {
        menuItems = adminItems;
        label = "Admin Controls";
    }

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
                </div>

                <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* User Profile Section */}
                    <div className="p-6 pb-2">
                        <div className="flex items-start gap-4">
                            <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-slate-100">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user.imageUrl} />
                                    <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                                <h3 className="font-bold text-lg truncate leading-tight flex items-center gap-2">
                                    {user.fullName}
                                    {/* Removed Verification Badge from name, user asked to remove username and show email to be verified */}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-slate-500 truncate mb-1">{user.primaryEmailAddress?.emailAddress}</p>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">Verified</span>
                                    {/* Assuming verified for now as Clerk handles this usually */}
                                </div>
                                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{role.replace("_", " ")}</span>
                            </div>
                        </div>

                        {role === "candidate" && (
                            <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 relative overflow-hidden">
                                <div className="flex-1 relative z-10">
                                    <h4 className="font-bold text-slate-900 text-sm">Complete your profile</h4>
                                    <p className="text-xs text-slate-600 mb-2">Get discovered by top recruiters!</p>
                                    <Link href="/profile/edit" className="text-blue-600 text-xs font-bold flex items-center hover:underline">
                                        Edit Profile <ChevronRight className="w-3 h-3 ml-0.5" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Menu Items */}
                    <div className="py-2">
                        <DropdownMenuLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-6">{label}</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            {menuItems.map((item, idx) => (
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
                                onClick={() => signOut({ redirectUrl: "/" })}
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
