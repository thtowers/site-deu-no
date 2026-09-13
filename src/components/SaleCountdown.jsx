import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';

// Calcula o estágio atual e a data alvo da campanha Dia do Consumidor (14/09 a 15/09):
// 1. Antes de 14/09 às 00:00:00 -> Contagem regressiva até o INÍCIO das ofertas (14/09 00:00)
// 2. De 14/09 até 15/09 às 23:59:59 -> Contagem regressiva até o ENCERRAMENTO da promoção (15/09 23:59:59)
// 3. Após 15/09 às 23:59:59 -> Promoção encerrada
export const getSaleTimeline = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Início: 14 de Setembro às 00:00:00 (mês 8 em JS = Setembro)
    const startDate = new Date(currentYear, 8, 14, 0, 0, 0);
    // Encerramento: 15 de Setembro às 23:59:59
    const endDate = new Date(currentYear, 8, 15, 23, 59, 59);

    const nowMs = now.getTime();
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    if (nowMs < startMs) {
        return {
            phase: 'upcoming',
            targetDate: startMs,
            timeLeft: Math.max(0, startMs - nowMs),
            label: 'A Promoção Começa em',
            shortLabel: 'Começa em:',
            badgeText: 'COMEÇA 14/09',
            infoText: '*A contagem regressiva começou! O Especial Dia do Consumidor inicia dia 14/09.'
        };
    } else if (nowMs <= endMs) {
        return {
            phase: 'active',
            targetDate: endMs,
            timeLeft: Math.max(0, endMs - nowMs),
            label: 'A Promoção Encerra em',
            shortLabel: 'Termina em:',
            badgeText: 'ESPECIAL',
            infoText: '*Especial Dia do Consumidor ativo! Ofertas encerram dia 15/09 às 23:59.'
        };
    } else {
        return {
            phase: 'ended',
            targetDate: endMs,
            timeLeft: 0,
            label: 'Promoção Encerrada',
            shortLabel: 'Encerrada',
            badgeText: 'ENCERRADO',
            infoText: '*O Especial Dia do Consumidor foi finalizado. Acompanhe nossas redes para novos lançamentos!'
        };
    }
};

export const getTargetDate = () => {
    return getSaleTimeline().targetDate;
};

const TimeUnit = ({ value, label }) => {
    const formatted = String(value).padStart(2, '0');

    return (
        <div className="flex flex-col items-center flex-1 max-w-[90px]">
            <div
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border shadow-xs transition-all relative overflow-hidden bg-white/90 backdrop-blur-md"
                style={{
                    borderColor: 'rgba(120, 135, 122, 0.25)',
                    boxShadow: '0 4px 16px -2px rgba(63, 77, 65, 0.05)'
                }}
            >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#78877a]/40 to-transparent" />
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={formatted}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="text-xl sm:text-2xl md:text-3xl font-serif text-[#3f4d41] font-medium tracking-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {formatted}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span
                className="mt-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium"
                style={{ fontFamily: "'Poppins', sans-serif", color: '#78877a' }}
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
        <div className="w-full max-w-2xl mx-auto my-8 px-4 sm:px-6">
            <div
                className="rounded-3xl px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-11 border relative overflow-hidden backdrop-blur-md shadow-sm"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    borderColor: 'rgba(120, 135, 122, 0.22)'
                }}
            >
                {/* Luz ambiente sutil */}
                <div
                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(169, 180, 170, 0.25) 0%, transparent 70%)'
                    }}
                />

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Clock size={16} className="text-[#78877a]" />
                    <span
                        className="text-xs uppercase tracking-[0.25em] font-medium"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#78877a' }}
                    >
                        {label}
                    </span>
                    <Sparkles size={14} className="text-[#c97d60]" />
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-md mx-auto">
                    <TimeUnit value={days} label="Dias" />
                    <span className="text-lg sm:text-xl font-serif text-[#78877a]/50 -mt-6">:</span>
                    <TimeUnit value={hours} label="Horas" />
                    <span className="text-lg sm:text-xl font-serif text-[#78877a]/50 -mt-6">:</span>
                    <TimeUnit value={minutes} label="Min" />
                    <span className="text-lg sm:text-xl font-serif text-[#78877a]/50 -mt-6">:</span>
                    <TimeUnit value={seconds} label="Seg" />
                </div>

                <p
                    className="text-center text-xs mt-5 font-light tracking-wide italic"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#78877a' }}
                >
                    {infoText}
                </p>
            </div>
        </div>
    );
};

export default SaleCountdown;
