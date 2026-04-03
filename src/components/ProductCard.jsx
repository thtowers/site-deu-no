import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const ProductCard = ({
    id,
    name,
    description,
    price,
    imageSrc,
    mobileImageSrc,
    badgeText,
    reversed = false,
    onImageError
}) => {
    // Garantir que imageSrc seja sempre um array para facilitar a lógica
    const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentImage = images[currentIndex];
    const fullImageUrl = currentImage?.startsWith('http') ? currentImage : `${baseUrl}${currentImage}`;
    const whatsappMessage = `Olá! Tenho interesse no produto ${name} (${price}).\n\n${description}\n\nImagem: ${encodeURI(fullImageUrl)}`;

    return (
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
            <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                {/* Imagem */}
                <div 
                    className="lg:w-1/2 relative overflow-hidden bg-[#f3f2f0] group self-stretch flex flex-col justify-center"
                    style={{ touchAction: 'pan-y' }}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent z-10 pointer-events-none"></div>
                    
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            onDragEnd={(_, info) => {
                                const swipeThreshold = 50;
                                if (info.offset.x < -swipeThreshold) {
                                    nextImage({ preventDefault: () => {}, stopPropagation: () => {} });
                                } else if (info.offset.x > swipeThreshold) {
                                    prevImage({ preventDefault: () => {}, stopPropagation: () => {} });
                                }
                            }}
                            className="w-full h-auto cursor-grab active:cursor-grabbing touch-none"
                        >
                            <picture className="pointer-events-none select-none w-full h-full block">
                                {mobileImageSrc && currentIndex === 0 && <source media="(max-width: 768px)" srcSet={mobileImageSrc} />}
                                <img
                                    src={currentImage}
                                    alt={`${name} - Joia Exclusiva`}
                                    className="w-full h-auto object-cover pointer-events-none block"
                                    onError={onImageError}
                                />
                            </picture>
                        </motion.div>
                    </AnimatePresence>

                    {/* Setas de Navegação */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft size={24} />
                            </button>
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
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                            idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'
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
                            {description}
                        </p>

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

                        {/* Botão elegante */}
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
                                <img src="/Logo/Digital_Glyph_White.png" alt="WhatsApp" className="w-4 h-4 md:w-5 md:h-5 object-contain relative z-10" />
                                <span className="relative z-10">Compre pelo WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Linha decorativa inferior - hidden on mobile */}
                    <div className={`hidden md:block absolute bottom-0 ${reversed ? 'left-16' : 'right-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'r' : 'l'} from-transparent via-[#78877a] to-transparent`}></div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;