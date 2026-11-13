import React, { useState, useEffect, useRef, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles, ArrowRight, Play } from 'lucide-react';
import { getHeroSettings } from '../services/siteSettings';
import { smoothScrollToSection } from '../App';
import { useBlackFridayStatus } from '../utils/campaignConfig';

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

/* Fita Esqueumórfica Realista para o Hero (Textura de Gorgurão/Cetim + Volume 3D + Filete Metálico + Sombra Física) */
const HeroSkeuomorphicRibbon = ({ angle = 24, isTopRibbon = true }) => (
    <div
        className="absolute select-none pointer-events-none"
        style={{
            width: '920px',
            left: '-460px',
            top: '-20px',
            transform: `rotate(${angle}deg)`,
            zIndex: isTopRibbon ? 2 : 1,
            boxShadow: isTopRibbon
                ? '0 12px 26px rgba(0, 0, 0, 0.88), 0 4px 8px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.9)'
                : '0 7px 16px rgba(0, 0, 0, 0.78), 0 2px 5px rgba(0, 0, 0, 0.92), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.9)',
            backgroundImage: `
                repeating-linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.035) 0px,
                    rgba(255, 255, 255, 0.035) 1px,
                    rgba(0, 0, 0, 0.2) 1px,
                    rgba(0, 0, 0, 0.2) 3px
                ),
                linear-gradient(
                    180deg,
                    #2e2e2e 0%,
                    #161616 18%,
                    #0a0a0a 50%,
                    #151515 82%,
                    #282828 100%
                )
            `,
            borderTop: '1px solid #050505',
            borderBottom: '1px solid #050505',
            padding: '3.5px 0'
        }}
    >
        {/* Brilho especular central da fita de cetim */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: isTopRibbon
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.10) 38%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.09) 62%, rgba(0,0,0,0.55) 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.06) 35%, rgba(0,0,0,0.65) 50%, rgba(255,255,255,0.06) 65%, rgba(0,0,0,0.65) 100%)'
            }}
        />

        {/* Filete / Pesponto metálico interno superior e inferior */}
        <div
            className="relative py-1 sm:py-1.5 flex items-center justify-center whitespace-nowrap"
            style={{
                borderTop: isTopRibbon
                    ? '1px solid rgba(255, 255, 255, 0.50)'
                    : '1px solid rgba(255, 255, 255, 0.32)',
                borderBottom: isTopRibbon
                    ? '1px solid rgba(255, 255, 255, 0.44)'
                    : '1px solid rgba(255, 255, 255, 0.28)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.85), inset 0 -1px 2px rgba(0, 0, 0, 0.85)'
            }}
        >
            <div
                className="flex items-center justify-center tracking-[0.2em] text-[10px] sm:text-xs uppercase"
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    opacity: isTopRibbon ? 0.98 : 0.78,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.95), 0 -0.5px 0 rgba(255, 255, 255, 0.25)'
                }}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="inline-flex items-center">
                        <strong className="font-extrabold text-[#f5f5f5]">BLACK</strong>
                        <span className="font-normal text-[#e0e0e0] ml-1">FRIDAY</span>
                        <span className="mx-2.5 sm:mx-3 text-[#d4d4d4] text-[9px]">•</span>
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const Hero = () => {
    const { isBlackFridayActive } = useBlackFridayStatus();
    const [current, setCurrent] = useState(0);
    const [isMobile, setIsMobile] = useState(() => 
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 1024px)').matches : false
    );
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);
    const [videoNeedsPlay, setVideoNeedsPlay] = useState(false);

    const playHeroVideo = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        video.play()?.catch(() => setVideoNeedsPlay(true));
    };
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

    const scrollToNextSection = (e) => {
        if (!isBlackFridayActive) {
            smoothScrollToSection(e, 'amago', 650);
            return;
        }
        const targetId = document.getElementById('black-friday') ? 'black-friday' : 'produtos';
        smoothScrollToSection(e, targetId, 650);
    };

    return (
        <div className="relative w-full">
            <div 
                className={`relative overflow-hidden w-full ${isMobile ? 'aspect-[9/16] max-h-[calc(100svh-152px)]' : 'h-[85vh]'}`}
                style={{ backgroundColor: 'var(--color-off-white)' }}
            >
                {/* ══════════════════════════════════════════════════════════════════════════
                    FITAS ESQUEUMÓRFICAS DE GORGURÃO/CETIM NOS CANTOS DO HERO (SOMENTE NA BLACK FRIDAY)
                ══════════════════════════════════════════════════════════════════════════ */}
                {isBlackFridayActive && (
                    <>
                        {/* Canto Superior Esquerdo */}
                        <div
                            className="absolute pointer-events-none z-20"
                            style={{ top: '70px', left: '105px', width: 0, height: 0 }}
                            aria-hidden="true"
                        >
                            <HeroSkeuomorphicRibbon angle={-46} isTopRibbon={false} />
                            <HeroSkeuomorphicRibbon angle={-21} isTopRibbon={true} />
                        </div>

                        {/* Canto Superior Direito */}
                        <div
                            className="hidden sm:block absolute pointer-events-none z-20"
                            style={{ top: '70px', right: '105px', width: 0, height: 0 }}
                            aria-hidden="true"
                        >
                            <HeroSkeuomorphicRibbon angle={46} isTopRibbon={false} />
                            <HeroSkeuomorphicRibbon angle={21} isTopRibbon={true} />
                        </div>

                        {/* Canto Inferior Esquerdo */}
                        <div
                            className="hidden sm:block absolute pointer-events-none z-20"
                            style={{ bottom: '64px', left: '105px', width: 0, height: 0 }}
                            aria-hidden="true"
                        >
                            <HeroSkeuomorphicRibbon angle={44} isTopRibbon={false} />
                            <HeroSkeuomorphicRibbon angle={19} isTopRibbon={true} />
                        </div>

                        {/* Canto Inferior Direito */}
                        <div
                            className="absolute pointer-events-none z-20"
                            style={{ bottom: '64px', right: '105px', width: 0, height: 0 }}
                            aria-hidden="true"
                        >
                            <HeroSkeuomorphicRibbon angle={-44} isTopRibbon={false} />
                            <HeroSkeuomorphicRibbon angle={-19} isTopRibbon={true} />
                        </div>
                    </>
                )}

                {(isMobile && !videoError) ? (
                    /* Versão Mobile: Apenas Vídeo */
                    <div className="w-full overflow-hidden aspect-[9/16] bg-[#121714]" style={{ maxHeight: 'calc(100svh - 152px)' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            poster="/assets/produtos/video/video_poster.webp?v=bf-2026"
                            onCanPlay={playHeroVideo}
                            onPlaying={() => setVideoNeedsPlay(false)}
                            onPause={() => setVideoNeedsPlay(true)}
                            onError={() => setVideoError(true)}
                            className="w-full h-full block object-cover aspect-[9/16]"
                            style={{ maxHeight: 'calc(100svh - 152px)', objectPosition: 'top center' }}
                        >
                            <source src="/assets/produtos/video/video_principal2.mp4?v=bf-2026" type="video/mp4" />
                            <source src="/assets/produtos/video/video_principal2.webm?v=bf-2026" type="video/webm" />
                            Seu navegador não suporta vídeos.
                        </video>
                        {videoNeedsPlay && (
                            <button
                                type="button"
                                onClick={playHeroVideo}
                                aria-label="Reproduzir vídeo"
                                className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                            >
                                <span className="rounded-full bg-black/60 border border-white/60 p-5 text-white">
                                    <Play className="w-9 h-9" aria-hidden="true" />
                                </span>
                            </button>
                        )}
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
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#0e120f]/70 border border-[#2b3830] p-2 md:p-3 rounded-full hover:bg-[#171e19] transition-colors z-30 text-[#faf9f7] backdrop-blur-md cursor-pointer"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#0e120f]/70 border border-[#2b3830] p-2 md:p-3 rounded-full hover:bg-[#171e19] transition-colors z-30 text-[#faf9f7] backdrop-blur-md cursor-pointer"
                                    aria-label="Próximo"
                                >
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>

                                <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
                                    {activeBanners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => startTransition(() => setCurrent(idx))}
                                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors cursor-pointer ${idx === current ? 'bg-[#d4886a]' : 'bg-white/50'}`}
                                            aria-label={`Ir para slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Botão Promocional Flutuante no Hero (Somente na Black Friday) */}
                {isBlackFridayActive && (
                    <div className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-30 w-auto px-4 text-center">
                        <a
                            href="#black-friday"
                            onClick={scrollToNextSection}
                            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 backdrop-blur-md cursor-pointer"
                            style={{
                                backgroundColor: 'rgba(14, 18, 15, 0.90)',
                                borderColor: 'rgba(212, 136, 106, 0.45)',
                                color: '#faf9f7'
                            }}
                        >
                            <Sparkles size={16} className="text-[#d4886a] animate-pulse shrink-0" />
                            <span
                                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Black Friday
                            </span>
                            <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#d4886a] text-[#0e120f] tracking-wider whitespace-nowrap">
                                13 A 15/11
                            </span>
                            <ArrowRight size={14} className="text-[#faf9f7] group-hover:translate-x-1 transition-transform shrink-0" />
                        </a>
                    </div>
                )}
            </div>

            {/* Seta indicadora de scroll */}
            <div className="flex justify-center items-center py-4 w-full">
                <motion.a
                    href={isBlackFridayActive ? "#black-friday" : "#amago"}
                    onClick={scrollToNextSection}
                    className="text-[#3f4d41]/70 hover:text-[#3f4d41] transition-colors"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    aria-label={isBlackFridayActive ? "Rolar para seção Black Friday" : "Rolar para a coleção"}
                >
                    <ChevronDown className="w-8 h-8 md:w-10 md:h-10 cursor-pointer text-[#3f4d41]" />
                </motion.a>
            </div>
        </div>
    );
};

export default Hero;
