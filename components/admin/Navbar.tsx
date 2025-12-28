"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminNavbar() {
    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search anything..."
                        className="pl-9 bg-slate-50 border-none w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </Button>
                <div className="h-8 w-px bg-slate-200 mx-2" />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}
