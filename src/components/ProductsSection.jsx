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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
                    id="colares"
                    name="Colar Rastro"
                    description={"Forte, marcante, inesquecível — como você."}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
                    colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}
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
