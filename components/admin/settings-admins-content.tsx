"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SettingsAdminsContent() {
    const admins = useQuery(api.admins.getAllAdmins);
    const addAdmin = useMutation(api.admins.addAdmin);
    const removeAdmin = useMutation(api.admins.removeAdmin);
    const user = useQuery(api.auth.getUser);

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await addAdmin({ email });
            toast.success("Admin added successfully");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to add admin");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAdmin = async (id: string) => {
        if (!confirm("Are you sure you want to remove this admin?")) return;
        try {
            await removeAdmin({ id: id as any });
            toast.success("Admin access revoked");
        } catch (error) {
            toast.error("Failed to remove admin");
        }
    };

    if (admins === undefined) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Admins</h2>
                <p className="text-muted-foreground">Grant or revoke administrative access.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Admin</CardTitle>
                        <CardDescription>Enter the email address of a registered user to grant them admin access.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddAdmin} className="flex gap-2">
                            <Input
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                <span className="ml-2">Add</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Admins</CardTitle>
                        <CardDescription>{admins.length} active administrators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin._id}>
                                        <TableCell className="flex items-center gap-2 font-medium">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={admin.image} />
                                                <AvatarFallback>{admin.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>{admin.name}</span>
                                                <span className="text-xs text-muted-foreground">{admin.email}</span>
                                            </div>
                                            {admin._id === user?._id && (
                                                <ShieldCheck className="w-4 h-4 text-green-600 ml-2" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {admin._id !== user?._id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleRemoveAdmin(admin._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
