import React from 'react';
import { motion } from 'framer-motion';


const ProductCard = ({
    name,
    description,
    price,
    imageSrc,
    mobileImageSrc,
    badgeText,
    reversed = false,
    onImageError
}) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullImageUrl = imageSrc?.startsWith('http') ? imageSrc : `${baseUrl}${imageSrc}`;
    const whatsappMessage = `Olá! Tenho interesse no produto ${name} (${price}).\n\n${description}\n\nImagem: ${encodeURI(fullImageUrl)}`;

    return (
        <motion.div
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
            <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                {/* Imagem */}
                <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent z-10"></div>
                    <picture>
                        {mobileImageSrc && <source media="(max-width: 768px)" srcSet={mobileImageSrc} />}
                        <img
                            src={imageSrc}
                            alt={`${name} - Joia Exclusiva`}
                            className="w-full h-full object-cover min-h-[300px] md:min-h-[400px] lg:min-h-[600px]"
                            onError={onImageError}
                        />
                    </picture>
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
                            color: '#78877a'
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