import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ElegantDivider from '../components/ElegantDivider';
import ProductCard from '../components/ProductCard';

const ColecoeAnterioresPage = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
            <Header />

            <main>
                {/* Hero da página */}
                <section
                    className="py-20 md:py-28 lg:py-36 relative overflow-hidden"
                    style={{ backgroundColor: '#faf9f7' }}
                >
                    {/* Ornamento de fundo */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,135,122,0.08) 0%, transparent 70%)'
                        }}
                    />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        {/* Linha decorativa superior */}
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-8" />

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xs uppercase tracking-[0.3em] mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#a9b4aa' }}
                        >
                            Memória &amp; Identidade
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif tracking-tight mb-6"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '-0.02em',
                                color: '#3f4d41'
                            }}
                        >
                            Coleções <span className="italic font-light">Anteriores</span>
                        </motion.h1>

                        {/* Linha decorativa */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="w-24 h-px mx-auto my-6"
                            style={{ background: 'linear-gradient(to right, transparent, #78877a, transparent)' }}
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#78877a' }}
                        >
                            Peças que marcaram momentos, histórias que continuam vivas.
                            Cada coleção nasce de uma intenção — e permanece para sempre.
                        </motion.p>

                        {/* Linha decorativa inferior */}
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mt-8" />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                    SEÇÃO DE PRODUTOS — adicione os ProductCards abaixo
                    Copie o mesmo padrão da ProductsSection.jsx
                ══════════════════════════════════════════════════════ */}
                <section
                    id="colecoes-anteriores-produtos"
                    className="py-8 md:py-12"
                    style={{ backgroundColor: '#faf9f7' }}
                >
                    <div className="container mx-auto px-4">

                        <ProductCard
                            id="Lume"
                            name="Lume"
                            description={["Não passa despercebido. Nem tenta."]}
                            price="R$ 55,00"
                            imageSrc={["/assets/produtos/luma4.webp", "/assets/produtos/luma3.webp", "/assets/produtos/lume.webp"]}
                            mobileImageSrc="/assets/produtos/luma4.webp"
                            colorOptions={['verde_militar', 'preto']}
                            reversed={false}
                            imageClass="object-center"
                        />
                        <ElegantDivider />

                        <ProductCard
                            id="Esfera"
                            name="Esfera"
                            description={["Um nó, infinitas combinações."]}
                            price="R$ 65,00"
                            imageSrc={["/assets/produtos/esfera.webp", "/assets/produtos/esfera1.webp", "/assets/produtos/esfera2.webp"]}
                            mobileImageSrc="/assets/produtos/esfera.webp"
                            colorOptions={[
                                'areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                                'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                                'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho',
                                'terracota', 'vermelho_figo', 'caramelo', 'marrom', 'chumbo', 'mostarda',
                                'verde_jade', 'preto', 'preto_poa_branco', 'azul_marinho_poa_branco',
                                'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                                'vermelho_poa_azul_marinho'
                            ]}
                            badgeText="Coleção Anterior"
                            reversed={true}
                            imageClass="object-center"
                        />

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ColecoeAnterioresPage;
