"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Software Engineer at Google",
        content: "I recently had the pleasure of using this platform, and I must say that I am thoroughly impressed. The level of professionalism and attention to detail that was put into connecting me with the right opportunities was truly exceptional. Thank you very much!",
        rating: 5
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Product Manager at Microsoft",
        content: "The platform made my job search incredibly easy. Within weeks, I landed my dream job! The quality of opportunities and the seamless application process exceeded all my expectations. Highly recommended!",
        rating: 5
    },
    {
        id: 3,
        name: "Ananya Patel",
        role: "UX Designer at Adobe",
        content: "As a designer, I appreciate good UX, and this platform delivers! The interface is intuitive, the job recommendations are spot-on, and the entire experience feels premium. It's a game-changer for job seekers.",
        rating: 5
    },
    {
        id: 4,
        name: "Arjun Reddy",
        role: "Data Scientist at Amazon",
        content: "Finding the right internship was challenging until I discovered this platform. The personalized recommendations and easy application process helped me secure an amazing opportunity. Grateful for this service!",
        rating: 5
    },
    {
        id: 5,
        name: "Sneha Iyer",
        role: "Marketing Lead at Flipkart",
        content: "This platform stands out from the rest. The quality of companies, the transparency in job descriptions, and the responsive support team make it the best choice for serious job seekers. Five stars!",
        rating: 5
    }
];

export function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500"></div>
                            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Testimonials</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500"></div>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Users Say</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join thousands of satisfied users who found their dream opportunities
                    </p>
                </div>

                {/* Carousel */}
                <div className="max-w-4xl mx-auto relative">
                    <div className="relative">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={cn(
                                    "transition-all duration-500 ease-in-out",
                                    index === currentIndex ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                                )}
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setIsAutoPlaying(true)}
                            >
                                <Card className="bg-gradient-to-br from-orange-50 via-slate-50 to-blue-50 border-none shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -translate-x-16 -translate-y-16" />
                                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full translate-x-20 translate-y-20" />

                                    {/* Stars */}
                                    <div className="flex justify-center mb-8 relative z-10">
                                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-full px-6 py-3 flex gap-2 shadow-lg">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center relative z-10">
                                        <p className="text-slate-800 text-lg md:text-xl leading-relaxed mb-8 font-medium max-w-3xl mx-auto">
                                            {testimonial.content.split('. ').map((sentence, i) => {
                                                const isHighlight = sentence.toUpperCase() === sentence;
                                                return (
                                                    <span key={i} className={isHighlight ? "font-bold text-slate-900" : ""}>
                                                        {sentence}{i < testimonial.content.split('. ').length - 1 ? '. ' : ''}
                                                    </span>
                                                );
                                            })}
                                        </p>

                                        {/* Author */}
                                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-100 rounded-2xl py-4 px-6 inline-block shadow-lg">
                                            <p className="font-bold text-lg">-{testimonial.name}</p>
                                            <p className="text-sm text-slate-300">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                className={cn(
                                    "transition-all duration-300 rounded-full",
                                    index === currentIndex
                                        ? "w-8 h-3 bg-gradient-to-r from-orange-500 to-blue-600"
                                        : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
                                )}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
