import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CreditCard, Smartphone } from 'lucide-react';
import { COLORS_CATALOG } from '../data/colorsCatalog';
import { useBlackFridayStatus } from '../utils/campaignConfig';

// Tabela de referência para cálculo automático de "De / Por" caso originalPrice não seja informado explicitamente
const BLACK_FRIDAY_PRICE_MAP = {
    // Colares (do mais barato para o mais caro)
    'Colar Ainda': { originalPrice: 'R$ 37,00', salePrice: 'R$ 30,00' },
    'Colar Chave': { originalPrice: 'R$ 40,00', salePrice: 'R$ 30,00' },
    'Colar Rastro': { originalPrice: 'R$ 40,00', salePrice: 'R$ 30,00' },
    'Colar Enfim': { originalPrice: 'R$ 45,00', salePrice: 'R$ 35,00' },
    'Colar Fluxo': { originalPrice: 'R$ 45,00', salePrice: 'R$ 35,00' },
    'Colar Traço': { originalPrice: 'R$ 58,00', salePrice: 'R$ 42,00' },
    'Colar Ângulo': { originalPrice: 'R$ 60,00', salePrice: 'R$ 42,00' },
    'Colar Lume': { originalPrice: 'R$ 55,00', salePrice: 'R$ 45,00' },
    'Colar Esfera': { originalPrice: 'R$ 65,00', salePrice: 'R$ 50,00' },
    'Colar Vínculo': { originalPrice: 'R$ 65,00', salePrice: 'R$ 50,00' },
    'Colar Adiante': { originalPrice: 'R$ 65,00', salePrice: 'R$ 55,00' },
    'Colar Eixo': { originalPrice: 'R$ 70,00', salePrice: 'R$ 55,00' },
    'Colar Domo': { originalPrice: 'R$ 75,00', salePrice: 'R$ 57,00' },
    'Colar Velo': { originalPrice: 'R$ 75,00', salePrice: 'R$ 57,00' },
    'Colar Pausa': { originalPrice: 'R$ 75,00', salePrice: 'R$ 60,00' },
    'Colar Inteira': { originalPrice: 'R$ 75,00', salePrice: 'R$ 60,00' },
    'Colar Entre': { originalPrice: 'R$ 78,00', salePrice: 'R$ 63,00' },
    'Colar Margem': { originalPrice: 'R$ 78,00', salePrice: 'R$ 63,00' },
    'Colar Começo': { originalPrice: 'R$ 85,00', salePrice: 'R$ 69,00' },
    // Brincos (do mais barato para o mais caro)
    'Brinco Bae': { originalPrice: 'R$ 30,00', salePrice: 'R$ 25,00' },
    'Brinco Douré': { originalPrice: 'R$ 40,00', salePrice: 'R$ 32,00' },
    // Pulseira
    'Pulseira Elo': { originalPrice: 'R$ 50,00', salePrice: 'R$ 40,00' }
};

