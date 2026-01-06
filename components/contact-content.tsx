"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactContent() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        Get in <span className="text-primary">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Have a question or just want to say hi? We'd love to hear from you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Email Us</h4>
                                            <p className="text-slate-600">support@hiringon.com</p>
                                            <p className="text-slate-600">careers@hiringon.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Call Us</h4>
                                            <p className="text-slate-600">+91 123 456 7890</p>
                                            <p className="text-sm text-slate-500">Mon - Fri, 9am - 6pm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Visit Us</h4>
                                            <p className="text-slate-600">
                                                123 Innovation Drive, Tech Park<br />
                                                Bangalore, Karnataka 560100
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <h4 className="font-semibold text-slate-900 mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    {/* Social Icons Mock */}
                                    {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((platform) => (
                                        <button key={platform} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors">
                                            <Globe className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">First Name</label>
                                    <Input placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">Last Name</label>
                                    <Input placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Email Address</label>
                                <Input type="email" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Subject</label>
                                <Input placeholder="How can we help?" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Message</label>
                                <Textarea placeholder="Tell us more about your inquiry..." className="min-h-[150px]" />
                            </div>

                            <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                                <Send className="w-4 h-4 mr-2" /> Send Message
                            </Button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
