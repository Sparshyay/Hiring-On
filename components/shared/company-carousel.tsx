"use client";

import { motion } from "framer-motion";

const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
];

export function CompanyCarousel() {
    // Duplicate companies for infinite scroll effect
    const carouselCompanies = [...companies, ...companies, ...companies];

    return (
        <div className="w-full py-8 border-y border-slate-100/50 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Trusted by 7,000+ top startups, freelancers and studios
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-16 w-max items-center"
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                >
                    {carouselCompanies.map((company, index) => (
                        <div
                            key={`${company.name}-${index}`}
                            className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        >
                            {/* Using img tag for SVGs to ensure they render correctly without Next/Image complexity for external SVGs if domains aren't configured */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
