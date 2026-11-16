import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Adiciona o favicon
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = '/assets/logo/deu_no_favicon.webp';
        document.head.appendChild(link);
    }, []);
    // Hook para detectar scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Retorna o href correto dependendo da rota atual:
    // - Na home: ancora normal (#secao)
    // - Em outra página: navega para a home com ancora (/=#secao)
    const resolveHref = (href) => {
        if (!href.startsWith('#')) return href;
        return isHome ? href : `/${href}`;
    };

    // Hook para scroll suave (só age quando já estamos na home)
    const handleSmoothScroll = (e, href) => {
        if (!href.startsWith('#')) return;

        setIsOpen(false);

        if (isHome) {
            e.preventDefault();
            const targetId = href.substring(1);
            const elem = document.getElementById(targetId);
            if (elem) {
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = elem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }, 150);
            }
        }
        // Fora da home: deixa o navegador seguir o href /=#secao normalmente
    };

    const menuItems = [
        { name: 'Início', href: '#amago' },
        { name: 'Colares', href: '#colares' },
        { name: 'Pulseiras', href: '#pulseiras' },
        { name: 'Brincos', href: '#brincos' },
        { name: 'Qualidade', href: '#qualidade' },
        { name: 'Contato', href: '#contato' },
    ];
    // Variações de animação
    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    // Codifica o nome do arquivo para lidar com espaços e caracteres especiais
    const logoPath = "/assets/logo/deu_no_favicon.webp";

    // Renderização do header
    return (
        <>
            {/* Placeholder fixo para evitar a "tremidinha" (jitter layout shift) no scroll */}
            <div className="h-[88px] md:h-[104px] lg:h-[120px] w-full shrink-0 pointer-events-none" />
            <header className={`w-full shadow-sm fixed top-0 left-0 z-50 transition-all duration-500 ${isScrolled ? 'py-1 lg:py-2' : 'py-3'}`} style={{ backgroundColor: 'var(--color-off-white)' }}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center" style={{ color: 'var(--color-forest-dark)' }}>
                        {!logoError ? (
                            <img
                                src={logoPath}
                                alt="Deu Nó"
                                className={`transition-all duration-500 hover:opacity-100 ${isScrolled ? 'h-10 md:h-12 lg:h-14 opacity-100' : 'h-16 md:h-20 lg:h-24 opacity-90'}`}
                                style={{
                                    mixBlendMode: 'multiply',
                                    filter: 'contrast(1.15) brightness(1.1)'
                                }}
                                fetchPriority="high"
                                loading="eager"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <span className="text-2xl font-bold font-serif">Deu Nó</span>
                        )}
                    </Link>

                    {/* Menu Desktop */}
                    <nav className="hidden md:flex gap-10 items-center">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={resolveHref(item.href)}
                                onClick={(e) => handleSmoothScroll(e, item.href)}
                                className="font-medium tracking-wide uppercase text-sm transition-all relative group"
                                style={{ color: 'var(--color-olive-medium)' }}
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3f4d41] transition-all group-hover:w-full"></span>
                            </a>
                        ))}

                        {/* Link para a página de Coleções Anteriores */}
                        <Link
                            to="/colecoes-anteriores"
                            onClick={() => setIsOpen(false)}
                            className="font-medium tracking-wide uppercase text-sm transition-all relative group"
                            style={{
                                color: location.pathname === '/colecoes-anteriores'
                                    ? 'var(--color-forest-dark)'
                                    : 'var(--color-olive-medium)'
                            }}
                        >
                            Coleções Anteriores
                            <span
                                className="absolute -bottom-1 left-0 h-0.5 bg-[#3f4d41] transition-all group-hover:w-full"
                                style={{ width: location.pathname === '/colecoes-anteriores' ? '100%' : '0' }}
                            />
                        </Link>
                    </nav>


                    {/* Redes Sociais - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="https://www.instagram.com/usedeuno?igsh=NWhvMnB3ZjB3NWs%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center gap-1 transition-all hover:scale-105"
                            aria-label="Instagram"
                        >
                            <img
                                src="/assets/logo/instagram_glyph_gradient.webp"
                                alt="Instagram"
                                className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span
                                className="text-xs tracking-wide opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: 'var(--color-olive-medium)'
                                }}
                            >
                                Rede Social
                            </span>
                        </a>
                        <a
                            href="https://shopee.com.br/usedeuno"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center gap-1 transition-all hover:scale-105"
                            aria-label="Shopee"
                        >
                            <img
                                src="/assets/logo/shopee.webp"
                                alt="Shopee"
                                className="h-7 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span
                                className="text-xs tracking-wide opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: 'var(--color-olive-medium)'
                                }}
                            >
                                Loja Virtual
                            </span>
                        </a>
                        <a
                            href="/vendas/"
                            className="group flex flex-col items-center gap-1 transition-all hover:scale-105"
                            aria-label="Admin"
                        >
                            <Lock className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity text-[var(--color-olive-medium)] group-hover:text-[var(--color-forest-dark)]" />
                            <span
                                className="text-xs tracking-wide opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: 'var(--color-olive-medium)'
                                }}
                            >
                                Admin
                            </span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X style={{ color: 'var(--color-forest-dark)' }} /> : <Menu style={{ color: 'var(--color-forest-dark)' }} />}
                    </button>
                </div>

                {/* Menu Mobile - Agora posicionado absolutamente abaixo do header */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="md:hidden absolute top-full left-0 w-full overflow-hidden shadow-2xl"
                            style={{ 
                                backgroundColor: 'var(--color-off-white)', 
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                zIndex: 40 
                            }}
                        >
                            <motion.nav
                                className="flex flex-col p-8 gap-6"
                                variants={listVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Itens do Menu com animação de "saída" do header */}
                                {menuItems.map((item) => (
                                    <motion.a
                                        key={item.name}
                                        href={resolveHref(item.href)}
                                        variants={itemVariants}
                                        className="font-serif text-2xl py-2 border-b border-transparent transition-all tracking-wide"
                                        style={{ color: 'var(--color-olive-medium)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-forest-dark)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-olive-medium)'}
                                        onClick={(e) => handleSmoothScroll(e, item.href)}
                                    >
                                        {item.name}
                                    </motion.a>
                                ))}

                                {/* Link mobile para Coleções Anteriores */}
                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/colecoes-anteriores"
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-2xl py-2 border-b border-transparent transition-all block tracking-wide"
                                        style={{
                                            color: location.pathname === '/colecoes-anteriores'
                                                ? 'var(--color-forest-dark)'
                                                : 'var(--color-olive-medium)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-forest-dark)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-olive-medium)'}
                                    >
                                        Coleções Anteriores
                                    </Link>
                                </motion.div>

                                {/* Link mobile para Área Admin */}
                                <motion.div variants={itemVariants}>
                                    <a
                                        href="/vendas/"
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-2xl py-2 border-b border-transparent transition-all flex items-center gap-2 tracking-wide"
                                        style={{ color: 'var(--color-olive-medium)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-forest-dark)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-olive-medium)'}
                                    >
                                        <Lock className="w-5 h-5" /> Área Admin
                                    </a>
                                </motion.div>

                                {/* Divisor Elegante */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="w-12 h-px bg-[var(--color-olive-medium)] opacity-30 my-4"
                                />

                                {/* Redes Sociais - Mobile */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex gap-8 pt-2"
                                >
                                    <a
                                        href="https://www.instagram.com/usedeuno?igsh=NWhvMnB3ZjB3NWs%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                        aria-label="Instagram"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img
                                            src="/assets/logo/instagram_glyph_gradient.webp"
                                            alt="Instagram"
                                            className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </a>
                                    <a
                                        href="https://shopee.com.br/usedeuno"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                        aria-label="Shopee"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img
                                            src="/assets/logo/shopee.webp"
                                            alt="Shopee"
                                            className="h-7 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </a>
                                </motion.div>
                            </motion.nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
