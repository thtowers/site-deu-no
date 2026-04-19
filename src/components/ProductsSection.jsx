import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ElegantDivider from './ElegantDivider';

const ProductsSection = () => {
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

                {/* Produto Rastro */}
                <ProductCard
                    colorOptions={['verde_militar', 'verde_bandeira', 'azul_marinho', 'caramelo', 'verde_jade']}
                    id="colares"
                    name="Colar Rastro"
                    description={["Forte, marcante, inesquecível — como você."]}
                    price=" R$40,00"
                    imageSrc={["/assets/produtos/rastro.webp", "/assets/produtos/rastro2.webp", "/assets/produtos/rastro3.webp"]}
                    mobileImageSrc="/assets/produtos/rastro.webp"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={false}
                    imageClass="object-center lg:object-bottom"
                />

                <ElegantDivider />

                {/* Produto Fluxo */}
                <ProductCard
                    colorOptions={['prata_e_dourado']}
                    name="Colar Fluxo"
                    description={"Um colar, infinitas versões de você"}
                    price=" R$ 45,00"
                    imageSrc={["/assets/produtos/fluxo.webp", "/assets/produtos/fluxo2.webp", "/assets/produtos/fluxo3.webp"]}
                    mobileImageSrc="/assets/produtos/fluxo.webp"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Traço */}
                <ProductCard
                    colorOptions={['preto', 'terracota', 'marrom']}
                    name="Colar Traço"
                    description={["A força do simples bem definido."]}
                    price="R$ 58,00"
                    imageSrc={["/assets/produtos/traco.webp", "/assets/produtos/traco2.webp",
                        '/assets/produtos/traco3.webp', '/assets/produtos/traco4.webp',
                        '/assets/produtos/traco5.webp'

                    ]}
                    mobileImageSrc="/assets/produtos/traco.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                    imageClass={["object-bottom", "object-bottom lg:object-center"]}
                />

                <ElegantDivider />

                {/* Produto Ângulo */}
                <ProductCard
                    colorOptions={['bordo_sf', 'azul_marinho_sf', 'bege_natural_sf', 'marrom_sf', 'preto_sf', 'turquesa']}
                    name="Colar Ângulo "
                    description={["Impacto sutil, elegância absoluta."]}
                    price="R$ 60,00"
                    imageSrc={["/assets/produtos/angulo.webp", "/assets/produtos/angulo2.webp", "/assets/produtos/angulo3.webp", "/assets/produtos/angulo4.webp"]}
                    mobileImageSrc="/assets/produtos/angulo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                    imageClass={["object-bottom lg:object-bottom", "object-bottom lg:object-center", "object-center lg:object-center"]}
                />

                <ElegantDivider />

                {/* Produto Ponto */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe',
                        'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira',
                        'azul_marinho', 'azul_anil', 'azul_royal', 'roxo',
                        'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom',
                        'chumbo', 'mostarda', 'verde_jade', 'preto_poa_branco',
                        'preto', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho'
                    ]}
                    name="Colar Ponto "
                    description={["Quem tem estilo, sabe: é tudo sobre o ponto certo."]}
                    modalSubtitle="Escolha até duas cores"
                    price="R$ 60,00"
                    imageSrc={["/assets/produtos/ponto3.webp", "/assets/produtos/ponto2.webp", "/assets/produtos/ponto.webp"]}
                    mobileImageSrc="/assets/produtos/ponto3.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                    imageClass={["object-center lg:object-bottom", "object-center"]}
                />

                <ElegantDivider />

                {/* Produto Vínculo */}
                <ProductCard
                    colorOptions={['lenço_azul_bebe', 'lenço_vermelho', 'lenço_preto', 'lenço_branco',
                        'lenço_vermelho_vivo', 'lenço_bege', 'lenço_marrom_escuro', 'lenço_azul_marinho',
                        'lenço_verde', 'lenço_verde_escuro'

                    ]}
                    name="Colar Vínculo "
                    description={["Moderno no design, forte na personalidade."]}
                    price="R$ 65,00"
                    imageSrc={["/assets/produtos/vinculo.webp", "/assets/produtos/vinculo2.webp", "/assets/produtos/vinculo4.webp"]}
                    mobileImageSrc="/assets/produtos/vinculo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Eixo */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho'

                    ]}
                    name="Colar Eixo"
                    description={["O equilíbrio entre quem você é e o que você mostra."]}
                    price="R$ 70,00"
                    imageSrc={["/assets/produtos/eixo.webp", "/assets/produtos/eixo2.webp", "/assets/produtos/eixo3.webp"]}
                    mobileImageSrc="/assets/produtos/eixo.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Ciclo */}
                <ProductCard
                    colorOptions={['bordo_sf', 'azul_marinho_sf', 'bege_natural_sf',
                        'marrom_sf', 'preto_sf', 'turquesa']}
                    name="Colar Ciclo"
                    description={"Para quem transforma presença em assinatura."}
                    price="R$ 80,00"
                    imageSrc={["/assets/produtos/ciclo.webp", "/assets/produtos/ciclo2.webp", "/assets/produtos/ciclo3.webp", "/assets/produtos/ciclo4.webp"]}
                    mobileImageSrc="/assets/produtos/ciclo.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Eco */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'caramelo',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'marrom_escuro', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho'

                    ]}
                    name="Colar Eco"
                    description={["Elegante hoje, atemporal sempre."]}
                    price="R$ 85,00"
                    imageSrc={["/assets/produtos/eco.webp", "/assets/produtos/eco2.webp", "/assets/produtos/eco3.webp"]}
                    mobileImageSrc="/assets/produtos/eco.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                    imageClass={["object-center", "object-center lg:object-left-bottom"]}
                />

                <ElegantDivider />

                {/* Produto Orvalho */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho']}
                    name="Pulseira Orvalho"
                    description={["Quem tem estilo, sabe: é tudo sobre o ponto certo."]}
                    price="R$ 48,00"
                    imageSrc={["/assets/produtos/orvalho.webp", "/assets/produtos/orvalho2.webp",
                        "/assets/produtos/orvalho3.webp"]}
                    mobileImageSrc="/assets/produtos/orvalho.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Elo */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao',
                        'rosa_bebe', 'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho',
                        'azul_anil', 'azul_royal', 'roxo', 'rosa', 'laranja', 'vermelho', 'terracota',
                        'vermelho_figo', 'vinho', 'caramelo', 'marrom', 'chumbo', 'mostarda', 'verde_jade',
                        'preto', 'preto_poa_branco', 'azul_marinho_poa_branco', 'verde_militar_poa_branco',
                        'rami_branco', 'areia_poa_marrom_escuro', 'vermelho_poa_azul_marinho']}
                    id="pulseiras"
                    name="Pulseira Elo"
                    description={["Presença que se impõe, estilo que permanece."]}
                    price="R$ 50,00"
                    imageSrc={["/assets/produtos/elo3.webp", "/assets/produtos/elo2.webp", "/assets/produtos/elo.webp"
                    ]}
                    mobileImageSrc="/assets/produtos/elo3.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Laço */}
                <ProductCard
                    colorOptions={['terracota', 'verde_bandeira', 'marrom_escuro', 'vinho', 'preto', 'verde_militar',
                        'verde_jade', 'azul_marinho', 'areia', 'mostarda', 'caramelo', 'verde_limao', 'amarelo_manteiga',
                        'vermelho_figo', 'marrom', 'rosa_bebe', 'chumbo', 'cinza', 'laranja', 'rami'
                    ]}
                    name="Pulseira Laço"
                    description={"Feito para destacar quem você é. "}
                    modalSubtitle="Escolha até duas cores"
                    price="R$ 55,00"
                    imageSrc={["/assets/produtos/laco3.webp", "/assets/produtos/laco2.webp", "/assets/produtos/laco.webp"]}
                    mobileImageSrc="/assets/produtos/laco3.webp"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                    imageClass="object-bottom"
                />

                <ElegantDivider />

                {/* Produto Brinco Bae */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'caramelo',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho'
                    ]}
                    name="Brinco Bae"
                    description={["Prova: o essencial também impõe presença."]}
                    price="R$ 30,00"
                    imageSrc={["/assets/produtos/bae.webp", "/assets/produtos/bae2.webp",
                        "/assets/produtos/bae3.webp", "/assets/produtos/bae4.webp"]}
                    mobileImageSrc="/assets/produtos/bae.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Brinco Douré */}
                <ProductCard
                    colorOptions={['areia', 'cinza', 'azul_bebe', 'amarelo_manteiga', 'verde_limao', 'rosa_bebe',
                        'verde_militar', 'azul_petroleo', 'verde_bandeira', 'azul_marinho', 'azul_anil', 'azul_royal',
                        'roxo', 'rosa', 'laranja', 'vermelho', 'terracota', 'vermelho_figo', 'vinho', 'caramelo',
                        'marrom', 'chumbo', 'mostarda', 'verde_jade', 'marrom_escuro', 'preto', 'preto_poa_branco',
                        'azul_marinho_poa_branco', 'verde_militar_poa_branco', 'rami_branco', 'areia_poa_marrom_escuro',
                        'vermelho_poa_azul_marinho']}
                    name="Brinco Douré"
                    description={["Menos dúvida, mais presença."]}
                    price="R$ 40,00"
                    imageSrc={["/assets/produtos/doure3.webp", "/assets/produtos/doure2.webp", "/assets/produtos/doure.webp"]}
                    mobileImageSrc="/assets/produtos/doure3.webp"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Brinco Amá */}
                <ProductCard
                    colorOptions={['rami', 'azul_marinho', 'chumbo', 'verde_bandeira', 'areia', 'preto',
                        'verde_jade', 'mostarda', 'marrom', 'marrom_escuro', 'caramelo', 'vinho',
                        'vermelho_figo', 'terracota', 'vermelho', 'rosa', 'roxo', 'azul_royal', 'verde_militar',
                        'rosa_bebe', 'azul_bebe', 'cinza'

                    ]}
                    id="brincos"
                    name="Brinco Amá"
                    description={["Onde o atemporal encontra a sua força."]}
                    price="R$ 45,00"
                    imageSrc={["/assets/produtos/ama3.webp", "/assets/produtos/ama2.webp", "/assets/produtos/ama.webp"
                    ]}
                    mobileImageSrc="/assets/produtos/ama3.webp"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />


            </div>
        </section>
    );
};

export default ProductsSection;
