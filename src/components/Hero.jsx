import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { getHeroSettings } from '../services/siteSettings';

const DEFAULT_BANNERS = [
    {
        desktop: '/assets/desktop_banner_1.webp',
        mobile: '/assets/Mobile_banner_1.webp'
    },
    {
        desktop: '/assets/desktop_banner_2.webp',
        mobile: '/assets/mobile_banner_2.webp'
    },
    {
        desktop: '/assets/desktop_banner_3.webp',
        mobile: '/assets/mobile_banner_3.webp'
    },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [isMobile, setIsMobile] = useState(() => 
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 1024px)').matches : false
    );
    const [videoError, setVideoError] = useState(false);
    const [heroConfig, setHeroConfig] = useState(() => {
        try {
            const local = typeof window !== 'undefined' ? localStorage.getItem('site_hero_config') : null;
            if (local) {
                const parsed = JSON.parse(local);
                if (parsed && (parsed.desktopBanner || parsed.mobileBanner)) {
                    return parsed;
                }
            }
        } catch (e) {}
        return {
            mediaType: 'video',
            desktopBanner: '/assets/desktop_banner_1.webp',
            mobileBanner: '/assets/Mobile_banner_1.webp',
            bannersList: DEFAULT_BANNERS
        };
    });

    // Carrega configurações dinâmicas de Hero e Banners
    useEffect(() => {
        const fetchConfig = (force = false) => {
            getHeroSettings(force).then(cfg => {
                if (cfg) {
                    setHeroConfig(cfg);
                }
            });
        };

        fetchConfig(true);

        const onStorage = (e) => {
            if (!e || e.key === 'site_hero_config') {
                fetchConfig(true);
            }
        };

        window.addEventListener('storage', onStorage);
        window.addEventListener('hero_config_updated', onStorage);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('hero_config_updated', onStorage);
        };
    }, []);

    const activeBanners = heroConfig.bannersList && heroConfig.bannersList.length > 0 
        ? heroConfig.bannersList 
        : DEFAULT_BANNERS;

    // Detecta se é mobile para aplicar o banner correspondente
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1024px)');
        setIsMobile(mediaQuery.matches);

        const handler = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Pre-carrega as imagens subsequentes do carrossel para Desktop
    useEffect(() => {
        if (!isMobile) {
            activeBanners.forEach((banner, index) => {
                if (index !== 0 && banner.desktop) {
                    const imgDesktop = new Image();
                    imgDesktop.src = banner.desktop;
                }
            });
        }
    }, [isMobile, activeBanners]);

    const next = () => startTransition(() => setCurrent((prev) => (prev + 1) % activeBanners.length));
    const prev = () => startTransition(() => setCurrent((prev) => (prev - 1 + activeBanners.length) % activeBanners.length));

    useEffect(() => {
        if (current >= activeBanners.length) {
            setCurrent(0);
        }
    }, [activeBanners.length, current]);

    useEffect(() => {
        if (isMobile && !videoError) return; // Não executa o timer no mobile se o vídeo estiver carregando corretamente
        if (activeBanners.length <= 1) return;

        const duration = 6000;
        const timer = setTimeout(() => {
            next();
        }, duration);
        return () => clearTimeout(timer);
    }, [current, isMobile, videoError, activeBanners.length]);

    return (
        <div className="relative w-full">
            <div 
                className="relative h-auto md:h-[85vh] overflow-hidden w-full" 
                style={{ backgroundColor: 'var(--color-off-white)' }}
            >
                {(isMobile && !videoError) ? (
                    /* Versão Mobile: Apenas Vídeo */
                    <div className="w-full overflow-hidden aspect-[9/16] bg-zinc-100" style={{ maxHeight: 'calc(100svh - 152px)' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            poster="/assets/produtos/video/video_poster.webp"
                            onError={() => setVideoError(true)}
                            className="w-full h-full block object-cover aspect-[9/16]"
                            style={{ maxHeight: 'calc(100svh - 152px)', objectPosition: 'top center' }}
                        >
                            <source src="/assets/produtos/video/video_principal2.webm" type="video/webm" />
                            <source src="/assets/produtos/video/video_principal2.mp4" type="video/mp4" />
                            Seu navegador não suporta vídeos.
                        </video>
                    </div>
                ) : (
                    /* Versão Desktop: Carrossel de Banners */
                    <>
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={current}
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                <img
                                    src={isMobile ? (activeBanners[current]?.mobile || activeBanners[current]?.desktop) : activeBanners[current]?.desktop}
                                    alt={`Banner ${current + 1}`}
                                    className="w-full h-full object-cover object-center"
                                    fetchPriority={current === 0 ? "high" : "auto"}
                                    loading={current === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {activeBanners.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full hover:bg-white/80 transition-colors z-10 text-[#3f4d41]"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-full hover:bg-white/80 transition-colors z-10 text-[#3f4d41]"
                                    aria-label="Próximo"
                                >
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>

                                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
                                    {activeBanners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => startTransition(() => setCurrent(idx))}
                                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/50'}`}
                                            aria-label={`Ir para slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Seta indicadora de scroll */}
            <div className="flex justify-center items-center py-4 w-full">
                <motion.div
                    className="text-[#3f4d41]/70"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:text-[#3f4d41] transition-colors text-[#3f4d41]" />
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
