import React from 'react';
import { Instagram, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contato" className="bg-[#f5f5f5] text-[#1c1c1c] pt-16 pb-8 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 md:mb-16">
                    {/* Marca e Slogan */}
                    <div className="text-center md:text-left space-y-4">
                        <h3 className="text-4xl md:text-5xl font-medium tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Deu Nó
                        </h3>
                        <p className="font-light text-[#1c1c1c]/80 leading-relaxed text-sm md:text-base max-w-xs mx-auto md:mx-0">
                            Arte em cada nó.
                            <br />
                            Acessórios artesanais feitos com alma e dedicação para realçar sua essência única.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="text-center">
                        <h4 className="text-lg font-serif mb-6 tracking-widest uppercase text-[#1c1c1c]/90" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Navegação
                        </h4>
                        <ul className="space-y-4 font-light text-sm md:text-base text-[#1c1c1c]/70">
                            <li>
                                <a href="#" className="hover:text-black hover:translate-x-1 transition-all duration-300 inline-block">Início</a>
                            </li>
                            <li>
                                <a href="#produtos" className="hover:text-black hover:translate-x-1 transition-all duration-300 inline-block">Nossos Produtos</a>
                            </li>
                            <li>
                                <a href="#qualidade" className="hover:text-black hover:translate-x-1 transition-all duration-300 inline-block">Sobre a Marca</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div className="text-center md:text-right">
                        <h4 className="text-lg font-serif mb-6 tracking-widest uppercase text-[#1c1c1c]/90" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Contato
                        </h4>
                        <ul className="space-y-4 font-light text-sm md:text-base text-[#1c1c1c]/70 flex flex-col items-center md:items-end">
                            <li>
                                <a href="https://www.instagram.com/usedeuno" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black transition-colors duration-300 group">
                                    <span className="group-hover:underline decoration-1 underline-offset-4">@usedeuno</span>
                                    <Instagram size={18} />
                                </a>
                            </li>
                            <li>
                                <a href="mailto:towersbeauty@gmail.com" className="flex items-center gap-3 hover:text-black transition-colors duration-300 group">
                                    <span className="group-hover:underline decoration-1 underline-offset-4">towersbeauty@gmail.com</span>
                                    <Mail size={18} />
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-3">
                                    <span>(21) 96567-2034</span>
                                    <Phone size={18} />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Linha Divisória */}
                <div className="w-full h-px bg-linear-to-r from-transparent via-[#1c1c1c]/10 to-transparent mb-8"></div>

                {/* Copyright & Creator Credit */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[#1c1c1c]/60 text-sm font-light">
                    {/* Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p>&copy; {new Date().getFullYear()} Deu Nó. Todos os direitos reservados.</p>
                        <p className="flex items-center gap-1 text-xs">
                            Feito com <Heart size={12} className="text-red-500 fill-red-500" /> para você
                        </p>
                    </div>

                    {/* Creator Credit */}
                    <a
                        href="https://www.towersdigital.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-5 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/5"
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-60 text-black font-medium">Desenvolvido por</span>
                        <img
                            src="/Logo/Logo_towers.png"
                            alt="Towers Digital"
                            className="h-16 md:h-20 w-auto object-contain"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
