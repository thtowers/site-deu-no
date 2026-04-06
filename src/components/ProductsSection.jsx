import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ElegantDivider from './ElegantDivider';

const ProductsSection = () => {
    const [imageSrc, setImageSrc] = useState("/assets/produtos/Rastro.webp");

    const handleImageError = () => {
        // Tenta .webp se .webp falhar (caso você mude o formato depois)
        if (imageSrc.endsWith('.webp')) {
            setImageSrc("/assets/produtos/Rastro.webp");
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

                {/* Produto Rastro */}
                <ProductCard
                    colorOptions={['verde_militar', 'verde_bandeira', 'azul_marinho', 'castanho', 'verde_jade']}
                    id="colares"
                    name="Colar Rastro"
                    description={"Forte, marcante, inesquecível — como você."} F
                    price=" R$40,00"
                    imageSrc={["/assets/produtos/Rastro.webp", "/assets/produtos/Rastro2.webp"]}
                    mobileImageSrc="/assets/produtos/Rastro.webp"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Fluxo */}
                <ProductCard
                    colorOptions={['prata_e_dourado']}
                    name="Colar Fluxo"
                    description={"Um colar, infinitas versões de você. "}
                    price=" R$ 45,00"
                    imageSrc={["/assets/produtos/Fluxo.webp", "/assets/produtos/Fluxo2.webp"]}
                    mobileImageSrc="/assets/produtos/Fluxo.webp"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Traço */}
                <ProductCard
                    colorOptions={['preto', 'terracota', 'marrom']}
                    name="Colar Traço"
                    description={["A força do simples bem definido. "]}
                    price="R$ 58,00"
                    imageSrc={["/assets/produtos/Traço.webp", "/assets/produtos/Traço2.webp"]}
                    mobileImageSrc="/assets/produtos/Traço.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Ângulo */}
                <ProductCard
                    colorOptions={['bordo_sf', 'azul_marinho_sf', 'bege_natural', 'marrom_sf', 'preto_sf', 'turquesa']}
                    name="Colar Ângulo "
                    description={["Impacto sutil, elegância absoluta. "]}
                    price="R$ 60,00"
                    imageSrc={["/assets/produtos/Angulo.webp", "/assets/produtos/Angulo2.webp"]}
                    mobileImageSrc="/assets/produtos/Angulo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Ponto */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe',
                        'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira',
                        'azul_marinho', 'azul_anil', 'azul_royal', 'roxo',
                        'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'castanho', 'marrom',
                        'chumbo', 'mostarda', 'verde_jade', 'preto_poa_branco',
                        'preto', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho'
                    ]}
                    name="Colar Ponto "
                    description={["Quem tem estilo, sabe: é tudo sobre o ponto certo."]}
                    price="R$ 60,00"
                    imageSrc={["/assets/produtos/Ponto.webp", "/assets/produtos/Ponto2.webp"]}
                    mobileImageSrc="/assets/produtos/Ponto.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Vínculo */}
                <ProductCard
                    colorOptions={['lenço_azul_bebe', 'lenço_vermelho', 'lenço_preto', 'lenço_branco',
                        'lenço_vermelho_vivo', 'lenço_bege', 'lenço_marrom_escuro', 'lenço_azul_marinho',
                        'lenço_verde', 'lenço_verde_escuro'

                    ]}
                    name="Colar Vínculo "
                    description={["moderno no design, forte na personalidade. "]}
                    price="R$ 65,00"
                    imageSrc={["/assets/produtos/Vinculo.webp", "/assets/produtos/Vinculo2.webp"]}
                    mobileImageSrc="/assets/produtos/Vinculo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Eixo */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'castanho', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho'

                    ]}
                    name="Colar Eixo"
                    description={["O equilíbrio entre quem você é e o que você mostra. "]}
                    price="R$ 70,00"
                    imageSrc={["/assets/produtos/Eixo.webp", "/assets/produtos/Eixo2.webp"]}
                    mobileImageSrc="/assets/produtos/Eixo.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Ciclo */}
                <ProductCard
                    colorOptions={['bordo_sf', 'azul_marinho_sf', 'bege_natural_sf',
                        'marrom_sf', 'preto_sf', 'turquesa']}
                    name="Colar Ciclo"
                    description={["Para quem transforma presença em assinatura. "]}
                    price="R$ 80,00"
                    imageSrc={["/assets/produtos/Ciclo.webp", "/assets/produtos/Ciclo2.webp"]}
                    mobileImageSrc="/assets/produtos/Ciclo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Eco */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'castanho',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'marrom_escuro', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho'

                    ]}
                    name="Colar Eco"
                    description={["Elegante hoje, atemporal sempre. "]}
                    price="R$ 85,00"
                    imageSrc={["/assets/produtos/Eco.webp", "/assets/produtos/Eco2.webp"]}
                    mobileImageSrc="/assets/produtos/Eco.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Elo */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'castanho', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho']}
                    id="pulseiras"
                    name="Pulseira Elo"
                    description={"Presença que se impõe, estilo que permanece. "}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/Elo.webp", "/assets/produtos/Elo2.webp"]}
                    mobileImageSrc="/assets/produtos/Elo.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Orvalho */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'castanho', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho']}
                    name="Pulseira Orvalho"
                    description={"Sutil no olhar, marcante no sentir. "}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/Orvalho.webp", "/assets/produtos/Orvalho2.webp"]}
                    mobileImageSrc="/assets/produtos/Orvalho.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Laço */}
                <ProductCard
                    colorOptions={['terracota', 'verde_bandeira', 'marrom_escuro', 'vinho', 'preto', 'verde_militar',
                        'verde_jade', 'azul_marinho', 'areia', 'mostarda', 'castanho', 'verde_limao', 'amarelo_manteiga',
                        'vermelho_figo', 'marrom', 'rosa_bebe', 'chumbo', 'cinza', 'laranja', 'rami'
                    ]}
                    name="Pulseira Laço"
                    description={"Feito para destacar quem você é. "}
                    price="R$ 50,00"
                    imageSrc={["/assets/produtos/Laço.webp", "/assets/produtos/Laço2.webp"]}
                    mobileImageSrc="/assets/produtos/Laço.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Brinco Amá */}
                <ProductCard
                    colorOptions={['rami', 'azul_marinho', 'chumbo', 'verde_bandeira', 'areia', 'preto',
                        'verde_jade', 'mostarda', 'marrom', 'marrom_escuro', 'castanho', 'vinho',
                        'vermelho_figo', 'terracota', 'vermelho', 'rosa', 'roxo', 'azul_royal', 'verde_militar',
                        'rosa_bebe', 'azul_bebe', 'cinza'

                    ]}
                    id="brincos"
                    name="Brinco Amá"
                    description={"Onde o atemporal encontra a sua força."}
                    price="R$ 40,00"
                    imageSrc={["/assets/produtos/Ama.webp", "/assets/produtos/Ama2.webp"]}
                    mobileImageSrc="/assets/produtos/Ama.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Brinco Bae */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'castanho',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho'
                    ]}
                    name="Brinco Bae"
                    description={"Bae prova: o essencial também impõe presença."}
                    price="R$ 30,00"
                    imageSrc={["/assets/produtos/Bae.webp", "/assets/produtos/Bae2.webp"]}
                    mobileImageSrc="/assets/produtos/Bae.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Brinco Douré */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'castanho',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'marrom_escuro', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho']}
                    name="Brinco Douré"
                    description={"Douré: menos dúvida, mais presença."}
                    price="R$ 35,00"
                    imageSrc={["/assets/produtos/Doure.webp", "/assets/produtos/Doure2.webp"]}
                    mobileImageSrc="/assets/produtos/Doure.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />


            </div>
        </section>
    );
};

export default ProductsSection;
