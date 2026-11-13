import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { DividerBlackFridayStamps } from './BlackFridayStampsBackground';
import { useBlackFridayStatus } from '../utils/campaignConfig';

const URGENCY_MESSAGES = [
    'TEMPO LIMITADO',
    'SÓ DIAS 13, 14 E 15',
    'PEÇAS LIMITADAS',
    'DESCONTOS EXCLUSIVOS',
    'GARANTA A SUA'
];

let globalUrgencyCounter = 0;

const ElegantDivider = ({ variantIndex }) => {
    const { isBlackFridayActive } = useBlackFridayStatus();
    const instanceIndexRef = useRef(null);

    if (instanceIndexRef.current === null) {
        instanceIndexRef.current =
            typeof variantIndex === 'number'
                ? variantIndex
                : globalUrgencyCounter++;
    }

    // Versão Original do Site (após o encerramento da Black Friday)
    if (!isBlackFridayActive) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                {/* Top Line */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: 40, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-px bg-linear-to-b from-transparent via-[#78877a] to-[#78877a]"
                />

                {/* Central Diamond */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-3 h-3 border border-[#78877a] rotate-45 my-2 bg-[#faf9f7]"
                />

                {/* Bottom Line */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: 40, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-px bg-linear-to-t from-transparent via-[#78877a] to-[#78877a]"
                />
            </div>
        );
    }

    const urgencyText = URGENCY_MESSAGES[instanceIndexRef.current % URGENCY_MESSAGES.length];

    return (
        <div className="relative flex flex-col items-center justify-center py-16 md:py-20 overflow-hidden">
            {/* Linha Vertical Superior (Pulso Mais Claro ↔ Mais Forte) */}
            <motion.div
                key="divider-top-line"
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: 38, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ width: 1 }}
                className="relative overflow-hidden"
            >
                <motion.div
                    animate={{ opacity: [0.3, 0.95, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full bg-gradient-to-b from-transparent via-[#78877a] to-[#b85636]"
                />
            </motion.div>

            {/* Bloco Central de Urgência Black Friday (Efeito Mais Claro ↔ Mais Forte) */}
            <div
                key="divider-central-diamond"
                className="relative z-10 my-2.5 flex items-center justify-center"
            >
                {/* Emblema Central Pulsante: Alterna entre Mais Claro/Suave e Mais Forte/Intenso */}
                <motion.div
                    animate={{
                        opacity: [0.62, 1, 0.62],
                        scale: [0.98, 1.035, 0.98],
                        borderColor: [
                            'rgba(212, 136, 106, 0.28)',
                            'rgba(212, 136, 106, 0.88)',
                            'rgba(212, 136, 106, 0.28)'
                        ],
                        boxShadow: [
                            '0 4px 12px rgba(23, 30, 25, 0.10), 0 0 0px rgba(212, 136, 106, 0)',
                            '0 10px 24px rgba(23, 30, 25, 0.26), 0 0 22px rgba(212, 136, 106, 0.45)',
                            '0 4px 12px rgba(23, 30, 25, 0.10), 0 0 0px rgba(212, 136, 106, 0)'
                        ]
                    }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="relative inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border select-none"
                    style={{
                        background: 'linear-gradient(135deg, #171e19 0%, #111613 100%)'
                    }}
                >
                    {/* Brilho interno sutil que acende no pico da animação */}
                    <motion.div
                        animate={{ opacity: [0.05, 0.28, 0.05] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(212, 136, 106, 0.45) 0%, transparent 75%)'
                        }}
                    />

                    {/* Ponto / Losango Sinalizador de Urgência ("Live Beacon") */}
                    <span className="relative flex h-2 w-2 items-center justify-center">
                        <motion.span
                            animate={{ scale: [1, 2.1, 1], opacity: [0.75, 0, 0.75] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                            className="absolute inline-flex h-full w-full rounded-full bg-[#d4886a]"
                        />
                        <motion.span
                            animate={{
                                backgroundColor: ['#f3d2c5', '#e07b56', '#f3d2c5'],
                                scale: [0.9, 1.15, 0.9]
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative inline-flex h-1.5 w-1.5 rotate-45"
                        />
                    </span>

                    {/* Texto de Urgência Black Friday */}
                    <div
                        className="relative z-10 flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <strong className="font-bold text-[#faf9f7]">BLACK FRIDAY</strong>
                        <span className="text-[#d4886a] font-bold">•</span>
                        <motion.span
                            animate={{
                                color: ['#c7d2c9', '#f0a68b', '#c7d2c9']
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="font-semibold tracking-[0.16em]"
                        >
                            {urgencyText}
                        </motion.span>
                    </div>
                </motion.div>
            </div>

            {/* Linha Vertical Inferior (Pulso Mais Claro ↔ Mais Forte) */}
            <motion.div
                key="divider-bottom-line"
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: 38, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ width: 1 }}
                className="relative overflow-hidden"
            >
                <motion.div
                    animate={{ opacity: [0.3, 0.95, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full bg-gradient-to-t from-transparent via-[#78877a] to-[#b85636]"
                />
            </motion.div>

            {/* Carimbos no espaço livre entre os cards (cada ElegantDivider recebe uma organização ímpar única) */}
            <DividerBlackFridayStamps key="divider-stamps" variantIndex={instanceIndexRef.current} />
        </div>
    );
};

export default ElegantDivider;
