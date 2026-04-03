import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ElegantDivider from './ElegantDivider';

const ProductsSection = () => {
    const [imageSrc, setImageSrc] = useState("/assets/Produtos/Rastro.png");

    const handleImageError = () => {
        // Tenta .jpg se .png falhar (caso você mude o formato depois)
        if (imageSrc.endsWith('.png')) {
            setImageSrc("/assets/Produtos/Rastro.jpg");
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
                    id="colares"
                    name="Colar Rastro"
                    description={"Forte, marcante, inesquecível — como você.\n \n Outras opções de cores disponíveis"}
                    price=" R$40,00"
                    imageSrc={["/assets/Produtos/Rastro.png", "/assets/Produtos/Rastro2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Rastro.png"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Fluxo */}
                <ProductCard
                    name="Colar Fluxo"
                    description={"Um colar, infinitas versões de você. \n \n Outras opções de cores disponíveis"}
                    price=" R$ 45,00"
                    imageSrc={["/assets/Produtos/Fluxo.png", "/assets/Produtos/Fluxo2.png"]}
                    mobileImageSrc="/assets/Produtos/Fluxo.png"
                    badgeText="Coleção Âmago"
                    onImageError={handleImageError}
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Traço */}
                <ProductCard
                    name="Colar Traço"
                    description={["A força do simples bem definido. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 58,00"
                    imageSrc={["/assets/Produtos/Traço.jpeg", "/assets/Produtos/Traço2.png"]}
                    mobileImageSrc="/assets/Produtos/Traço.jpeg"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Ângulo */}
                <ProductCard
                    name="Colar Ângulo "
                    description={["Impacto sutil, elegância absoluta. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 60,00"
                    imageSrc={["/assets/Produtos/Angulo.png", "/assets/Produtos/Angulo2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Angulo.png"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Vínculo */}
                <ProductCard
                    name="Colar Vínculo "
                    description={["moderno no design, forte na personalidade. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 65,00"
                    imageSrc={["/assets/Produtos/Vinculo.png", "/assets/Produtos/Vinculo2.png"]}
                    mobileImageSrc="/assets/Produtos/Vinculo.png"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Eixo */}
                <ProductCard
                    name="Colar Eixo"
                    description={["O equilíbrio entre quem você é e o que você mostra. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 70,00"
                    imageSrc="/assets/listrado.jpeg"
                    mobileImageSrc="/assets/listrado.jpeg"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Ciclo */}
                <ProductCard
                    name="Colar Ciclo"
                    description={["Para quem transforma presença em assinatura. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 80,00"
                    imageSrc={["/assets/Produtos/Ciclo.jpeg", "/assets/Produtos/Ciclo2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Ciclo.jpeg"
                    badgeText="Coleção Âmago"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Eco */}
                <ProductCard
                    name="Colar Eco"
                    description={["elegante hoje, atemporal sempre. \n \n Outras opções de cores disponíveis"]}
                    price="R$ 80,00"
                    imageSrc={["/assets/Produtos/Ciclo.jpeg", "/assets/Produtos/Ciclo2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Ciclo.jpeg"
                    badgeText="Coleção Âmago"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Elo */}
                <ProductCard
                    id="pulseiras"
                    name="Pulseira Elo"
                    description={"Presença que se impõe, estilo que permanece. \n \n Outras opções de cores disponíveis"}
                    price="R$ 45,00"
                    imageSrc={["/assets/Produtos/Elo.jpeg", "/assets/Produtos/Elo2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Elo.jpeg"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Orvalho */}
                <ProductCard
                    name="Pulseira Orvalho"
                    description={"Sutil no olhar, marcante no sentir. \n \n Outras opções de cores disponíveis"}
                    price="R$ 45,00"
                    imageSrc={["/assets/Produtos/Orvalho.jpeg", "/assets/Produtos/Orvalho2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Orvalho.jpeg"
                    /* badgeText="Coleção Âmago" */
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Laço */}
                <ProductCard
                    name="Pulseira Laço"
                    description={"Feito para destacar quem você é. \n \n Outras opções de cores disponíveis"}
                    price="R$ 50,00"
                    imageSrc={["/assets/Produtos/Laço.jpeg", "/assets/Produtos/Laço2.jpeg"]}
                    mobileImageSrc="/assets/Produtos/Laço.jpeg"
                    /* badgeText="Coleção Âmago" */
                    reversed={false}
                />


                <div id="brincos" className="pb-8"></div>
            </div>
        </section>
    );
};

export default ProductsSection;
