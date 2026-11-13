import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlackFridayState } from '../utils/campaignConfig';

// Calcula o estágio atual e a data alvo da campanha Black Friday (13/11 a 15/11):
// 1. Antes de 13/11 às 00:00:00 -> Contagem regressiva até o INÍCIO das ofertas (13/11 00:00)
// 2. De 13/11 até 15/11 às 23:59:59 -> Contagem regressiva até o ENCERRAMENTO da promoção (15/11 23:59:59)
// 3. Após 15/11 às 23:59:59 -> Promoção encerrada (site volta ao modo original)
export const getSaleTimeline = () => getBlackFridayState();

export const getTargetDate = () => {
    return getSaleTimeline().targetDate;
};

const TimeUnit = ({ value, label, isHighlight = false }) => {
    const formatted = String(value).padStart(2, '0');

    return (
        <div className="flex flex-col items-center flex-1 max-w-[90px]">
            <div
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border transition-all relative overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #1d2620 0%, #141a16 100%)',
                    borderColor: isHighlight ? 'rgba(212, 136, 106, 0.40)' : 'rgba(181, 194, 183, 0.16)',
                    boxShadow: '0 6px 16px -4px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                }}
            >
                <div
                    className="absolute top-0 inset-x-0 h-px"
                    style={{
                        background: isHighlight
                            ? 'linear-gradient(to right, transparent, rgba(212, 136, 106, 0.7), transparent)'
                            : 'linear-gradient(to right, transparent, rgba(181, 194, 183, 0.35), transparent)'
                    }}
                />
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={formatted}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="text-xl sm:text-2xl md:text-3xl font-serif font-medium tracking-tight"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: isHighlight ? '#d4886a' : '#faf9f7'
                        }}
                    >
                        {formatted}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span
                className="mt-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium"
                style={{ fontFamily: "'Poppins', sans-serif", color: '#b5c2b7' }}
            >
                {label}
            </span>
        </div>
    );
};

const SaleCountdown = () => {
    const [timeline, setTimeline] = useState(() => getSaleTimeline());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeline(getSaleTimeline());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const { timeLeft, label, infoText } = timeline;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="w-full max-w-2xl mx-auto my-6 px-4 sm:px-6">
            <div
                className="rounded-3xl px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-11 border relative overflow-hidden"
                style={{
                    background: 'linear-gradient(160deg, #18201b 0%, #121714 100%)',
                    borderColor: '#26312a',
                    boxShadow: '0 18px 40px -12px rgba(20, 26, 22, 0.25), 0 4px 12px -2px rgba(20, 26, 22, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
            >
                {/* Filete sutil centralizado no topo do card */}
                <div
                    className="absolute top-0 inset-x-0 h-px pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent 10%, rgba(181, 194, 183, 0.25) 50%, transparent 90%)'
                    }}
                />

                <div className="flex items-center justify-center mb-6 relative z-10">
                    <span
                        className="text-xs sm:text-sm uppercase tracking-[0.25em] font-medium"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#faf9f7' }}
                    >
                        {label}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-md mx-auto relative z-10">
                    <TimeUnit value={days} label="Dias" />
                    <span className="text-lg sm:text-xl font-serif text-[#b5c2b7]/50 -mt-6">:</span>
                    <TimeUnit value={hours} label="Horas" />
                    <span className="text-lg sm:text-xl font-serif text-[#b5c2b7]/50 -mt-6">:</span>
                    <TimeUnit value={minutes} label="Min" />
                    <span className="text-lg sm:text-xl font-serif text-[#b5c2b7]/50 -mt-6">:</span>
                    <TimeUnit value={seconds} label="Seg" isHighlight />
                </div>

                <p
                    className="text-center text-xs sm:text-sm mt-6 font-light tracking-wide italic relative z-10"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#c7d2c9' }}
                >
                    {infoText}
                </p>
            </div>
        </div>
    );
};

export default SaleCountdown;
