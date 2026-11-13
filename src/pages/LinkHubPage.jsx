import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, Instagram, Sparkles } from 'lucide-react';
import { useBlackFridayStatus } from '../utils/campaignConfig';

const LinkHubPage = () => {
    const { isBlackFridayActive } = useBlackFridayStatus();

    // Atualiza dinamicamente o título e metadados para otimização de compartilhamento (SEO)
    useEffect(() => {
        const originalTitle = document.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        const originalDescription = metaDesc ? metaDesc.getAttribute('content') : '';

        document.title = isBlackFridayActive
            ? 'Deu Nó | Black Friday (13, 14 e 15/11)'
            : 'Deu Nó | Conecte-se Conosco';

        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute(
            'content',
            isBlackFridayActive
                ? 'Acesse o catálogo de Black Friday da Deu Nó, fale diretamente conosco no WhatsApp ou visite nossa loja oficial na Shopee. Arte em cada nó.'
                : 'Acesse o catálogo da Deu Nó, fale diretamente conosco no WhatsApp ou visite nossa loja oficial na Shopee. Arte em cada nó.'
        );

        return () => {
            document.title = originalTitle;
            if (metaDesc) {
                metaDesc.setAttribute('content', originalDescription || '');
            }
        };
    }, [isBlackFridayActive]);

    // Link do WhatsApp com mensagem padrão parametrizada
    const whatsappNumber = '5521965672034';
    const whatsappMessage = isBlackFridayActive
        ? 'Olá! Vim pelo Link Hub e gostaria de informações sobre a Black Friday da Deu Nó.'
        : 'Olá! Vim pelo Link Hub e gostaria de mais informações.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const shopeeUrl = 'https://shopee.com.br/usedeuno';
    const instagramUrl = 'https://www.instagram.com/usedeuno';
    const linkedinUrl = 'https://www.linkedin.com/in/thiago-torres-77151a90/';

    // Variante de animação para os botões entrarem em cascata
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    if (!isBlackFridayActive) {
        return (
            <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-4 overflow-hidden select-none font-sans">
                {/* Imagem de Fundo de Alta Resolução */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/link_hub_desktop.webp?v=3"
                        alt="Modelo Deu Nó"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Container Principal (Card Glassmorphism Original) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-[420px] bg-[#faf9f7]/70 border-2 border-[#78877a]/40 rounded-[2.5rem] px-6 pb-8 pt-20 shadow-2xl z-10 my-0 mb-4 flex flex-col items-center"
                >
                    {/* Badge do Logotipo no Topo */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-white border-2 border-[#78877a] flex items-center justify-center shadow-lg overflow-hidden">
                        <img
                            src="/assets/logo/deu_no_favicon.webp"
                            alt="Logo Deu Nó"
                            className="w-24 h-24 object-contain rounded-full"
                        />
                    </div>

                    {/* Nome da Marca */}
                    <h1
                        className="text-3xl font-medium tracking-[0.2em] text-[#3f4d41] text-center"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        DEU NÓ
                    </h1>

                    {/* Slogan Institucional */}
                    <p
                        className="text-[#3f4d41] text-[10px] md:text-xs font-semibold tracking-[0.16em] text-center uppercase mt-4 mb-8 leading-relaxed max-w-[320px]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Acessórios que imprimem presença.<br />
                        Não é acessório. É identidade.
                    </p>

                    {/* Botões de Acesso Principal */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="w-full flex flex-col gap-4 mb-8"
                    >
                        {/* Botão 1: Catálogo */}
                        <motion.div variants={itemVariants}>
                            <Link
                                to="/"
                                className="w-full h-14 rounded-full border-2 border-[#78877a]/80 flex items-center px-4 hover:bg-[#78877a]/10 hover:border-[#3f4d41] active:bg-[#78877a]/25 text-[#3f4d41] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-9 h-9 rounded-full border-2 border-[#78877a] flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#78877a] group-hover:text-white transition-all duration-300">
                                    <Search size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                                </div>
                                <span
                                    className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    CATÁLOGO
                                </span>
                            </Link>
                        </motion.div>

                        {/* Botão 2: WhatsApp */}
                        <motion.div variants={itemVariants}>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-14 rounded-full border-2 border-[#78877a]/80 flex items-center px-4 hover:bg-[#78877a]/10 hover:border-[#3f4d41] active:bg-[#78877a]/25 text-[#3f4d41] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#78877a] flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#3f4d41] transition-all duration-300">
                                    <img
                                        src="/assets/logo/digital_glyph_white.webp"
                                        alt="WhatsApp"
                                        className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <span
                                    className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    WHATSAPP
                                </span>
                            </a>
                        </motion.div>

                        {/* Botão 3: Shopee */}
                        <motion.div variants={itemVariants}>
                            <a
                                href={shopeeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-14 rounded-full border-2 border-[#78877a]/80 flex items-center px-4 hover:bg-[#78877a]/10 hover:border-[#3f4d41] active:bg-[#78877a]/25 text-[#3f4d41] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-9 h-9 rounded-full border-2 border-[#78877a] flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#78877a] group-hover:text-white transition-all duration-300">
                                    <img
                                        src="/assets/logo/shopee.webp"
                                        alt="Shopee"
                                        className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110 filter brightness-95 group-hover:brightness-0 group-hover:invert"
                                    />
                                </div>
                                <span
                                    className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    SHOPEE
                                </span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Link Social Instagram */}
                    <motion.a
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#3f4d41] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 text-sm font-medium tracking-[0.15em] uppercase"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        <Instagram size={16} />
                        <span>@usedeuno</span>
                    </motion.a>
                </motion.div>

                {/* Rodapé e Créditos ao Desenvolvedor */}
                <motion.footer
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="w-full max-w-[420px] mx-auto mt-1 mb-3 px-5 py-3 rounded-2xl bg-[#faf9f7]/85 backdrop-blur-md border border-[#78877a]/35 shadow-lg text-center text-[#2d372f] z-10 flex flex-col items-center gap-2.5"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-[#242f25] font-semibold">
                        <span>&copy; 2026 Deu Nó</span>
                        <span className="hidden sm:inline opacity-40 text-[#3f4d41]">•</span>
                        <span>Desenvolvido por Thiago Torres</span>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <a
                            href={`https://wa.me/5521979362517?text=${encodeURIComponent('Olá Thiago! Vim pelo Link Hub da Deu Nó.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#3f4d41]/15 hover:bg-[#3f4d41] border border-[#3f4d41]/30 flex items-center justify-center text-[#3f4d41] transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 group"
                            title="Fale com Thiago no WhatsApp"
                        >
                            <img
                                src="/assets/logo/digital_glyph_white.webp"
                                alt="WhatsApp Thiago"
                                className="w-4 h-4 object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all"
                            />
                        </a>

                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#3f4d41]/15 hover:bg-[#3f4d41] border border-[#3f4d41]/30 flex items-center justify-center text-[#3f4d41] transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 group"
                            title="LinkedIn de Thiago"
                        >
                            <img
                                src="/assets/logo/li.png"
                                alt="LinkedIn Thiago"
                                className="w-4 h-4 object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all"
                            />
                        </a>
                    </div>
                </motion.footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-4 overflow-hidden select-none font-sans bg-[#0e120f]">
            {/* Imagem de Fundo de Alta Resolução com Overlay Escuro */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/link_hub_desktop.webp?v=3"
                    alt="Modelo Deu Nó"
                    className="w-full h-full object-cover object-center opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e120f]/70 via-[#0e120f]/60 to-[#0e120f]/90" />
            </div>

            {/* Container Principal (Card Glassmorphism Escuro) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[420px] bg-[#121714]/88 backdrop-blur-xl border-2 border-[#2b3830] rounded-[2.5rem] px-6 pb-8 pt-20 shadow-2xl z-10 my-0 mb-4 flex flex-col items-center"
            >
                {/* Badge do Logotipo no Topo */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-white border-2 border-[#d4886a] flex items-center justify-center shadow-xl overflow-hidden">
                    <img
                        src="/assets/logo/deu_no_favicon.webp"
                        alt="Logo Deu Nó"
                        className="w-24 h-24 object-contain rounded-full"
                    />
                </div>

                {/* Selo Black Friday */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4886a]/20 border border-[#d4886a]/40 text-[#e8a489] text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
                    <Sparkles size={11} className="text-[#d4886a]" />
                    <span>Black Friday • 13, 14 e 15/11</span>
                </div>

                {/* Nome da Marca */}
                <h1
                    className="text-3xl font-medium tracking-[0.2em] text-[#faf9f7] text-center"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    DEU NÓ
                </h1>

                {/* Slogan Institucional */}
                <p
                    className="text-[#c7d2c9] text-[10px] md:text-xs font-medium tracking-[0.16em] text-center uppercase mt-3 mb-7 leading-relaxed max-w-[320px]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Acessórios que imprimem presença.<br />
                    Não é acessório. É identidade.
                </p>

                {/* Botões de Acesso Principal */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full flex flex-col gap-4 mb-8"
                >
                    {/* Botão 1: Catálogo Black Friday */}
                    <motion.div variants={itemVariants}>
                        <Link
                            to="/"
                            className="w-full h-14 rounded-full border-2 border-[#d4886a]/70 bg-[#171e19] flex items-center px-4 hover:bg-[#d4886a]/15 hover:border-[#d4886a] active:bg-[#d4886a]/25 text-[#faf9f7] transition-all duration-300 group shadow-md"
                        >
                            <div className="w-9 h-9 rounded-full border border-[#d4886a] bg-[#d4886a]/20 flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#d4886a] group-hover:text-[#0e120f] transition-all duration-300 text-[#d4886a]">
                                <Search size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                            </div>
                            <span
                                className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                CATÁLOGO BLACK FRIDAY
                            </span>
                        </Link>
                    </motion.div>

                    {/* Botão 2: WhatsApp */}
                    <motion.div variants={itemVariants}>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-14 rounded-full border-2 border-[#2b3830] bg-[#171e19]/80 flex items-center px-4 hover:bg-[#1e2721] hover:border-[#b5c2b7] active:bg-[#26312a] text-[#faf9f7] transition-all duration-300 group shadow-sm"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#25D366]/85 flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#25D366] transition-all duration-300">
                                <img
                                    src="/assets/logo/digital_glyph_white.webp"
                                    alt="WhatsApp"
                                    className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <span
                                className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                WHATSAPP
                            </span>
                        </a>
                    </motion.div>

                    {/* Botão 3: Shopee */}
                    <motion.div variants={itemVariants}>
                        <a
                            href={shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-14 rounded-full border-2 border-[#2b3830] bg-[#171e19]/80 flex items-center px-4 hover:bg-[#1e2721] hover:border-[#b5c2b7] active:bg-[#26312a] text-[#faf9f7] transition-all duration-300 group shadow-sm"
                        >
                            <div className="w-9 h-9 rounded-full border border-[#b5c2b7]/50 flex items-center justify-center mr-4 group-hover:scale-105 group-hover:bg-[#b5c2b7]/20 transition-all duration-300">
                                <img
                                    src="/assets/logo/shopee.webp"
                                    alt="Shopee"
                                    className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <span
                                className="flex-1 text-center font-serif text-lg tracking-[0.15em] font-medium pr-10"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                SHOPEE
                            </span>
                        </a>
                    </motion.div>
                </motion.div>

                {/* Link Social Instagram */}
                <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#c7d2c9] hover:text-[#faf9f7] hover:scale-105 active:scale-95 transition-all duration-300 text-sm font-medium tracking-[0.15em] uppercase"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    <Instagram size={16} className="text-[#d4886a]" />
                    <span>@usedeuno</span>
                </motion.a>
            </motion.div>

            {/* Rodapé e Créditos ao Desenvolvedor */}
            <motion.footer
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="w-full max-w-[420px] mx-auto mt-1 mb-3 px-5 py-3 rounded-2xl bg-[#121714]/90 backdrop-blur-md border border-[#2b3830] shadow-lg text-center text-[#c7d2c9] z-10 flex flex-col items-center gap-2.5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-[#e2ebe4] font-semibold">
                    <span>&copy; 2026 Deu Nó</span>
                    <span className="hidden sm:inline opacity-40 text-[#b5c2b7]">•</span>
                    <span>Desenvolvido por Thiago Torres</span>
                </div>

                <div className="flex gap-3 justify-center">
                    <a
                        href={`https://wa.me/5521979362517?text=${encodeURIComponent('Olá Thiago! Vim pelo Link Hub da Deu Nó.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#1c251f] hover:bg-[#d4886a] border border-[#2b3830] flex items-center justify-center text-[#faf9f7] transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 group"
                        title="Fale com Thiago no WhatsApp"
                    >
                        <img
                            src="/assets/logo/digital_glyph_white.webp"
                            alt="WhatsApp Thiago"
                            className="w-4 h-4 object-contain transition-all"
                        />
                    </a>

                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#1c251f] hover:bg-[#d4886a] border border-[#2b3830] flex items-center justify-center text-[#faf9f7] transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 group"
                        title="LinkedIn de Thiago"
                    >
                        <img
                            src="/assets/logo/li.png"
                            alt="LinkedIn Thiago"
                            className="w-4 h-4 object-contain transition-all"
                        />
                    </a>
                </div>
            </motion.footer>
        </div>
    );
};

export default LinkHubPage;
