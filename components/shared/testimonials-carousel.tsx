"use client";

import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Software Engineer at Google",
        content: "I recently had the pleasure of using this platform, and I must say that I am thoroughly impressed. The level of professionalism turned me into a fan.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Product Manager at Microsoft",
        content: "The platform made my job search incredibly easy. Within weeks, I landed my dream job! The personalized recommendations were spot on.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        id: 3,
        name: "Ananya Patel",
        role: "UX Designer at Adobe",
        content: "As a designer, I appreciate good UX, and this platform delivers! The interface is intuitive, and the entire experience feels premium.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    },
    {
        id: 4,
        name: "Arjun Reddy",
        role: "Data Scientist at Amazon",
        content: "Finding the right internship was challenging until I discovered this platform. The process helped me secure an amazing opportunity.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: 5,
        name: "Sneha Iyer",
        role: "Marketing Lead at Flipkart",
        content: "This platform stands out from the rest. The quality of companies and the responsive support team make it the best choice.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    }
];

export function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Visible count based on screen size (mock logic, for now hardcoded to move 1 by 1 but show grid)
    // Actually for a carousel, let's keep it simple: Show 1 on mobile, 3 on desktop.
    // We need to manage the "window" of visible items.

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
        setIsAutoPlaying(false);
    };

    // Calculate visible testimonials (3 cards looping)
    const getVisibleTestimonials = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(TESTIMONIALS[(currentIndex + i) % TESTIMONIALS.length]);
        }
        return items;
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                        >
                            Trusted by <span className="text-blue-600">Students</span> <br />
                            & <span className="text-orange-500">Professionals</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-600 max-w-xl"
                        >
                            Join thousands of users who are accelerating their careers with us.
                        </motion.p>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={prevSlide} variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 hover:bg-slate-50 hover:text-primary">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button onClick={nextSlide} variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 hover:bg-slate-50 hover:text-primary">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {getVisibleTestimonials().map((testimonial, idx) => (
                                <motion.div
                                    key={`${testimonial.id}-${idx}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    className={cn("h-full", idx === 1 ? "md:-mt-4 md:mb-4" : "")} // Staggered effect
                                >
                                    <Card className="p-8 h-full rounded-2xl border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white flex flex-col">
                                        <Quote className="w-10 h-10 text-blue-100 mb-6 fill-blue-100" />

                                        <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
                                            "{testimonial.content}"
                                        </p>

                                        <div className="flex items-center gap-4 mt-auto">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{testimonial.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 mt-4 border-t border-slate-50 pt-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
