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

                        {/* ── Exemplo de ProductCard ── descomente e preencha quando tiver produtos:

                        <ProductCard
                            id="nome-do-produto"
                            name="Nome do Produto"
                            description={["Descrição da peça."]}
                            price="R$ 00,00"
                            imageSrc={["/assets/produtos/nome.webp"]}
                            badgeText="Coleção Anterior"
                            reversed={false}
                        />

                        <ElegantDivider />

                        */}

                        {/* Estado vazio — removido quando os primeiros produtos forem adicionados */}
                        <EmptyState />

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

/* Componente de estado vazio exibido enquanto não há produtos cadastrados */
const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col items-center justify-center py-24 md:py-36 text-center"
    >
        {/* Ícone decorativo */}
        <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-inner"
            style={{ backgroundColor: 'rgba(63, 77, 65, 0.07)' }}
        >
            <svg
                width="36" height="36" viewBox="0 0 24 24"
                fill="none" stroke="#78877a" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </div>

        <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#a9b4aa' }}
        >
            Em breve
        </p>

        <h2
            className="text-2xl md:text-3xl font-serif mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: '#3f4d41' }}
        >
            Produtos em preparação
        </h2>

        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-4" />

        <p
            className="max-w-sm text-base font-light leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#a9b4aa' }}
        >
            As peças das coleções anteriores serão apresentadas aqui em breve.
        </p>
    </motion.div>
);

export default ColecoeAnterioresPage;
