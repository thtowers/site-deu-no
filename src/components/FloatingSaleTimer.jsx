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
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeline(getSaleTimeline());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isDismissed) return;
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
        if (isHomePage) {
            e.preventDefault();
            const elem = document.getElementById('produtos');
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && !isDismissed && (
                <motion.aside
                    aria-label="Contagem regressiva da Black Friday"
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 select-none"
                >
                    <div
                        className="group flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 pl-3 sm:pl-3.5 bg-[#151c17]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#2b3830] hover:border-[#d4886a]/50 transition-all duration-300"
                        style={{
                            boxShadow: '0 16px 35px -4px rgba(0, 0, 0, 0.7)'
                        }}
                    >
                        <Link
                            to="/#produtos"
                            onClick={handleScrollToOffers}
                            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-xl bg-[#0e120f] border border-[#2b3830] flex items-center justify-center text-[#faf9f7] shrink-0 relative">
                                <Clock size={16} className="text-[#d4886a]" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d4886a] animate-pulse" />
                            </div>

                            <div className="text-left">
                                <div className="flex items-center gap-1.5 leading-none mb-1">
                                    <span
                                        className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#faf9f7]"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {shortLabel}
                                    </span>
                                    <Sparkles size={11} className="text-[#d4886a]" />
                                </div>

                                <div className="flex items-center gap-1 font-serif text-[#faf9f7] text-xs sm:text-sm font-medium tracking-tight">
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#0e120f] border border-[#2b3830] font-mono text-[11px] sm:text-xs">
                                        {pad(days)}<span className="text-[9px] text-[#b5c2b7] font-sans ml-0.5">d</span>
                                    </span>
                                    <span className="text-[#b5c2b7]/50 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#0e120f] border border-[#2b3830] font-mono text-[11px] sm:text-xs">
                                        {pad(hours)}<span className="text-[9px] text-[#b5c2b7] font-sans ml-0.5">h</span>
                                    </span>
                                    <span className="text-[#b5c2b7]/50 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#0e120f] border border-[#2b3830] font-mono text-[11px] sm:text-xs">
                                        {pad(minutes)}<span className="text-[9px] text-[#b5c2b7] font-sans ml-0.5">m</span>
                                    </span>
                                    <span className="text-[#b5c2b7]/50 text-xs">:</span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-[#0e120f] border border-[#2b3830] font-mono text-[11px] sm:text-xs text-[#d4886a] font-semibold">
                                        {pad(seconds)}<span className="text-[9px] text-[#b5c2b7] font-sans ml-0.5">s</span>
                                    </span>
                                </div>
                            </div>

                            <ChevronRight size={14} className="text-[#b5c2b7] group-hover:text-[#faf9f7] group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                        </Link>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDismissed(true);
                            }}
                            className="p-1 text-[#b5c2b7]/70 hover:text-[#faf9f7] rounded-full hover:bg-white/10 transition-colors cursor-pointer ml-1"
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
