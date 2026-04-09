import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Palette, Gem } from 'lucide-react';

const qualityItems = [
    {
        id: 'uv',
        title: 'Proteção UV',
        description: 'Nossas cordas possuem proteção contra raios UV, o que garante a preservação da cor e da estrutura mesmo em uso ao ar livre.',
        image: '/assets/colar_1.webp',
        icon: ShieldCheck
    },
    {
        id: 'criatividade',
        title: 'Criatividade',
        description: 'Designs marcantes e originais para quem busca um look autêntico. Deu Nó é para quem não tem medo de se destacar.',
        image: '/assets/colar_2.webp',
        icon: Palette
    },
    {
        id: 'acabamento',
        title: 'Acabamento',
        description: 'Acabamentos com banho de ouro ou níquel de alta qualidade, fornecidos pelos melhores do mercado. Brilho, resistência e elegância em cada peça.',
        image: '/assets/colar_3.webp',
        icon: Gem
    }
];

const QualitySection = () => {
    const [expandedIds, setExpandedIds] = useState(['uv']); // Começa com UV aberto

    const handleCardClick = (id) => {
        // Lógica de acordeão: se clicar, abre esse e fecha os outros
        // Se clicar no já aberto, mantemos aberto (ou poderíamos fechar, mas acordeão visual geralmente mantém um foco)
        if (!expandedIds.includes(id)) {
            setExpandedIds([id]);
        }
    };

    return (
        <section id="qualidade" className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Cabeçalho */}
                <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight mb-4 md:mb-6 text-[#3f4d41]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Qualidade que se <span className="italic text-[#78877a]">Vê</span> e se <span className="italic text-[#78877a]">Sente</span>
                    </h2>
                </div>

                {/* Container do Acordeão - Vertical em Mobile, Horizontal em Desktop */}
                <div className="flex flex-col md:flex-row gap-4 md:h-[600px] w-full max-w-6xl mx-auto">
                    {qualityItems.map((item) => {
                        const isExpanded = expandedIds.includes(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                onClick={() => handleCardClick(item.id)}
                                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out shadow-lg ${isExpanded
                                    ? 'md:flex-4 min-h-[400px] md:min-h-0'
                                    : 'md:flex-1 min-h-[80px] md:min-h-0'
                                    }`}
                                style={{
                                    border: '1px solid #e8e6e3'
                                }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className={`w-full h-full object-cover transition-all duration-700 ${isExpanded ? 'scale-100 blur-0' : 'scale-110 blur-[2px] opacity-100'}`}
                                    />
                                    {/* Overlay para texto legível (Tema Claro) */}
                                    <div className={`absolute inset-0 bg-[#faf9f7]/60 backdrop-blur-sm transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}></div>
                                    {/* Overlay Gradiente para o texto */}
                                    {isExpanded && <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-linear-to-t from-[#faf9f7] via-[#faf9f7]/80 to-transparent"></div>}
                                </div>

                                {/* Conteúdo */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">

                                    {/* Estado Expandido */}
                                    {isExpanded ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                            className="max-w-lg mb-4"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-[#3f4d41] rounded-full shadow-md">
                                                    <item.icon size={20} className="text-[#faf9f7] md:w-6 md:h-6" />
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-serif text-[#3f4d41]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-base md:text-lg font-light leading-relaxed text-[#5c6b5e]">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        /* Estado Colapsado */
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {/* Mobile: Texto horizontal */}
                                            <h3
                                                className="md:hidden text-2xl text-[#3f4d41] uppercase tracking-[0.15em] font-medium"
                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                            >
                                                {item.title}
                                            </h3>
                                            {/* Desktop: Texto vertical */}
                                            <div className="hidden md:block rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                                <h3
                                                    className="text-3xl text-[#3f4d41] uppercase tracking-[0.2em] font-medium drop-shadow-none whitespace-nowrap"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default QualitySection;
