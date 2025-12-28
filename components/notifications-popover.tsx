"use client";

import { useState } from "react";
import { Bell, Check, Info, BellRing } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NotificationsPopover() {
    const notifications = useQuery(api.notifications.list);
    const markAsRead = useMutation(api.notifications.markAsRead);
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const handleMarkAsRead = async (id: any, link?: string) => {
        await markAsRead({ notificationId: id });
        if (link) {
            setOpen(false);
            router.push(link);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="h-auto px-2 text-xs text-primary"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications === undefined ? (
                        <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <BellRing className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={cn(
                                        "flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors text-left",
                                        !notif.isRead && "bg-blue-50/50"
                                    )}
                                    onClick={() => handleMarkAsRead(notif._id, notif.link)}
                                >
                                    <div className="mt-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600" style={{ opacity: notif.isRead ? 0 : 1 }} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={cn("text-sm", !notif.isRead && "font-medium text-slate-900", notif.isRead && "text-muted-foreground")}>
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
