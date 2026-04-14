import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const banners = [
    {
        desktop: '/assets/amago_desktop.webp',
        mobile: '/assets/mobile/amago_mobile.webp'
    },
    {
        desktop: '/assets/vinculo2_desktop.webp',
        mobile: '/assets/mobile/vinculo_mobile.webp'
    },
    {
        desktop: '/assets/traco_desktop.webp',
        mobile: '/assets/mobile/traco_mobile.webp'
    },

];

const Hero = () => {
    const [current, setCurrent] = useState(0);

    // Pre-carrega as imagens subsequentes do carrossel para que a transição ocorra sem atrasos
    useEffect(() => {
        banners.forEach((banner, index) => {
            if (index !== 0) { // O primeiro banner já possui preload no index.html (maior prioridade)
                const imgDesktop = new Image();
                imgDesktop.src = banner.desktop;
                const imgMobile = new Image();
                imgMobile.src = banner.mobile;
            }
        });
    }, []);

    useEffect(() => {
        const duration = current === 0 ? 10000 : 5000; // 10 segundos para Âmago, 5 para os outros
        const timer = setTimeout(() => {
            next();
        }, duration);
        return () => clearTimeout(timer);
    }, [current]);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative w-full">
            <div className="relative h-[75vh] md:h-[85vh] overflow-hidden w-full" style={{ backgroundColor: 'var(--color-off-white)' }}>
                <AnimatePresence mode='wait' initial={false}>
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
                                className="w-full h-full object-cover object-center"
                                fetchPriority={current === 0 ? "high" : "auto"}
                                loading={current === 0 ? "eager" : "lazy"}
                                decoding="async"
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

                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
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

            {/* Seta indicadora de scroll */}
            <div className="flex justify-center items-center py-4 w-full">
                <motion.div 
                    className="text-[#685744]/70"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:text-[#685744] transition-colors text-[#685744]" />
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
