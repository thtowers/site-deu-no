import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            mediaType: 'banner',
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

    const shouldShowVideo = heroConfig.mediaType === 'video' && isMobile && !videoError;

    useEffect(() => {
        if (shouldShowVideo) return; // Não roda timer de banners se o vídeo estiver ativo no mobile
        if (activeBanners.length <= 1) return;

        const duration = 6000;
        const timer = setTimeout(() => {
            next();
        }, duration);
        return () => clearTimeout(timer);
    }, [current, shouldShowVideo, activeBanners.length]);

    return (
        <div className="relative w-full">
            <div 
                className={`relative overflow-hidden w-full ${shouldShowVideo ? 'h-auto' : 'h-[68svh] min-h-[480px] md:h-[85vh]'}`} 
                style={{ backgroundColor: 'var(--color-off-white)' }}
            >
                {shouldShowVideo ? (
                    /* Modo Vídeo: Força exibição de vídeo 9:16 quando em dispositivos móveis (isMobile && !videoError) */
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
                    /* Modo Banner (Padrão Ativo ou Desktop): Responsivo Desktop & Mobile */
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

                                <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
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

                {/* Botão Promocional no Hero do Banner */}
                <div className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-20 w-auto px-4 text-center">
                    <Link
                        to="/sale"
                        className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-lg hover:shadow-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md cursor-pointer"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            color: '#3f4d41'
                        }}
                    >
                        <Sparkles size={16} className="text-[#c97d60] animate-pulse shrink-0" />
                        <span
                            className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Dia do Consumidor
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#c97d60] text-white tracking-wider">
                            SALE
                        </span>
                        <ArrowRight size={14} className="text-[#3f4d41] group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                </div>
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