/* Fita Esqueumórfica Realista (Textura de Gorgurão/Cetim + Volume 3D + Filete Metálico + Sombra Física) */
const SkeuomorphicRibbon = ({ angle = 24, isTopRibbon = true, compact = false }) => (
    <div
        className="absolute select-none pointer-events-none transition-transform duration-300"
        style={{
            width: '720px',
            left: '-360px',
            top: '-18px',
            transform: `rotate(${angle}deg) scale(${compact ? 0.68 : 1})`,
            zIndex: isTopRibbon ? 2 : 1,
            /* Sombra física em múltiplas camadas (contato + difusão) sem nunca ser cortada */
            boxShadow: isTopRibbon
                ? '0 10px 22px rgba(0, 0, 0, 0.85), 0 3px 6px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.9)'
                : '0 6px 14px rgba(0, 0, 0, 0.75), 0 2px 4px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.9)',
            /* Textura de trama de fita de gorgurão combinada com iluminação cilíndrica 3D */
            backgroundImage: `
                repeating-linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.03) 0px,
                    rgba(255, 255, 255, 0.03) 1px,
                    rgba(0, 0, 0, 0.18) 1px,
                    rgba(0, 0, 0, 0.18) 3px
                ),
                linear-gradient(
                    180deg,
                    #2c2c2c 0%,
                    #151515 18%,
                    #0a0a0a 50%,
                    #141414 82%,
                    #262626 100%
                )
            `,
            borderTop: '1px solid #050505',
            borderBottom: '1px solid #050505',
            padding: '3px 0'
        }}
    >
        {/* Brilho especular central da fita de cetim (luz batendo na curvatura da fita) */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: isTopRibbon
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.09) 38%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 62%, rgba(0,0,0,0.55) 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.65) 50%, rgba(255,255,255,0.05) 65%, rgba(0,0,0,0.65) 100%)'
            }}
        />

        {/* Filete / Pesponto metálico interno superior e inferior da fita */}
        <div
            className="relative py-1 flex items-center justify-center whitespace-nowrap"
            style={{
                borderTop: isTopRibbon
                    ? '1px solid rgba(255, 255, 255, 0.48)'
                    : '1px solid rgba(255, 255, 255, 0.30)',
                borderBottom: isTopRibbon
                    ? '1px solid rgba(255, 255, 255, 0.42)'
                    : '1px solid rgba(255, 255, 255, 0.26)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.8)'
            }}
        >
            <div
                className="flex items-center justify-center tracking-[0.18em] text-[10px] sm:text-[11px] uppercase"
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    opacity: isTopRibbon ? 0.98 : 0.78,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.95), 0 -0.5px 0 rgba(255, 255, 255, 0.25)'
                }}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="inline-flex items-center">
                        <strong className="font-extrabold text-[#f5f5f5]">BLACK</strong>
                        <span className="font-normal text-[#e0e0e0] ml-1">FRIDAY</span>
                        <span className="mx-2 sm:mx-2.5 text-[#d4d4d4] text-[9px]">•</span>
                    </span>
                ))}
            </div>
        </div>
    </div>
);

// Mapa por produto (Colares) e por índice de foto indicando qual fita precisa ser diminuída/recuada
// para nunca tampar o colar ou o pingente na foto
const NECKLACE_RIBBON_COMPACT_MAP = {
    'Colar Ainda': [
        { topCompact: false, bottomCompact: false }, // Foto 1: colar no centro, cantos livres
        { topCompact: false, bottomCompact: true }   // Foto 2: pontas douradas próximas à base
    ],
    'Colar Enfim': [
        { topCompact: false, bottomCompact: true },  // Foto 1: flor dourada na parte inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: ponteiras no canto inferior direito
    ],
    'Colar Agora': [
        { topCompact: false, bottomCompact: true },  // Foto 1: coração dourado na parte inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: aro amplo e coração na base
    ],
    'Colar Adiante': [
        { topCompact: false, bottomCompact: false }, // Foto 1: colar no centro
        { topCompact: true, bottomCompact: true }    // Foto 2: coração dourado no canto inferior direito
    ],
    'Colar Inteira': [
        { topCompact: false, bottomCompact: true },  // Foto 1: fecho dourado na parte inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: fecho dourado na base
    ],
    'Colar Pausa': [
        { topCompact: false, bottomCompact: true },  // Foto 1: pingente longo na parte inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: fecho e corrente no canto inferior direito
    ],
    'Colar Entre': [
        { topCompact: false, bottomCompact: true },  // Foto 1: pingente quadrado colado na borda inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: pingente quadrado na base
    ],
    'Colar Margem': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar verde na borda inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: aro circular próximo às bordas
    ],
    'Colar Começo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar preto e esferas no canto inferior esquerdo
        { topCompact: false, bottomCompact: true }   // Foto 2: esferas no canto inferior esquerdo
    ],
    // Coleções Anteriores (Colares)
    'Colar Rastro': [
        { topCompact: false, bottomCompact: false }, // Foto 1: colar centralizado
        { topCompact: false, bottomCompact: true }   // Foto 2: pedra verde próxima à base
    ],
    'Colar Fluxo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: medalha dourada na parte inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: medalha dourada na borda inferior
    ],
    'Colar Traço': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar laranja colado na borda inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: aro laranja amplo
    ],
    'Colar Ângulo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar bordô na borda inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: tubo dourado na base
    ],
    'Colar Vínculo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: estrela do mar na parte inferior
        { topCompact: true, bottomCompact: true }    // Foto 2: estrela do mar no canto inferior esquerdo
    ],
    'Colar Eixo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: medalha dourada na borda inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: medalha dourada na base
    ],
    'Colar Domo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar marrom na parte inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: peça de resina na base
    ],
    'Colar Velo': [
        { topCompact: false, bottomCompact: true },  // Foto 1: nós e tubo azul na borda inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: nó direito e tubo na base
    ],
    'Colar Lume': [
        { topCompact: false, bottomCompact: false }, // Foto 1: colar alto, cantos livres
        { topCompact: false, bottomCompact: true }   // Foto 2: peça preta na base
    ],
    'Colar Esfera': [
        { topCompact: false, bottomCompact: true },  // Foto 1: colar verde na parte inferior
        { topCompact: false, bottomCompact: true }   // Foto 2: colares coloridos no canto inferior direito
    ],
    'Colar Chave': [
        { topCompact: false, bottomCompact: true },  // Foto 1: ponteira dourada no canto inferior esquerdo
        { topCompact: false, bottomCompact: true }   // Foto 2: ponteira dourada na base
    ]
};

