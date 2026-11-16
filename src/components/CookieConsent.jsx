// Gerenciador de Consentimento de Cookies - Para uso futuro (LGPD)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verifica se o usuário já deu consentimento
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Pequeno delay para não sobrecarregar o usuário assim que abre o site
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center"
                >
                    <div 
                        className="w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-[var(--color-gray-light)] rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
                        style={{
                            boxShadow: '0 20px 40px rgba(63, 77, 65, 0.12)'
                        }}
                    >
                        {/* Detalhe estético lateral */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-sage-light)] opacity-50 hidden md:block" />

                        <div className="bg-[var(--color-sage-light)]/20 p-4 rounded-2xl flex-shrink-0">
                            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-forest-dark)]" />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h3 
                                className="font-serif text-xl md:text-2xl mb-2"
                                style={{ color: 'var(--color-forest-dark)', fontFamily: 'var(--font-display)' }}
                            >
                                Valorizamos sua Privacidade
                            </h3>
                            <p 
                                className="text-sm md:text-base leading-relaxed mb-4 md:mb-0"
                                style={{ color: 'var(--color-olive-medium)', fontFamily: 'var(--font-body)' }}
                            >
                                Utilizamos cookies para otimizar sua experiência, analisar o tráfego do site e preparar futuras melhorias com o Google Analytics. 
                                Ao clicar em "Aceitar", você concorda com o uso dessas tecnologias. 
                                <a 
                                    href="#" 
                                    className="ml-1 underline underline-offset-4 hover:text-[var(--color-forest-dark)] transition-colors opacity-80"
                                >
                                    Política de Privacidade
                                </a>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto md:pt-2">
                            <button
                                onClick={handleDecline}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium transition-all hover:opacity-100 opacity-60"
                                style={{ color: 'var(--color-forest-dark)' }}
                            >
                                Recusar
                            </button>
                            <button
                                onClick={handleAccept}
                                className="w-full sm:w-auto px-10 py-3.5 rounded-full text-sm font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                                style={{ 
                                    backgroundColor: 'var(--color-forest-dark)', 
                                    color: 'var(--color-off-white)',
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                Aceitar Cookies
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
