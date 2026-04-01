import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const menuItems = [
        { name: 'Produtos', href: '#produtos' },
        { name: 'Qualidade', href: '#qualidade' },
        { name: 'Contato', href: '#contato' },
    ];

    // Codifica o nome do arquivo para lidar com espaços e caracteres especiais
    const logoPath = encodeURI("/assets/logo_deuNó.5.png");

    return (
        <header className="w-full shadow-sm" style={{ backgroundColor: 'var(--color-off-white)' }}>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center" style={{ color: 'var(--color-forest-dark)' }}>
                    {!logoError ? (
                        <img
                            src={logoPath}
                            alt="Deu Nó"
                            className="h-16 md:h-20 lg:h-24 opacity-90 transition-opacity hover:opacity-100"
                            style={{
                                mixBlendMode: 'multiply',
                                filter: 'contrast(1.15) brightness(1.1)'
                            }}
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <span className="text-2xl font-bold font-serif">Deu Nó</span>
                    )}
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex gap-12">
                    {menuItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="font-medium tracking-wide uppercase text-sm transition-all relative group"
                            style={{ color: 'var(--color-olive-medium)' }}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3f4d41] transition-all group-hover:w-full"></span>
                        </a>
                    ))}
                </nav>


                {/* Social Media Icons - Desktop Only */}
                <div className="hidden md:flex items-center gap-6">
                    <a
                        href="https://www.instagram.com/usedeuno?igsh=NWhvMnB3ZjB3NWs%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-1 transition-all hover:scale-105"
                        aria-label="Instagram"
                    >
                        <img
                            src="/assets/Instagram_Glyph_Gradient.png"
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
                            src="/Logo/Shopee.png"
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
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X style={{ color: 'var(--color-forest-dark)' }} /> : <Menu style={{ color: 'var(--color-forest-dark)' }} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t"
                        style={{ backgroundColor: 'var(--color-off-white)', borderColor: 'var(--color-gray-light)' }}
                    >
                        <nav className="flex flex-col p-6 gap-6">
                            {/* Menu Items */}
                            {menuItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="font-medium text-lg py-2"
                                    style={{ color: 'var(--color-olive-medium)', '--hover-color': 'var(--color-forest-dark)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--hover-color')}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-olive-medium)'}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}

                            {/* Divider */}
                            <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-2"></div>

                            {/* Social Media Links */}
                            <div className="flex justify-center gap-8 pt-2">
                                <a
                                    href="https://www.instagram.com/usedeuno?igsh=NWhvMnB3ZjB3NWs%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                    aria-label="Instagram"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <img
                                        src="/assets/Instagram_Glyph_Gradient.png"
                                        alt="Instagram"
                                        className="w-8 h-8"
                                    />
                                    <span className="text-xs" style={{ color: 'var(--color-olive-medium)' }}>Instagram</span>
                                </a>
                                <a
                                    href="https://shopee.com.br/usedeuno"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                    aria-label="Shopee"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <img
                                        src="/Logo/Shopee.png"
                                        alt="Shopee"
                                        className="h-8 w-auto object-contain"
                                    />
                                    <span className="text-xs" style={{ color: 'var(--color-olive-medium)' }}>Shopee</span>
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
};

export default Header;
