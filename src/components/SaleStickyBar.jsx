import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, X, Clock } from 'lucide-react';
import { getSaleTimeline } from './SaleCountdown';

const SaleStickyBar = ({ scrollThreshold = 250 }) => {
    const [timeline, setTimeline] = useState(() => getSaleTimeline());
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const location = useLocation();
    const isSalePage = location.pathname === '/sale' || location.pathname === '/promocao' || location.pathname === '/dia-do-consumidor';

    // Timer em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeline(getSaleTimeline());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Reseta o fechamento ao trocar de rota para que o modal volte a aparecer
    useEffect(() => {
        setIsDismissed(false);
    }, [location.pathname]);

    // Listener de scroll com reativação automática ao voltar ao topo
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            // Se o usuário voltar próximo ao topo, reativa o modal para a próxima descida
            if (currentY < 60) {
                setIsDismissed(false);
            }

            setIsVisible(currentY > scrollThreshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollThreshold]);

    const { timeLeft, badgeText, shortLabel } = timeline;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const pad = (n) => String(n).padStart(2, '0');

    const handleActionClick = (e) => {
        if (isSalePage) {
            e.preventDefault();
            const target = document.getElementById('produtos-sale');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 600, behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <AnimatePresence>
                {/* Modal Completo quando visível e não dispensado */}
                {isVisible && !isDismissed && (
                    <motion.div
                        initial={{ y: 80, opacity: 0, scale: 0.96 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 80, opacity: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className="fixed bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-6 max-w-2xl mx-auto z-50 p-3 sm:py-3.5 sm:px-6 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-xl shadow-2xl border border-[#e8e6e3] select-none"
                        style={{
                            boxShadow: '0 20px 40px -10px rgba(63, 77, 65, 0.18), 0 6px 16px -4px rgba(0, 0, 0, 0.08)'
                        }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                            
                            {/* Lado Esquerdo: Tag com Luzinha + Título */}
                            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                                <div className="flex items-center gap-2.5">
                                    {/* Luzinha Pulsante Minimalista */}
                                    <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
                                        <span
                                            className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-60"
                                            style={{ backgroundColor: '#c97d60' }}
                                        />
                                        <span
                                            className="relative inline-flex rounded-full h-2 w-2 shadow-xs"
                                            style={{ backgroundColor: '#c97d60' }}
                                        />
                                    </div>

                                    {/* Título & Badge de Desconto */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-xs sm:text-sm font-semibold tracking-tight text-[#3f4d41]"
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            Dia do Consumidor
                                        </span>
                                        <span
                                            className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#c97d60]/15 text-[#c97d60] tracking-wider whitespace-nowrap"
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            {badgeText}
                                        </span>
                                    </div>
                                </div>

                                {/* Botão Fechar no mobile */}
                                <button
                                    onClick={() => setIsDismissed(true)}
                                    className="sm:hidden p-1 text-[#78877a]/70 hover:text-[#3f4d41] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                                    aria-label="Fechar aviso"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Centro: Relógio Regressivo em Caixinhas */}
                            <div className="flex items-center gap-2">
                                <span className="hidden md:inline-block text-[11px] text-[#78877a] font-medium uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    {shortLabel}
                                </span>
                                <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-[#faf9f7] border border-[#e8e6e3]/70">
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="font-mono font-bold text-xs sm:text-sm text-[#3f4d41]">
                                            {pad(days)}
                                        </span>
                                        <span className="text-[9px] uppercase font-medium text-[#78877a]">d</span>
                                    </div>
                                    <span className="text-xs text-[#78877a]/40 font-mono">:</span>

                                    <div className="flex items-baseline gap-0.5">
                                        <span className="font-mono font-bold text-xs sm:text-sm text-[#3f4d41]">
                                            {pad(hours)}
                                        </span>
                                        <span className="text-[9px] uppercase font-medium text-[#78877a]">h</span>
                                    </div>
                                    <span className="text-xs text-[#78877a]/40 font-mono">:</span>

                                    <div className="flex items-baseline gap-0.5">
                                        <span className="font-mono font-bold text-xs sm:text-sm text-[#3f4d41]">
                                            {pad(minutes)}
                                        </span>
                                        <span className="text-[9px] uppercase font-medium text-[#78877a]">m</span>
                                    </div>
                                    <span className="text-xs text-[#78877a]/40 font-mono">:</span>

                                    <div className="flex items-baseline gap-0.5">
                                        <span className="font-mono font-bold text-xs sm:text-sm text-[#c97d60]">
                                            {pad(seconds)}
                                        </span>
                                        <span className="text-[9px] uppercase font-medium text-[#c97d60]">s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lado Direito: Botão CTA + Botão Fechar no Desktop */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                {isSalePage ? (
                                    <a
                                        href="#produtos-sale"
                                        onClick={handleActionClick}
                                        className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-full bg-[#3f4d41] hover:bg-[#2d382f] text-white text-xs uppercase tracking-wider font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        <span>Ver Ofertas</span>
                                        <ArrowRight size={13} />
                                    </a>
                                ) : (
                                    <Link
                                        to="/sale"
                                        className="w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-full bg-[#3f4d41] hover:bg-[#2d382f] text-white text-xs uppercase tracking-wider font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        <span>Ver Ofertas</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                )}

                                <button
                                    onClick={() => setIsDismissed(true)}
                                    className="hidden sm:inline-flex p-1.5 text-[#78877a]/70 hover:text-[#3f4d41] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                                    aria-label="Fechar aviso"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* Mini Botão Flutuante de Reabertura (quando o usuário fecha no X) */}
                {isVisible && isDismissed && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        onClick={() => setIsDismissed(false)}
                        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-[#e8e6e3] text-[#3f4d41] hover:scale-105 transition-all duration-300 cursor-pointer group"
                        title="Ver promoção do Dia do Consumidor"
                    >
                        <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                            <span
                                className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-60"
                                style={{ backgroundColor: '#c97d60' }}
                            />
                            <span
                                className="relative inline-flex rounded-full h-2 w-2 shadow-xs"
                                style={{ backgroundColor: '#c97d60' }}
                            />
                        </div>
                        <Clock size={14} className="text-[#3f4d41]" />
                        <span
                            className="text-xs font-semibold tracking-tight"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            {pad(days)}d {pad(hours)}h {pad(minutes)}m
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded-full bg-[#c97d60]/15 text-[#c97d60]">
                            {badgeText}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
};

export default SaleStickyBar;
