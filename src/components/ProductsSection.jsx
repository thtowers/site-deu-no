import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ElegantDivider from './ElegantDivider';

const ProductsSection = () => {
    const [imageSrc, setImageSrc] = useState("/assets/chocolate.jpeg");

    const handleImageError = () => {
        // Tenta .jpg se .jpeg falhar
        if (imageSrc.endsWith('.jpeg')) {
            setImageSrc("/assets/chocolate.jpg");
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

                {/* Produto Choco */}
                <ProductCard
                    name="Choco"
                    description="Acompanha um brinco de argola elegante, com detalhe em dourado e acabamento em preto texturizado, criando um contraste sofisticado que adiciona um toque de modernidade e refinamento ao visual."
                    price="R$ 29,90"
                    imageSrc={imageSrc}
                    mobileImageSrc="assets\chocolate.jpeg"
                    badgeText="Exclusivo"
                    onImageError={handleImageError}
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Rio */}
                <ProductCard
                    name="Rio"
                    description="Inspirado nas belezas naturais do Rio de Janeiro, este brinco de argola apresenta um design fluido e elegante, com detalhes que remetem às ondas do mar e ao brilho do sol. Uma peça única que captura a essência da cidade maravilhosa."
                    price="R$ 49,90"
                    imageSrc="/Logo/Pessoas/rio.jpeg"
                    mobileImageSrc="/Logo/Pessoas/rio.jpeg"
                    badgeText="Novo"
                    onImageError={handleImageError}
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Adidas */}
                <ProductCard
                    name="Adidas"
                    description="Colar"
                    price="R$ 39,90"
                    imageSrc="/assets/adidas.jpeg"
                    badgeText="Novo"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Luvas */}
                <ProductCard
                    name="Luvas"
                    description="Luvas exclusivas com design único e acabamento impecável."
                    price="R$ 49,90"
                    imageSrc="/assets/luva.jpeg"
                    mobileImageSrc="/assets/luva.jpeg"
                    badgeText="Novo"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Carro */}
                <ProductCard
                    name="Carro"
                    description="Colar"
                    price="R$ 59,90"
                    imageSrc="/assets/carro.jpeg"
                    badgeText="Exclusivo"
                    reversed={false}
                />

                <ElegantDivider />

                {/* Produto Listrado */}
                <ProductCard
                    name="Listrado"
                    description="Um mar de listras que conta histórias. Este colar traz um padrão hipnotizante em preto e branco, combinando a ousadia geométrica com a leveza de um design artesanal. Perfeito para quem não tem medo de ser notado."
                    price="R$ 49,90"
                    imageSrc="/assets/listrado.jpeg"
                    mobileImageSrc="/assets/listrado.jpeg"
                    badgeText="Tendência"
                    reversed={true}
                />

                <ElegantDivider />

                {/* Produto Mão */}
                <ProductCard
                    name="Mão"
                    description="A arte em sua forma mais pura. Este colar apresenta um pingente esculpido em formato de mão, simbolizando a criatividade e o toque humano. Uma peça poética que transforma o visual em uma declaração de estilo."
                    price="R$ 49,90"
                    imageSrc="/assets/mão.jpeg"  
                    mobileImageSrc="/assets/mão.jpeg"
                    badgeText="Artesanal"
                    reversed={false}
                />

            </div>
        </section>
    );
};

export default ProductsSection;
