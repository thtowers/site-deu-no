import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getSaleTimeline } from './SaleCountdown';

const FloatingSaleTimer = () => {
    const [timeline, setTimeline] = useState(() => getSaleTimeline());
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const location = useLocation();
    const isSalePage = location.pathname === '/sale' || location.pathname === '/promocao' || location.pathname === '/dia-do-consumidor';

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeline(getSaleTimeline());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isDismissed) return;
            // Exibe após rolar um pouco para não cobrir o hero imediatamente
            setIsVisible(window.scrollY > 180);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    const { timeLeft, shortLabel } = timeline;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    const handleScrollToOffers = (e) => {
        if (isSalePage) {
            e.preventDefault();
            const elem = document.getElementById('produtos-sale');
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && !isDismissed && (
                <motion.aside
                    aria-label="Contagem regressiva da promoção"
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 select-none"
                >
                    <div
                        className="group flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 pl-3 sm:pl-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#e8e6e3] hover:shadow-2xl transition-all duration-300"
                        style={{
                            boxShadow: '0 12px 30px -4px rgba(63, 77, 65, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        {/* Link / Botão que leva às ofertas */}
                        <Link
                            to="/sale"
                            onClick={handleScrollToOffers}
                            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
                        >
                            {/* Ícone com luz sutil */}
                            <div className="w-8 h-8 rounded-xl bg-[#faf9f7] border border-[#e8e6e3] flex items-center justify-center text-[#3f4d41] shrink-0 relative">
                                <Clock size={16} />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#c97d60] animate-pulse" />
                            </div>

                            {/* Informações do Relógio */}
                            <div className="text-left">
                                <div className="flex items-center gap-1.5 leading-none mb-1">
                                    <span
                                        className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#3f4d41]"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {shortLabel}
                                    </span>
                                    <Sparkles size={11} className="text-[#c97d60]" />
                                </div>

                                {/* Dígitos do Relógio */}
                                <div className="flex items-center gap-1 font-serif text-[#3f4d41] text-xs sm:text-sm font-medium tracking-tight">
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#faf9f7] border border-[#e8e6e3]/70 font-mono text-[11px] sm:text-xs">
                                        {pad(days)}<span className="text-[9px] text-[#78877a] font-sans ml-0.5">d</span>
                                    </span>
                                    <span className="text-[#78877a]/60 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#faf9f7] border border-[#e8e6e3]/70 font-mono text-[11px] sm:text-xs">
                                        {pad(hours)}<span className="text-[9px] text-[#78877a] font-sans ml-0.5">h</span>
                                    </span>
                                    <span className="text-[#78877a]/60 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#faf9f7] border border-[#e8e6e3]/70 font-mono text-[11px] sm:text-xs">
                                        {pad(minutes)}<span className="text-[9px] text-[#78877a] font-sans ml-0.5">m</span>
                                    </span>
                                    <span className="text-[#78877a]/60 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#faf9f7] border border-[#e8e6e3]/70 font-mono text-[11px] sm:text-xs text-[#c97d60] font-semibold">
                                        {pad(seconds)}<span className="text-[9px] text-[#78877a] font-sans ml-0.5">s</span>
                                    </span>
                                </div>
                            </div>

                            <ChevronRight size={14} className="text-[#78877a] group-hover:text-[#3f4d41] group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                        </Link>

                        {/* Botão de Fechar */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDismissed(true);
                            }}
                            className="p-1 text-[#78877a]/60 hover:text-[#3f4d41] rounded-full hover:bg-black/5 transition-colors cursor-pointer ml-1"
                            aria-label="Fechar relógio"
                        >
                            <X size={13} />
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default FloatingSaleTimer;
