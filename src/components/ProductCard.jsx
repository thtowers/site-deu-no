import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS_CATALOG } from '../data/colorsCatalog';


const ProductCard = ({
    id,
    name,
    description,
    price,
    imageSrc,
    mobileImageSrc,
    badgeText,
    reversed = false,
    onImageError,
    colorOptions = []
}) => {
    // Garantir que imageSrc seja sempre um array para facilitar a lógica
    const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showColorModal, setShowColorModal] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    const descString = Array.isArray(description) ? description.join('\n') : description;
    const cleanDescription = descString.replace(/Outras opções de cores disponíveis/g, "").replace(/\n\s*\n\s*$/, "");

    // Resolve as cores do catálogo
    const colorsList = colorOptions.map(colorId => COLORS_CATALOG[colorId]).filter(Boolean);
    const hasColorOptions = colorsList.length > 0;
    // Função para avançar para a próxima imagem
    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };
    // Função para voltar para a imagem anterior
    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    // URL base
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentImage = images[currentIndex];
    const fullImageUrl = currentImage?.startsWith('http') ? currentImage : `${baseUrl}${currentImage}`;

    // Mensagem do WhatsApp
    const whatsappMessage = `Oi! Poderia me informar detalhes desse modelo? Achei ele incrível ❤️ *${name}*`;

    return (
        <>
            {/* PRÉ-CARREGAMENTO (evita piscada (blink) da segunda foto) */}
            <div className="hidden">
                {images.map((url, idx) => (
                    <img key={idx} src={url} alt="preload" decoding="async" />
                ))}
            </div>

            <motion.div
                id={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-linear-to-br rounded-3xl shadow-2xl overflow-hidden border"
                style={{
                    background: 'linear-gradient(to bottom right, #ffffff, #faf9f7)',
                    borderColor: '#e8e6e3'
                }}
            >
                {/* Container principal */}
                <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                    {/* Imagem */}
                    <div
                        className="lg:w-1/2 relative overflow-hidden bg-[#f3f2f0] group self-stretch flex flex-col justify-center min-h-[350px] sm:min-h-[450px] lg:min-h-0 aspect-[4/5] lg:aspect-auto"
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent z-10 pointer-events-none"></div>

                        {/* Animação de transição entre imagens */}
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                onDragEnd={(_, info) => {
                                    const swipeThreshold = 50;
                                    if (info.offset.x < -swipeThreshold) {
                                        nextImage({ preventDefault: () => { }, stopPropagation: () => { } });
                                    } else if (info.offset.x > swipeThreshold) {
                                        prevImage({ preventDefault: () => { }, stopPropagation: () => { } });
                                    }
                                }}
                                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
                            >
                                <picture className="pointer-events-none select-none w-full h-full block">
                                    {mobileImageSrc && currentIndex === 0 && <source media="(max-width: 768px)" srcSet={mobileImageSrc} />}
                                    <img
                                        src={currentImage}
                                        alt={`${name} - Joia Exclusiva`}
                                        className="w-full h-full object-cover pointer-events-none block"
                                        onError={onImageError}
                                        loading="lazy"
                                    />
                                </picture>
                            </motion.div>
                        </AnimatePresence>

                        {/* Setas de Navegação */}
                        {images.length > 1 && (
                            <>
                                {/* Botão para voltar para a imagem anterior */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                {/* Botão para avançar para a próxima imagem */}
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Indicadores (Pontos) */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {badgeText && (
                            <div className={`absolute top-4 md:top-6 ${reversed ? 'right-4 md:right-6' : 'left-4 md:left-6'} z-20`}>
                                <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-semibold tracking-wider uppercase" style={{
                                    backgroundColor: 'rgba(250, 249, 247, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#3f4d41'
                                }}>
                                    {badgeText}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo */}
                    <div className="lg:w-1/2 p-6 md:p-10 lg:p-16 flex flex-col justify-center relative">
                        {/* Linha decorativa superior - hidden on mobile */}
                        <div className={`hidden md:block absolute top-0 ${reversed ? 'right-16' : 'left-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'l' : 'r'} from-transparent via-[#78877a] to-transparent`}></div>

                        <div className="space-y-4 md:space-y-6">
                            {/* Nome do produto */}
                            <div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-2 md:mb-3 tracking-tight" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    letterSpacing: '-0.02em',
                                    color: '#3f4d41'
                                }}>
                                    {name}
                                </h3>
                                <div className="w-16 md:w-20 h-px bg-linear-to-r from-[#78877a] to-transparent"></div>
                            </div>

                            {/* Descrição */}
                            <p className="leading-relaxed text-base md:text-lg font-light tracking-wide" style={{
                                fontFamily: "'Poppins', sans-serif",
                                lineHeight: '1.8',
                                color: '#78877a',
                                whiteSpace: 'pre-line'
                            }}>
                                {cleanDescription}
                            </p>

                            {/* Botão de Cores */}
                            {hasColorOptions && (
                                <div className="pt-2 pb-1">
                                    <button
                                        onClick={() => setShowColorModal(true)}
                                        className="group flex flex-row items-center gap-3 px-5 py-2.5 text-sm font-medium tracking-wide border border-[#e8e6e3] rounded-full hover:border-[#78877a] hover:bg-[#faf9f7] transition-all duration-300 shadow-sm hover:shadow-md bg-white w-fit"
                                        style={{ fontFamily: "'Poppins', sans-serif", color: '#566658' }}
                                    >
                                        <div className="flex -space-x-2">
                                            {colorsList.slice(0, 3).map((color, idx) => (
                                                <img key={color.id} src={color.imageSrc} alt={color.name} className={`w-5 h-5 rounded-full shadow-inner border border-white group-hover:scale-110 transition-transform object-cover`} style={{ zIndex: 10 - idx }} />
                                            ))}
                                        </div>
                                        Cores Disponíveis
                                    </button>
                                </div>
                            )}

                            {/* Preço */}
                            <div className="pt-4 md:pt-6" style={{ borderTop: '1px solid #e8e6e3' }}>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs md:text-sm font-light uppercase tracking-wider" style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: '#a9b4aa'
                                    }}>
                                        Investimento
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-3xl md:text-4xl lg:text-5xl font-serif" style={{
                                        fontFamily: "'Playfair Display', serif",
                                        color: '#3f4d41'
                                    }}>
                                        {price}
                                    </span>
                                </div>
                            </div>

                            {/* Botão whatsapp */}
                            <div className="pt-3 md:pt-4">
                                <a
                                    href={`https://wa.me/5521965672034?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative px-6 py-3 md:px-8 md:py-3 font-medium tracking-wider uppercase text-xs md:text-sm rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 md:gap-3 w-fit mx-auto lg:mx-0"
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
                                    <img src="/logo/Digital_Glyph_White.webp" alt="WhatsApp" className="w-4 h-4 md:w-5 md:h-5 object-contain relative z-10" />
                                    <span className="relative z-10">Compre pelo WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Linha decorativa inferior - hidden on mobile */}
                        <div className={`hidden md:block absolute bottom-0 ${reversed ? 'left-16' : 'right-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'r' : 'l'} from-transparent via-[#78877a] to-transparent`}></div>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Cores */}
            <AnimatePresence>
                {showColorModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowColorModal(false)}
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
                                onClick={() => setShowColorModal(false)}
                                className="absolute top-4 right-4 p-2 text-[#78877a] hover:text-[#3f4d41] transition-colors rounded-full hover:bg-black/5"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-6">
                                <h4 className="text-2xl font-serif text-[#3f4d41] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Cores Disponíveis
                                </h4>
                                <div className="w-12 h-px bg-linear-to-r from-transparent via-[#78877a] to-transparent mx-auto"></div>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 overscroll-contain custom-scrollbar">
                                {colorsList.map(color => (
                                    <div key={color.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#faf9f7] to-white border border-[#e8e6e3] hover:shadow-md transition-shadow relative">
                                        <img
                                            src={color.imageSrc}
                                            alt={color.name}
                                            className="w-12 h-12 rounded-full shadow-sm border border-white object-cover cursor-zoom-in hover:scale-110 transition-transform duration-300"
                                            onClick={() => setExpandedImage(color.imageSrc)}
                                        />
                                        <div>
                                            <span className="block font-medium text-[#3f4d41] text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>{color.name}</span>
                                            <span className="block text-xs text-[#78877a] font-light mt-0.5">{color.description}</span>
                                        </div>
                                        <button
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a9b4aa] hover:text-[#3f4d41] transition-colors"
                                            onClick={() => setExpandedImage(color.imageSrc)}
                                            title="Ver detalhes"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-sm text-center text-[#78877a] font-light leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Ao encomendar sua peça pelo WhatsApp, informe-nos a cor desejada.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Imagem Ampliada (Zoom) */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
                        onClick={() => setExpandedImage(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl max-h-[90vh] flex justify-center items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setExpandedImage(null)}
                                className="absolute top-0 right-0 md:-right-12 md:-top-12 z-10 p-3 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                aria-label="Fechar"
                            >
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <img
                                src={expandedImage}
                                alt="Detalhe da Cor"
                                className="w-auto h-auto max-w-full max-h-[85vh] object-contain drop-shadow-2xl rounded-full"
                                style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))' }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;