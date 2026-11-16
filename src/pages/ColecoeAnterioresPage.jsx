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

                        {/* 1. Colar Rastro */}
                        <ProductCard
                            colorOptions={['verde_bandeira', 'azul_marinho', 'caramelo', 'verde_jade']}
                            name="Colar Rastro"
                            description={["Forte, marcante, inesquecível — como você."]}
                            price="R$ 40,00"
                            imageSrc={["/assets/produtos/rastro.webp", "/assets/produtos/rastro2.webp", "/assets/produtos/rastro3.webp"]}
                            mobileImageSrc="/assets/produtos/rastro.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
                            imageClass="object-center lg:object-bottom"
                        />

                        <ElegantDivider />

                        {/* 2. Colar Fluxo */}
                        <ProductCard
                            colorOptions={['preto_dourado', 'prata_e_dourado']}
                            name="Colar Fluxo"
                            description={["Um colar, infinitas versões de você"]}
                            price="R$ 45,00"
                            imageSrc={["/assets/produtos/Fluxo4.webp", "/assets/produtos/Fluxo5.webp", "/assets/produtos/fluxo3.webp"]}
                            mobileImageSrc="/assets/produtos/Fluxo4.webp"
                            badgeText="Coleção Âmago"
                            reversed={true}
                            imageClass="object-bottom"
                        />

                        <ElegantDivider />

                        {/* 3. Colar Traço */}
                        <ProductCard
                            colorOptions={['preto', 'terracota', 'marrom']}
                            name="Colar Traço"
                            description={["A força do simples bem definido."]}
                            price="R$ 58,00"
                            imageSrc={["/assets/produtos/traco.webp", "/assets/produtos/traco2.webp", "/assets/produtos/traco3.webp", "/assets/produtos/traco4.webp", "/assets/produtos/traco5.webp"]}
                            mobileImageSrc="/assets/produtos/traco.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
                            imageClass={["object-bottom", "object-bottom lg:object-center"]}
                        />

                        <ElegantDivider />

                        {/* 4. Colar Ângulo */}
                        <ProductCard
                            colorOptions={['bordo_sf', 'azul_marinho_sf', 'bege_natural_sf', 'marrom_sf', 'preto_sf', 'turquesa_sf']}
                            name="Colar Ângulo"
                            description={["Impacto sutil, elegância absoluta."]}
                            price="R$ 60,00"
                            imageSrc={["/assets/produtos/angulo.webp", "/assets/produtos/angulo2.webp", "/assets/produtos/angulo3.webp", "/assets/produtos/angulo4.webp"]}
                            mobileImageSrc="/assets/produtos/angulo.webp"
                            badgeText="Coleção Âmago"
                            reversed={true}
                            imageClass={["object-bottom lg:object-bottom", "object-bottom lg:object-center", "object-center lg:object-center"]}
                        />

                        <ElegantDivider />

                        {/* 5. Colar Vínculo */}
                        <ProductCard
                            colorOptions={['lenço_azul_bebe', 'lenço_vermelho', 'lenço_preto', 'lenço_branco', 'lenço_vermelho_vivo', 'lenço_bege', 'lenço_marrom_escuro', 'lenço_azul_marinho', 'lenço_verde', 'lenço_verde_escuro']}
                            name="Colar Vínculo"
                            description={["Moderno no design, forte na personalidade."]}
                            price="R$ 65,00"
                            imageSrc={["/assets/produtos/vinculo.webp", "/assets/produtos/vinculo2.webp", "/assets/produtos/vinculo4.webp"]}
                            mobileImageSrc="/assets/produtos/vinculo.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
                            imageClass="object-bottom"
                        />

                        <ElegantDivider />

                        {/* 6. Colar Eixo */}
                        <ProductCard
                            colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade', 'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada']}
                            name="Colar Eixo"
                            description={["O equilíbrio entre quem você é e o que você mostra."]}
                            price="R$ 70,00"
                            imageSrc={["/assets/produtos/eixo.webp", "/assets/produtos/eixo2.webp", "/assets/produtos/eixo3.webp"]}
                            mobileImageSrc="/assets/produtos/eixo.webp"
                            badgeText="Coleção Âmago"
                            reversed={true}
                        />

                        <ElegantDivider />

                        {/* 7. Colar Domo */}
                        <ProductCard
                            colorOptions={['marrom', 'preto', 'terracota', 'areia', 'caramelo', 'verde_militar', 'mostarda']}
                            id="colar-domo"
                            name="Colar Domo"
                            modalSubtitle="Resina na cor Tartaruga"
                            description={["Design moderno com personalidade inconfundível."]}
                            price="R$ 75,00"
                            imageSrc={["/assets/produtos/domo2.webp", "/assets/produtos/domo.webp", "/assets/produtos/domo3.webp"]}
                            mobileImageSrc="/assets/produtos/domo2.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
                        />

                        <ElegantDivider />

                        {/* 8. Colar Velo */}
                        <ProductCard
                            colorOptions={['preto', 'azul_marinho', 'marrom']}
                            name="Colar Velo"
                            description={["Sofisticação que revela sua essência."]}
                            price="R$ 75,00"
                            imageSrc={["/assets/produtos/velo.webp", "/assets/produtos/velo2.webp", "/assets/produtos/velo3.webp", "/assets/produtos/velo4.webp"]}
                            mobileImageSrc="/assets/produtos/velo.webp"
                            badgeText="Coleção Âmago"
                            reversed={true}
                        />

                        <ElegantDivider />

                        {/* 9. Colar Lume */}
                        <ProductCard
                            colorOptions={['verde_militar', 'preto']}
                            name="Colar Lume"
                            description={["Não passa despercebido. Nem tenta."]}
                            price="R$ 55,00"
                            imageSrc={["/assets/produtos/luma4.webp", "/assets/produtos/luma3.webp", "/assets/produtos/lume.webp"]}
                            mobileImageSrc="/assets/produtos/luma4.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
                            imageClass="object-center"
                        />

                        <ElegantDivider />

                        {/* 10. Colar Esfera */}
                        <ProductCard
                            colorOptions={[
                                'areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                                'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                                'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho',
                                'terracota', 'vermelho_figo', 'caramelo', 'chumbo', 'mostarda',
                                'verde_jade', 'preto', 'preto_poa_branco', 'azul_marinho_poa_branco',
                                'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                                'vermelho_poa_azul_marinho'
                            ]}
                            name="Colar Esfera"
                            description={["Um nó, infinitas combinações."]}
                            price="R$ 65,00"
                            imageSrc={["/assets/produtos/esfera.webp", "/assets/produtos/esfera1.webp", "/assets/produtos/esfera2.webp"]}
                            mobileImageSrc="/assets/produtos/esfera.webp"
                            badgeText="Coleção Âmago"
                            reversed={true}
                            imageClass="object-center"
                        />

                        <ElegantDivider />

                        {/* 11. Colar Chave */}
                        <ProductCard
                            colorOptions={[
                                'areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                                'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                                'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho',
                                'terracota', 'vermelho_figo', 'caramelo', 'chumbo', 'mostarda',
                                'verde_jade', 'preto', 'preto_poa_branco', 'azul_marinho_poa_branco',
                                'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                                'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                            ]}
                            name="Colar Chave"
                            description={["Discreto o suficiente para o olhar. Inesquecível para a memória."]}
                            price="R$ 40,00"
                            imageSrc={["/assets/produtos/chave.webp", "/assets/produtos/chave2.webp"]}
                            mobileImageSrc="/assets/produtos/chave.webp"
                            badgeText="Coleção Âmago"
                            reversed={false}
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
