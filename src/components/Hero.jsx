import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
    {
        desktop: '/assets/Douré-desktop.jpeg',
        mobile: '/assets/Mobile/doure.mobile.jpeg'
    },
    {
        desktop: '/assets/Vento-desktop.jpeg',
        mobile: '/assets/Mobile/vento.mobile.jpeg'
    },
    {
        desktop: '/assets/Solene-desktop.png',
        mobile: '/assets/Mobile/solene.mobile.jpeg'
    },
    {
        desktop: '/assets/Sopro-desktop.jpeg',
        mobile: '/assets/Mobile/sopro.mobile.jpeg'
    }
];

const Hero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative h-[85vh] md:h-[90vh] overflow-hidden w-full" style={{ backgroundColor: 'var(--color-off-white)' }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <picture>
                        <source media="(max-width: 1024px)" srcSet={banners[current].mobile} />
                        <img
                            src={banners[current].desktop}
                            alt={`Banner ${current + 1}`}
                            className="w-full h-full object-contain object-top xl:object-cover xl:object-bottom"
                        />
                    </picture>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={prev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full hover:bg-white/80 transition-colors z-10"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full hover:bg-white/80 transition-colors z-10"
                aria-label="Próximo"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Ir para slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