const ProductCard = ({
    id,
    name,
    description,
    modalSubtitle,
    price,
    originalPrice,
    salePrice,
    imageSrc,
    mobileImageSrc,
    badgeText,
    reversed = false,
    onImageError,
    colorOptions = [],
    isOutOfStock = false,
    imageClass = "object-center"
}) => {
    const { isBlackFridayActive } = useBlackFridayStatus();
    const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const isAnimating = React.useRef(false);

    const descString = Array.isArray(description) ? description.join('\n') : (description || '');
    const cleanDescription = descString.replace(/Outras opções de cores disponíveis/g, "").trim();

    // Resolve as cores do catálogo
    const colorsList = colorOptions.map(colorId => COLORS_CATALOG[colorId]).filter(Boolean);
    const hasColorOptions = colorsList.length > 0;

    // Resolve preços De / Por da Black Friday (ou preço original quando a campanha encerrar)
    const mappedPrices = BLACK_FRIDAY_PRICE_MAP[name];
    const resolvedOriginalPrice = originalPrice || (mappedPrices ? mappedPrices.originalPrice : null);
    const resolvedSalePrice = salePrice || (mappedPrices ? mappedPrices.salePrice : price);
    const normalDisplayPrice = resolvedOriginalPrice || price;

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

    const currentImage = images[currentIndex];

    // Verifica se o colar atual requer redução/recuo em alguma das fitas para não cobrir a peça
    const necklaceRibbonRules = NECKLACE_RIBBON_COMPACT_MAP[name];
    const currentRibbonRule = necklaceRibbonRules
        ? (necklaceRibbonRules[currentIndex] || necklaceRibbonRules[necklaceRibbonRules.length - 1])
        : { topCompact: false, bottomCompact: false };
    const isTopRibbonCompact = Boolean(currentRibbonRule.topCompact);
    const isBottomRibbonCompact = Boolean(currentRibbonRule.bottomCompact);

    // Mensagem do WhatsApp (com referência à Black Friday enquanto ativa, e original após encerrar)
    const whatsappMessage = isBlackFridayActive
        ? (resolvedOriginalPrice
            ? `Oi! Vi a promoção de Black Friday no site e gostaria de garantir o modelo *${name}* por *${resolvedSalePrice}* (De ${resolvedOriginalPrice}). Poderia me informar a disponibilidade?`
            : `Oi! Poderia me informar detalhes desse modelo na Black Friday? Achei ele incrível *${name}*`)
        : `Oi! Poderia me informar detalhes desse modelo? Achei ele incrível *${name}*`;

    return (
        <>
            {/* PRÉ-CARREGAMENTO (evita piscada da segunda foto) */}
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
                className="rounded-3xl overflow-hidden border relative shadow-2xl"
                style={
                    isBlackFridayActive
                        ? {
                            background: 'linear-gradient(145deg, #171e19 0%, #111613 100%)',
                            borderColor: '#26312a',
                            boxShadow: '0 20px 42px -12px rgba(20, 26, 22, 0.22), 0 4px 14px -2px rgba(20, 26, 22, 0.10)'
                        }
                        : {
                            background: 'linear-gradient(to bottom right, #ffffff, #faf9f7)',
                            borderColor: '#e8e6e3'
                        }
                }
            >
                {/* Container principal */}
                <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                    {/* Imagem */}
                    <div
                        className={`lg:w-[60%] relative overflow-hidden ${isBlackFridayActive ? 'bg-[#121714]' : 'bg-[#f3f2f0]'} group self-stretch flex flex-col justify-center min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] aspect-[4/5] lg:aspect-[4/5]`}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className={`absolute inset-0 bg-linear-to-br ${isBlackFridayActive ? 'from-black/15' : 'from-black/5'} to-transparent z-10 pointer-events-none`}></div>

                        {/* ══════════════════════════════════════════════════════════════════════════
                            FITAS ESQUEUMÓRFICAS CRUZADAS NOS CANTOS DA IMAGEM DO PRODUTO
                            Exibidas exclusivamente durante a campanha de Black Friday!
                        ══════════════════════════════════════════════════════════════════════════ */}
                        {isBlackFridayActive && !isOutOfStock && (
                            <>
                                {/* Canto Superior da Imagem (oposto ao badge da coleção) */}
                                <div
                                    className="absolute pointer-events-none z-25 transition-all duration-300"
                                    style={{
                                        top: isTopRibbonCompact ? '30px' : '64px',
                                        ...(reversed
                                            ? { left: isTopRibbonCompact ? '42px' : '90px' }
                                            : { right: isTopRibbonCompact ? '42px' : '90px' }),
                                        width: 0,
                                        height: 0
                                    }}
                                    aria-hidden="true"
                                >
                                    <SkeuomorphicRibbon angle={reversed ? -46 : 46} isTopRibbon={false} compact={isTopRibbonCompact} />
                                    <SkeuomorphicRibbon angle={reversed ? -21 : 21} isTopRibbon={true} compact={isTopRibbonCompact} />
                                </div>

                                {/* Canto Inferior da Imagem (reduz apenas quando o colar/pingente chega perto do canto inferior) */}
                                <div
                                    className="absolute pointer-events-none z-25 transition-all duration-300"
                                    style={{
                                        bottom: isBottomRibbonCompact ? '26px' : '58px',
                                        ...(reversed
                                            ? { right: isBottomRibbonCompact ? '42px' : '90px' }
                                            : { left: isBottomRibbonCompact ? '42px' : '90px' }),
                                        width: 0,
                                        height: 0
                                    }}
                                    aria-hidden="true"
                                >
                                    <SkeuomorphicRibbon angle={reversed ? -44 : 44} isTopRibbon={false} compact={isBottomRibbonCompact} />
                                    <SkeuomorphicRibbon angle={reversed ? -19 : 19} isTopRibbon={true} compact={isBottomRibbonCompact} />
                                </div>
                            </>
                        )}

                        {/* Animação de transição entre imagens */}
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
                                drag={images.length > 1 ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.7}
                                onDragEnd={(_, info) => {
                                    const swipeThreshold = 50;
                                    if (info.offset.x < -swipeThreshold) {
                                        nextImage();
                                    } else if (info.offset.x > swipeThreshold) {
                                        prevImage();
                                    }
                                }}
                                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
                            >
                                <picture className="pointer-events-none select-none w-full h-full block">
                                    {mobileImageSrc && currentIndex === 0 && <source media="(max-width: 768px)" srcSet={mobileImageSrc} />}
                                    <img
                                        src={currentImage}
                                        alt={`${name} - Joia Exclusiva`}
                                        className={`w-full h-full object-cover pointer-events-none block ${Array.isArray(imageClass) ? (imageClass[currentIndex] || imageClass[0]) : imageClass}`}
                                        onError={onImageError}
                                        loading="lazy"
                                    />
                                </picture>
                            </motion.div>
                        </AnimatePresence>

                        {/* Setas de Navegação */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="btn-track-gallery-arrow absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full backdrop-blur-md text-[#faf9f7] border border-white/15 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                    style={{ backgroundColor: 'rgba(14, 18, 15, 0.80)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(23, 30, 25, 0.95)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(14, 18, 15, 0.80)'; }}
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="btn-track-gallery-arrow absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full backdrop-blur-md text-[#faf9f7] border border-white/15 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                    style={{ backgroundColor: 'rgba(14, 18, 15, 0.80)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(23, 30, 25, 0.95)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(14, 18, 15, 0.80)'; }}
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={22} />
                                </button>

                                {/* Indicadores (Pontos) */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Apenas o Badge da Coleção */}
                        {badgeText && !isOutOfStock && (
                            <div className={`absolute top-4 md:top-6 ${reversed ? 'right-4 md:right-6' : 'left-4 md:left-6'} z-30`}>
                                <span
                                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-semibold tracking-wider uppercase"
                                    style={{
                                        backgroundColor: 'rgba(250, 249, 247, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#3f4d41'
                                    }}
                                >
                                    {badgeText}
                                </span>
                            </div>
                        )}

                        {isOutOfStock && (
                            <div className={`absolute top-4 md:top-6 ${reversed ? 'right-4 md:right-6' : 'left-4 md:left-6'} z-30`}>
                                <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-semibold tracking-wider uppercase" style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#ffffff'
                                }}>
                                    Esgotado no momento
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo */}
                    <div className="lg:w-[40%] p-6 md:p-10 lg:p-14 flex flex-col justify-center relative">
                        {/* Linha decorativa superior */}
                        <div className={`hidden md:block absolute top-0 ${reversed ? 'right-16' : 'left-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'l' : 'r'} from-transparent ${isBlackFridayActive ? 'via-[#b5c2b7]/50' : 'via-[#78877a]'} to-transparent`}></div>

                        <div className="space-y-4 md:space-y-6 relative z-10">
                            {/* Nome do produto */}
                            <div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-2 md:mb-3 tracking-tight" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    letterSpacing: '-0.02em',
                                    color: isBlackFridayActive ? '#faf9f7' : '#3f4d41'
                                }}>
                                    {name}
                                </h3>
                                <div className={`w-16 md:w-20 h-px bg-linear-to-r ${isBlackFridayActive ? 'from-[#d4886a]' : 'from-[#78877a]'} to-transparent`}></div>
                            </div>

                            {/* Descrição */}
                            {cleanDescription && (
                                <p className="leading-relaxed text-base md:text-lg font-light tracking-wide" style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    lineHeight: '1.8',
                                    color: isBlackFridayActive ? '#c7d2c9' : '#78877a',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {cleanDescription}
                                </p>
                            )}

                            {/* Botão de Cores */}
                            {hasColorOptions && (
                                <div className="pt-2 pb-1">
                                    <button
                                        onClick={() => React.startTransition(() => setShowColorModal(true))}
                                        className={`group flex flex-row items-center gap-3 px-5 py-2.5 text-sm font-medium tracking-wide border rounded-full transition-all duration-300 shadow-sm hover:shadow-md w-fit cursor-pointer ${
                                            isBlackFridayActive
                                                ? 'border-[#2b3830] hover:border-[#b5c2b7] hover:bg-[#1e2721] bg-[#161d18]'
                                                : 'border-[#e8e6e3] hover:border-[#78877a] hover:bg-[#faf9f7] bg-white'
                                        }`}
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            color: isBlackFridayActive ? '#e2ebe4' : '#566658'
                                        }}
                                    >
                                        <div className="flex -space-x-2">
                                            {colorsList.slice(0, 3).map((color, idx) => (
                                                <img
                                                    key={color.id}
                                                    src={color.imageSrc}
                                                    alt={color.name}
                                                    className={`w-5 h-5 rounded-full shadow-inner border ${isBlackFridayActive ? 'border-[#161d18]' : 'border-white'} group-hover:scale-110 transition-transform object-cover`}
                                                    style={{ zIndex: 10 - idx }}
                                                />
                                            ))}
                                        </div>
                                        Cores Disponíveis
                                    </button>
                                </div>
                            )}

                            {/* Preço */}
                            <div className="pt-4 md:pt-6" style={{ borderTop: isBlackFridayActive ? '1px solid #26312a' : '1px solid #e8e6e3' }}>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-xs md:text-sm font-light uppercase tracking-wider" style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: isBlackFridayActive ? '#9fb0a2' : '#a9b4aa'
                                    }}>
                                        Investimento
                                    </span>
                                </div>

                                <div className="mt-2 text-left flex flex-wrap items-baseline gap-3">
                                    <span className="text-3xl md:text-4xl lg:text-5xl font-serif" style={{
                                        fontFamily: "'Playfair Display', serif",
                                        color: isOutOfStock
                                            ? (isBlackFridayActive ? '#78877a' : '#a9b4aa')
                                            : (isBlackFridayActive ? '#faf9f7' : '#3f4d41'),
                                        textDecoration: isOutOfStock ? 'line-through' : 'none'
                                    }}>
                                        {isBlackFridayActive ? resolvedSalePrice : normalDisplayPrice}
                                    </span>

                                    {isBlackFridayActive && !isOutOfStock && resolvedOriginalPrice && (
                                        <span
                                            className="text-base md:text-lg font-light line-through"
                                            style={{
                                                fontFamily: "'Playfair Display', serif",
                                                color: '#8fa092'
                                            }}
                                        >
                                            {resolvedOriginalPrice}
                                        </span>
                                    )}

                                    {isOutOfStock && (
                                        <span className="text-sm md:text-base font-medium italic" style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            color: isBlackFridayActive ? '#f87171' : '#ef4444'
                                        }}>
                                            Reposição em breve
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Formas de pagamento */}
                            <div className="-mt-2 mb-2">
                                <button
                                    onClick={() => React.startTransition(() => setShowPaymentModal(true))}
                                    className={`text-[10px] md:text-xs uppercase tracking-widest font-medium border-b transition-all pb-0.5 w-fit cursor-pointer ${
                                        isBlackFridayActive
                                            ? 'border-[#b5c2b7]/30 hover:border-[#faf9f7]'
                                            : 'border-[#a9b4aa]/30 hover:border-[#3f4d41]'
                                    }`}
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: isBlackFridayActive ? '#b5c2b7' : '#a9b4aa'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = isBlackFridayActive ? '#faf9f7' : '#3f4d41'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = isBlackFridayActive ? '#b5c2b7' : '#a9b4aa'; }}
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
                                    className="btn-whatsapp-buy group relative px-6 py-3 md:px-8 md:py-3 font-medium tracking-wider uppercase text-xs md:text-sm rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 md:gap-3 w-fit mx-auto lg:mx-0"
                                    style={{
                                        background: 'linear-gradient(to right, #1DA851, #25D366)',
                                        color: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to right, #25D366, #4ADE80)';
                                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 211, 102, 0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(to right, #1DA851, #25D366)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <img src="/assets/logo/digital_glyph_white.webp" alt="WhatsApp" className="w-4 h-4 md:w-5 md:h-5 object-contain relative z-10" />
                                    <span className="relative z-10">{isOutOfStock ? 'Consultar Reposição' : 'Compre pelo WhatsApp'}</span>
                                </a>
                            </div>
                        </div>

                        {/* Linha decorativa inferior */}
                        <div className={`hidden md:block absolute bottom-0 ${reversed ? 'left-16' : 'right-16'} w-16 h-0.5 bg-gradient-to-${reversed ? 'r' : 'l'} from-transparent ${isBlackFridayActive ? 'via-[#b5c2b7]/50' : 'via-[#78877a]'} to-transparent`}></div>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Cores (Tema Escuro) */}
            <AnimatePresence>
                {showColorModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => React.startTransition(() => setShowColorModal(false))}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#151c17]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-[#2b3830] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => React.startTransition(() => setShowColorModal(false))}
                                className="absolute top-4 right-4 p-2 text-[#b5c2b7] hover:text-[#faf9f7] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-6">
                                <h4 className="text-2xl font-serif text-[#faf9f7] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Cores Disponíveis
                                </h4>
                                <div className="w-12 h-px bg-linear-to-r from-transparent via-[#d4886a] to-transparent mx-auto mb-2"></div>
                                {modalSubtitle && (
                                    <p className="text-sm text-[#c7d2c9] font-light italic mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        {modalSubtitle}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-2 overscroll-contain custom-scrollbar">
                                {colorsList.map(color => (
                                    <div key={color.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#1c251f] border border-[#2b3830] hover:border-[#78877a] transition-all">
                                        <img
                                            src={color.imageSrc}
                                            alt={color.name}
                                            className="w-12 h-12 rounded-full shadow-sm border border-[#2b3830] object-cover cursor-zoom-in hover:scale-110 transition-transform duration-300 shrink-0"
                                            onClick={() => setExpandedImage(color.imageSrc)}
                                        />
                                        <div className="flex-1 pr-2">
                                            <span className="block font-medium text-[#faf9f7] text-base leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                {color.name}
                                            </span>
                                        </div>
                                        <button
                                            className="text-[#b5c2b7] hover:text-[#faf9f7] transition-colors shrink-0 p-1 cursor-pointer"
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
                            <p className="mt-6 text-xs text-center text-[#c7d2c9] font-light leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 bg-black/85 backdrop-blur-md"
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
                                className="absolute top-0 right-0 md:-right-12 md:-top-12 z-10 p-3 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
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
                                style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.6))' }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Formas de Pagamento (Tema Escuro) */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => React.startTransition(() => setShowPaymentModal(false))}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#151c17]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-[#2b3830] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => React.startTransition(() => setShowPaymentModal(false))}
                                className="absolute top-4 right-4 p-2 text-[#b5c2b7] hover:text-[#faf9f7] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-8">
                                <h4 className="text-2xl font-serif text-[#faf9f7] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Formas de Pagamento
                                </h4>
                                <div className="w-12 h-px bg-linear-to-r from-transparent via-[#d4886a] to-transparent mx-auto mb-2"></div>
                                <p className="text-xs text-[#c7d2c9] font-light uppercase tracking-widest mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Escolha sua forma de pagamento
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* PIX */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1c251f] border border-[#2b3830] hover:border-[#78877a] transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#4ADE80]">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <span className="block font-medium text-[#faf9f7]" style={{ fontFamily: "'Poppins', sans-serif" }}>PIX</span>
                                    </div>
                                </div>

                                {/* Cartão de Crédito */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1c251f] border border-[#2b3830] hover:border-[#78877a] transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-[#d4886a]/15 flex items-center justify-center text-[#d4886a]">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <span className="block font-medium text-[#faf9f7]" style={{ fontFamily: "'Poppins', sans-serif" }}>Cartão de Crédito</span>
                                        <span className="text-xs text-[#c7d2c9]">Parcelamento em até 3x em compras acima de R$ 150</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-[11px] text-center text-[#b5c2b7] font-light leading-relaxed uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Entre em contato por meio do WhatsApp para finalizar sua compra
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;
