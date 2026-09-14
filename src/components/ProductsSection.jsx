import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import ElegantDivider from './ElegantDivider';

const ProductsSection = () => {
    const [showPreviousCollections, setShowPreviousCollections] = useState(false);
    const [imageSrc, setImageSrc] = useState("/assets/produtos/rastro.webp");

    const handleImageError = () => {
        // Tenta .webp se .webp falhar (caso você mude o formato depois)
        if (imageSrc.endsWith('.webp')) {
            setImageSrc("/assets/produtos/rastro.webp");
        }
    };

    return (
        <section id="produtos" className="py-12 md:py-16" style={{ backgroundColor: '#faf9f7' }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-block mb-4">
                        <div className="w-12 md:w-16 h-px bg-linear-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-3"></div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif tracking-tight" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em', color: '#3f4d41' }}>
                            Nossos Produtos
                        </h2>
                        <div className="w-12 md:w-16 h-px bg-linear-to-r from-transparent via-[#78877a] to-transparent mx-auto mt-3"></div>
                    </div>
                    <p className="max-w-2xl mx-auto text-base md:text-lg font-light tracking-wide px-4" style={{ fontFamily: "'Poppins', sans-serif", color: '#78877a' }}>
                        Descubra nossa coleção exclusiva feita com carinho e dedicação.
                    </p>
                </div>

                {/* Produto Ainda */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    id="colares"
                    name="Colar Ainda"
                    description={["Ainda existe muito de você pra descobrir."]}
                    price="R$ 37,00"
                    imageSrc={["/assets/produtos/ainda.webp", "/assets/produtos/ainda2.webp"]}
                    mobileImageSrc="/assets/produtos/ainda.webp"
                    badgeText="Coleção Depois"
                    onImageError={handleImageError}
                    reversed={false}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Enfim */}
                <ProductCard
                    colorOptions={['camurca_marrom', 'camurca_caramelo', 'camurca_areia', 'camurca_preto']}
                    name="Colar Enfim"
                    description={["Algumas respostas levam tempo. Enfim, elas chegam."]}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/enfim.webp", "/assets/produtos/enfim2.webp"]}
                    mobileImageSrc="/assets/produtos/enfim.webp"
                    badgeText="Coleção Depois"
                    onImageError={handleImageError}
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Agora */}
                <ProductCard
                    colorOptions={['prata_e_dourado', 'preto_dourado', 'camurca_marrom', 'camurca_caramelo', 'camurca_areia', 'camurca_preto']}
                    name="Colar Agora"
                    description={["O momento certo tem o nome do presente."]}
                    price="R$ 55,00"
                    imageSrc={["/assets/produtos/agora1.webp", "/assets/produtos/agora2.1.webp"]}
                    mobileImageSrc="/assets/produtos/agora1.webp"
                    badgeText="Coleção Depois"
                    reversed={false}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Adiante */}
                <ProductCard
                    colorOptions={['azul_marinho_sf', 'marrom_sf', 'bordo_sf', 'preto_sf', 'bege_natural_sf', 'turquesa_sf']}
                    name="Colar Adiante"
                    description={["Olhe adiante. O passado já cumpriu seu papel."]}
                    price="R$ 65,00"
                    imageSrc={["/assets/produtos/adiante1.webp", "/assets/produtos/adiante2.webp"]}
                    mobileImageSrc="/assets/produtos/adiante1.webp"
                    badgeText="Coleção Depois"
                    reversed={true}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Inteira */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe',
                        'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'azul_petroleo', 'verde_bandeira',
                        'azul_marinho', 'azul_anil', 'azul_royal', 'roxo',
                        'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro',
                        'chumbo', 'mostarda', 'verde_jade', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    name="Colar Inteira"
                    description={["Você nunca precisou ser metade."]}
                    modalSubtitle="Escolha 1 ou até 3 cores"
                    price="R$ 75,00"
                    imageSrc={["/assets/produtos/inteira1.webp", "/assets/produtos/inteira2.webp"]}
                    mobileImageSrc="/assets/produtos/inteira1.webp"
                    badgeText="Coleção Depois"
                    reversed={false}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Pausa */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    name="Colar Pausa"
                    description={["Nem toda pausa interrompe. Algumas transformam."]}
                    price="R$ 75,00"
                    imageSrc={["/assets/produtos/pausa.webp", "/assets/produtos/pausa2.webp"]}
                    mobileImageSrc="/assets/produtos/pausa.webp"
                    badgeText="Coleção Depois"
                    reversed={true}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Entre */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    name="Colar Entre"
                    description={["Entre quem você foi e quem escolheu ser."]}
                    price="R$ 78,00"
                    imageSrc={["/assets/produtos/entre1.webp", "/assets/produtos/entre2.webp"]}
                    mobileImageSrc="/assets/produtos/entre1.webp"
                    badgeText="Coleção Depois"
                    reversed={false}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Margem */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    name="Colar Margem"
                    modalSubtitle="Escolha 1 ou até 2 cores"
                    description={["Foi longe do centro que você encontrou a si mesma."]}
                    price="R$ 78,00"
                    imageSrc={["/assets/produtos/margem1.webp", "/assets/produtos/margem2.webp"]}
                    mobileImageSrc="/assets/produtos/margem1.webp"
                    badgeText="Coleção Depois"
                    reversed={true}
                    imageClass="object-center lg:object-bottom"
                />


                <ElegantDivider />

                {/* Produto Começo */}
                <ProductCard
                    colorOptions={['preto', 'azul_marinho', 'verde_jade', 'terracota']}
                    name="Colar Começo"
                    description={["Toda mudança tem um primeiro gesto."]}
                    price="R$ 85,00"
                    imageSrc={["/assets/produtos/comeco.webp", "/assets/produtos/comeco2.webp"]}
                    mobileImageSrc="/assets/produtos/comeco.webp"
                    badgeText="Coleção Depois"
                    reversed={false}
                    imageClass="object-center"
                />

                <ElegantDivider />

                {/* Produto Pulseira Volta */}
                <ProductCard
                    colorOptions={['azul_marinho_sf', 'preto_sf', 'marrom_sf', 'bordo_sf', 'bege_natural_sf', 'turquesa_sf']}
                    id="pulseiras"
                    name="Pulseira Volta"
                    description={["Às vezes, voltar é seguir."]}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/volta2.webp", "/assets/produtos/volta1.webp"]}
                    mobileImageSrc="/assets/produtos/volta2.webp"
                    badgeText="Coleção Depois"
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Orvalho */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada']}
                    name="Pulseira Orvalho"
                    description={["Sútil no olhar, marcante no sentir."]}
                    price="R$ 48,00"
                    imageSrc={["/assets/produtos/orvalho1.2.webp", "/assets/produtos/orvalho2.2.webp"]}
                    mobileImageSrc="/assets/produtos/orvalho1.2.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Elo */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada']}
                    name="Pulseira Elo"
                    description={["Presença que se impõe, estilo que permanece."]}
                    price="R$ 50,00"
                    imageSrc={["/assets/produtos/elo.2.1.webp", "/assets/produtos/elo2.2.webp"]}
                    mobileImageSrc="/assets/produtos/elo.2.1.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Brinco Bae */}
                <ProductCard
                    colorOptions={['azul_marinho', 'preto', 'areia', 'vermelho_figo', 'cinza', 'mostarda', 'terracota', 'verde_militar', 'verde_bandeira', 'verde_jade', 'marrom_escuro', 'marrom', 'caramelo', 'rami', 'chumbo']}
                    id="brincos"
                    name="Brinco Bae"
                    description={["Prova: o essencial também impõe presença."]}
                    price="R$ 30,00"
                    imageSrc={["/assets/produtos/bae5.webp", "/assets/produtos/bae6.webp"]}
                    mobileImageSrc="/assets/produtos/bae5.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Brinco Longe */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'marrom_escuro', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada'
                    ]}
                    name="Brinco Longe"
                    description={["Algumas distâncias aproximam."]}
                    price="R$ 35,00"
                    imageSrc={["/assets/produtos/1787353286403~2.jpg.webp", "/assets/produtos/1786963377150.webp"]}
                    mobileImageSrc="/assets/produtos/1787353286403~2.jpg.webp"
                    badgeText="Coleção Depois"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Brinco Douré */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'caramelo',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'marrom_escuro', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho', 'areia_caramelo_mesclada']}
                    name="Brinco Douré"
                    description={["Menos dúvida, mais presença."]}
                    price="R$ 40,00"
                    imageSrc={["/assets/produtos/1786824425529.webp", "/assets/produtos/1786731366461.webp"]}
                    mobileImageSrc="/assets/produtos/1786824425529.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Brinco Amá */}
                <ProductCard
                    colorOptions={['rami', 'azul_marinho', 'chumbo', 'verde_bandeira', 'areia', 'preto',
                        'verde_jade', 'mostarda', 'marrom', 'marrom_escuro', 'caramelo', 'vinho',
                        'vermelho_figo', 'terracota', 'vermelho', 'rosa', 'roxo', 'azul_royal', 'verde_militar',
                        'rosa_bebe', 'azul_bebe', 'cinza',
                        'azul_marinho_sf', 'preto_sf', 'marrom_sf', 'bege_natural_sf', 'bordo_sf', 'turquesa_sf'
                    ]}
                    name="Brinco Amá"
                    description={["Onde o atemporal encontra a sua força."]}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/Ama1.1.webp", "/assets/produtos/Ama1.2.webp"]}
                    mobileImageSrc="/assets/produtos/Ama1.1.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                {/* ══════════════════════════════════════════════════════════════
                    BOTÃO PARA CARREGAR PRODUTOS DE COLEÇÕES ANTERIORES
                ══════════════════════════════════════════════════════════════ */}
                <div className="mt-16 md:mt-24 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#78877a]/40 to-transparent mb-8" />

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            const nextState = !showPreviousCollections;
                            setShowPreviousCollections(nextState);
                            if (nextState) {
                                setTimeout(() => {
                                    document.getElementById('colecoes-anteriores-bloco')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 200);
                            }
                        }}
                        className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 rounded-full bg-[#3f4d41] text-white shadow-xl hover:bg-[#323e34] transition-all duration-300 border border-white/10"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <Sparkles className="w-4 h-4 text-[#cfdacd] group-hover:text-white transition-colors" />
                        <span className="text-sm md:text-base font-medium tracking-wide">
                            {showPreviousCollections ? 'Ocultar Coleções Anteriores' : 'Explorar Coleções Anteriores'}
                        </span>
                        <motion.span
                            animate={{ rotate: showPreviousCollections ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-5 h-5 text-[#cfdacd] group-hover:text-white transition-colors" />
                        </motion.span>
                    </motion.button>

                    <p className="mt-4 text-xs md:text-sm font-light text-[#78877a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {showPreviousCollections ? 'Exibindo peças históricas da marca' : 'Clique para ver peças e modelos de coleções anteriores'}
                    </p>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    BLOCO EXPANSÍVEL: 11 PRODUTOS DE COLEÇÕES ANTERIORES
                ══════════════════════════════════════════════════════════════ */}
                <AnimatePresence>
                    {showPreviousCollections && (
                        <motion.div
                            id="colecoes-anteriores-bloco"
                            initial={{ opacity: 0, height: 0, y: 30 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 30 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="overflow-hidden mt-12 md:mt-16"
                        >
                            {/* Cabeçalho da Seção de Coleções Anteriores */}
                            <div className="text-center pt-8 pb-12">
                                <div className="inline-block mb-3">
                                    <div className="w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-3" />
                                    <h3
                                        className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight"
                                        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em', color: '#3f4d41' }}
                                    >
                                        Coleções <span className="italic font-light text-[#7b8f7e]">Anteriores</span>
                                    </h3>
                                    <div className="w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mt-3" />
                                </div>
                                <p className="max-w-xl mx-auto text-base md:text-lg font-light text-[#78877a] px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Peças que marcaram momentos e continuam disponíveis para você.
                                </p>
                            </div>

                            <ElegantDivider />

                            {/* 1. Colar Rastro */}
                            <ProductCard
                                colorOptions={['verde_bandeira', 'azul_marinho', 'caramelo', 'verde_jade']}
                                name="Colar Rastro"
                                description={["Forte, marcante, inesquecível — como você."]}
                                price="R$ 40,00"
                                imageSrc={["/assets/produtos/rastro.webp", "/assets/produtos/rastro2.webp", "/assets/produtos/rastro3.webp"]}
                                mobileImageSrc="/assets/produtos/rastro.webp"
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
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
                                badgeText="Coleções anteriores"
                                reversed={false}
                                imageClass="object-center"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};

export default ProductsSection;
