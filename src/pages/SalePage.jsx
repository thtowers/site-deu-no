import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ElegantDivider from '../components/ElegantDivider';
import SaleCountdown from '../components/SaleCountdown';
import SaleProductCard from '../components/SaleProductCard';
import { SALE_PRODUCTS } from '../data/saleProducts';

const SalePage = () => {

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>

            {/* Barra de Aviso Superior (Top Announcement) */}
            <div
                className="w-full py-2.5 px-4 text-center text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 relative z-50 text-white"
                style={{
                    background: 'linear-gradient(90deg, #3f4d41 0%, #4a5c4d 50%, #3f4d41 100%)',
                    fontFamily: "'Poppins', sans-serif"
                }}
            >
                <Sparkles size={14} className="text-[#c97d60] animate-pulse" />
                <span>
                    Especial Dia do Consumidor • 14 e 15 de Setembro • Peças Selecionadas
                </span>
                <Sparkles size={14} className="text-[#c97d60] animate-pulse" />
            </div>

            {/* Header da Marca */}
            <Header />

            <main>
                {/* Hero Editorial — Dia do Consumidor */}
                <section className="pt-12 pb-16 md:pt-16 md:pb-24 relative overflow-hidden">

                    {/* Gradiente de Fundo Sutil */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(120,135,122,0.12) 0%, transparent 70%)'
                        }}
                    />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        {/* Linha decorativa superior */}
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-6" />

                        {/* Selo da Campanha */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border shadow-2xs"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                borderColor: 'rgba(120, 135, 122, 0.25)'
                            }}
                        >
                            <Tag size={13} className="text-[#c97d60]" />
                            <span
                                className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#3f4d41]"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Especial Dia do Consumidor
                            </span>
                        </motion.div>

                        {/* Título Principal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-5"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '-0.02em',
                                color: '#3f4d41'
                            }}
                        >
                            O Resgate do Inesquecível
                        </motion.h1>

                        {/* Linha decorativa */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="w-24 h-px mx-auto my-5"
                            style={{ background: 'linear-gradient(to right, transparent, #78877a, transparent)' }}
                        />

                        {/* Subtítulo com Storytelling e Urgência */}
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed text-[#78877a] px-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Para celebrar quem dá vida à nossa história, abrimos o acervo das nossas peças mais queridas com valores promocionais únicos. São <strong>últimas unidades artesanais</strong> que não voltarão mais ao catálogo.
                        </motion.p>

                        {/* Cronômetro Regressivo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <SaleCountdown />
                        </motion.div>

                        {/* Botão de Rolagem Suave */}
                        <div className="mt-4">
                            <a
                                href="#produtos-sale"
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-[#3f4d41] hover:text-[#78877a] transition-colors border-b border-[#3f4d41]/30 pb-1"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Explorar Peças da Promoção
                                <ArrowRight size={13} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Vitrine de Produtos da Sale */}
                <section id="produtos-sale" className="py-12 md:py-20">
                    <div className="container mx-auto px-4">

                        <div className="text-center mb-12 md:mb-16">
                            <span
                                className="text-xs uppercase tracking-[0.3em] font-medium text-[#a9b4aa] block mb-2"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Acervo Especial
                            </span>
                            <h2
                                className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#3f4d41] mb-3"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Peças Selecionadas
                            </h2>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-4" />
                            <p
                                className="max-w-xl mx-auto text-sm sm:text-base font-light text-[#78877a]"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Escolha sua peça favorita e clique para falar conosco no WhatsApp. Por ser um lote artesanal promocional, a prioridade é por ordem de mensagem.
                            </p>
                        </div>

                        {/* Lista dos Produtos Promocionais */}
                        <div>
                            {SALE_PRODUCTS.map((product, index) => (
                                <React.Fragment key={product.id}>
                                    <SaleProductCard
                                        id={product.id}
                                        name={product.name}
                                        collection={product.collection}
                                        description={product.description}
                                        modalSubtitle={product.modalSubtitle}
                                        originalPrice={product.originalPrice}
                                        salePrice={product.salePrice}
                                        badgeUrgency={product.badgeUrgency}
                                        imageSrc={product.imageSrc}
                                        mobileImageSrc={product.mobileImageSrc}
                                        reversed={product.reversed}
                                        colorOptions={product.colorOptions}
                                        imageClass={product.imageClass}
                                    />
                                    {index < SALE_PRODUCTS.length - 1 && <ElegantDivider />}
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </section>

            </main>

            {/* Rodapé da Marca */}
            <Footer />
        </div>
    );
};

export default SalePage;
