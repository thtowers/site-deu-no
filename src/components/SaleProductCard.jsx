import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Smartphone, CreditCard } from 'lucide-react';
import { COLORS_CATALOG } from '../data/colorsCatalog';

const SaleProductCard = ({
    id,
    name,
    collection = '',
    description,
    modalSubtitle,
    originalPrice,
    salePrice,
    badgeUrgency,
    imageSrc,
    reversed = false,
    colorOptions = [],
    imageClass = 'object-center'
}) => {
    const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const isAnimating = React.useRef(false);

    const descString = Array.isArray(description) ? description.join('\n') : (description || '');
    const cleanDescription = descString.replace(/Outras opções de cores disponíveis/g, '').trim();

    // Cores do catálogo
    const colorsList = colorOptions.map(colorId => COLORS_CATALOG[colorId]).filter(Boolean);
    const hasColorOptions = colorsList.length > 0;

    const nextImage = (e) => {
        if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
        if (isAnimating.current) return;
        isAnimating.current = true;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => { isAnimating.current = false; }, 400);
    };

    const prevImage = (e) => {
        if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
        if (isAnimating.current) return;
        isAnimating.current = true;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setTimeout(() => { isAnimating.current = false; }, 400);
    };

    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 200 : -200,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (dir) => ({
            zIndex: 0,
            x: dir < 0 ? 200 : -200,
            opacity: 0
        })
    };

    const whatsappMessage = `Olá! Vi a promoção especial do Dia do Consumidor e gostaria de garantir o *${name}* por *${salePrice}* (De ${originalPrice}). Poderia me informar a disponibilidade de cores?`;

    return (
        <>
            {/* Pré-carregamento de imagens */}
            <div className="hidden">
                {images.map((url, idx) => (
                    <img key={idx} src={url} alt="preload" decoding="async" />
                ))}
            </div>

            <motion.div
                id={id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-gradient-to-br rounded-3xl shadow-xl overflow-hidden border mb-12 lg:mb-16 relative"
                style={{
                    background: 'linear-gradient(to bottom right, #ffffff, #faf9f7)',
                    borderColor: '#e8e6e3'
                }}
            >
                {/* Linha de destaque no topo do card com cor elegante */}
                <div className="h-1 w-full bg-gradient-to-r from-[#78877a]/30 via-[#c97d60]/60 to-[#78877a]/30" />

                {/* Container principal */}
                <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                    
                    {/* Coluna da Imagem */}
                    <div
                        className="lg:w-[60%] relative overflow-hidden bg-[#f3f2f0] group self-stretch flex flex-col justify-center min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] aspect-[4/5] lg:aspect-[4/5]"
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent z-10 pointer-events-none" />

                        {/* Carrossel Animado */}
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.3 }
                                }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img
                                    src={images[currentIndex]}
                                    alt={`${name} - Imagem ${currentIndex + 1}`}
                                    className={`w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105 ${
                                        Array.isArray(imageClass) ? (imageClass[currentIndex] || imageClass[0]) : imageClass
                                    }`}
                                    loading="lazy"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Selos de Urgência & Desconto no topo da imagem */}
                        <div className={`absolute top-4 md:top-6 ${reversed ? 'right-4 md:right-6' : 'left-4 md:left-6'} z-20 flex flex-col gap-2`}>
                            <span
                                className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase shadow-sm flex items-center gap-1.5"
                                style={{
                                    backgroundColor: '#3f4d41',
                                    color: '#ffffff'
                                }}
                            >
                                <Tag size={12} className="text-[#c97d60]" />
                                Dia do Consumidor
                            </span>

                            {badgeUrgency && (
                                <span
                                    className="px-3 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase shadow-xs w-fit"
                                    style={{
                                        backgroundColor: 'rgba(250, 249, 247, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#78877a',
                                        border: '1px solid rgba(120, 135, 122, 0.2)'
                                    }}
                                >
                                    {badgeUrgency}
                                </span>
                            )}
                        </div>

                        {/* Controles do carrossel se houver múltiplas fotos */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-[#3f4d41] flex items-center justify-center backdrop-blur-md shadow-md transition-all opacity-80 hover:opacity-100"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-[#3f4d41] flex items-center justify-center backdrop-blur-md shadow-md transition-all opacity-80 hover:opacity-100"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={22} />
                                </button>

                                {/* Indicadores */}
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                                idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Conteúdo */}
                    <div className="lg:w-[40%] p-6 md:p-10 lg:p-14 flex flex-col justify-center relative">
                        {/* Linha decorativa superior - hidden on mobile */}
                        <div className={`hidden md:block absolute top-0 ${reversed ? 'right-16' : 'left-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'l' : 'r'} from-transparent via-[#78877a] to-transparent`}></div>

                        <div className="space-y-4 md:space-y-6">
                            {/* Nome do produto */}
                            <div>
                                <h3
                                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-2 md:mb-3 tracking-tight"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        letterSpacing: '-0.02em',
                                        color: '#3f4d41'
                                    }}
                                >
                                    {name}
                                </h3>
                                <div className="w-16 md:w-20 h-px bg-gradient-to-r from-[#78877a] to-transparent"></div>
                            </div>

                            {/* Descrição */}
                            {cleanDescription && (
                                <p
                                    className="leading-relaxed text-base md:text-lg font-light tracking-wide"
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        lineHeight: '1.8',
                                        color: '#78877a',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {cleanDescription}
                                </p>
                            )}

                            {/* Botão de Cores */}
                            {hasColorOptions && (
                                <div className="pt-2 pb-1">
                                    <button
                                        onClick={() => React.startTransition(() => setShowColorModal(true))}
                                        className="group flex flex-row items-center gap-3 px-5 py-2.5 text-sm font-medium tracking-wide border border-[#e8e6e3] rounded-full hover:border-[#78877a] hover:bg-[#faf9f7] transition-all duration-300 shadow-sm hover:shadow-md bg-white w-fit cursor-pointer"
                                        style={{ fontFamily: "'Poppins', sans-serif", color: '#566658' }}
                                    >
                                        <div className="flex -space-x-2">
                                            {colorsList.slice(0, 3).map((color, idx) => (
                                                <img
                                                    key={color.id}
                                                    src={color.imageSrc}
                                                    alt={color.name}
                                                    className="w-5 h-5 rounded-full shadow-inner border border-white group-hover:scale-110 transition-transform object-cover"
                                                    style={{ zIndex: 10 - idx }}
                                                />
                                            ))}
                                        </div>
                                        Cores Disponíveis
                                    </button>
                                </div>
                            )}

                            {/* Preço */}
                            <div className="pt-4 md:pt-6" style={{ borderTop: '1px solid #e8e6e3' }}>
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className="text-xs md:text-sm font-light uppercase tracking-wider"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            color: '#a9b4aa'
                                        }}
                                    >
                                        Investimento
                                    </span>
                                </div>
                                <div className="mt-2 text-left flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span
                                        className="text-3xl md:text-4xl lg:text-5xl font-serif"
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            color: '#3f4d41'
                                        }}
                                    >
                                        {salePrice}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-base md:text-lg font-light line-through"
                                            style={{
                                                fontFamily: "'Playfair Display', serif",
                                                color: '#a9b4aa'
                                            }}
                                        >
                                            {originalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Formas de pagamento */}
                            <div className="-mt-2 mb-2">
                                <button
                                    onClick={() => React.startTransition(() => setShowPaymentModal(true))}
                                    className="text-[10px] md:text-xs uppercase tracking-widest font-medium border-b border-[#a9b4aa]/30 hover:border-[#3f4d41] transition-all pb-0.5 w-fit cursor-pointer"
                                    style={{ fontFamily: "'Poppins', sans-serif", color: '#a9b4aa' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#3f4d41'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#a9b4aa'}
                                >
                                    Formas de pagamento
                                </button>
                            </div>

                            {/* Botão whatsapp */}
                            <div className="pt-3 md:pt-4">
                                <a
                                    href={`https://wa.me/5521965672034?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp-buy group relative px-6 py-3 md:px-8 md:py-3 font-medium tracking-wider uppercase text-xs md:text-sm rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 md:gap-3 w-fit mx-auto lg:mx-0 cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(to right, #1DA851, #25D366)',
                                        color: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to right, #25D366, #4ADE80)';
                                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 211, 102, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to right, #1DA851, #25D366)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <img
                                        src="/assets/logo/digital_glyph_white.webp"
                                        alt="WhatsApp"
                                        className="w-4 h-4 md:w-5 md:h-5 object-contain relative z-10"
                                    />
                                    <span className="relative z-10 font-medium">Compre pelo WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Linha decorativa inferior - hidden on mobile */}
                        <div className={`hidden md:block absolute bottom-0 ${reversed ? 'left-16' : 'right-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'r' : 'l'} from-transparent via-[#78877a] to-transparent`}></div>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Cores Disponíveis */}
            <AnimatePresence>
                {showColorModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => React.startTransition(() => setShowColorModal(false))}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e8e6e3] relative max-h-[85vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => React.startTransition(() => setShowColorModal(false))}
                                className="absolute top-4 right-4 p-2 text-[#78877a] hover:text-[#3f4d41] transition-colors rounded-full hover:bg-black/5"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-5">
                                <h4
                                    className="text-2xl font-serif text-[#3f4d41] tracking-tight mb-1"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Cores do Acervo
                                </h4>
                                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-2" />
                                {modalSubtitle && (
                                    <p className="text-xs text-[#78877a] font-light italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {modalSubtitle}
                                    </p>
                                )}
                                <p className="text-xs text-[#a9b4aa] font-light mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Consulte a disponibilidade de cada cor no atendimento do WhatsApp.
                                </p>
                            </div>

                            {/* Lista de Cores com Scroll */}
                            <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-2 max-h-[50vh]">
                                {colorsList.map((color) => (
                                    <div
                                        key={color.id}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#faf9f7] transition-colors border border-transparent hover:border-[#e8e6e3]"
                                    >
                                        <img
                                            src={color.imageSrc}
                                            alt={color.name}
                                            className="w-10 h-10 rounded-full object-cover shadow-xs border border-white"
                                        />
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-[#3f4d41]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                {color.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 mt-4 border-t border-[#e8e6e3]">
                                <a
                                    href={`https://wa.me/5521965672034?text=${encodeURIComponent(`Olá! Gostaria de consultar se há disponibilidade da cor para o modelo *${name}* na promoção do Dia do Consumidor!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 px-4 rounded-full bg-[#3f4d41] hover:bg-[#2d382f] text-white text-xs uppercase tracking-wider font-medium transition-all text-center block"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Consultar Cor no WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Formas de Pagamento */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => React.startTransition(() => setShowPaymentModal(false))}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => React.startTransition(() => setShowPaymentModal(false))}
                                className="absolute top-4 right-4 p-2 text-[#78877a] hover:text-[#3f4d41] transition-colors rounded-full hover:bg-black/5"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-8">
                                <h4 className="text-2xl font-serif text-[#3f4d41] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Formas de Pagamento
                                </h4>
                                <div className="w-12 h-px bg-linear-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-2"></div>
                                <p className="text-xs text-[#78877a] font-light uppercase tracking-widest mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Escolha sua forma de pagamento
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* PIX */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#faf9f7] to-white border border-[#e8e6e3] hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-[#1da851]/10 flex items-center justify-center text-[#1da851]">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <span className="block font-medium text-[#3f4d41]" style={{ fontFamily: "'Poppins', sans-serif" }}>PIX</span>
                                    </div>
                                </div>

                                {/* Cartão de Crédito */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#faf9f7] to-white border border-[#e8e6e3] hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-[#3f4d41]/10 flex items-center justify-center text-[#3f4d41]">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <span className="block font-medium text-[#3f4d41]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cartão de Crédito</span>
                                        <span className="text-xs text-[#78877a]">Parcelamento em até 3x em compras acima de R$ 150 </span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-[11px] text-center text-[#78877a] font-light leading-relaxed uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Entre em contato por meio do WhatsApp para finalizar sua compra
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SaleProductCard;
