import React from 'react';
import { motion } from 'framer-motion';

const AboutCollection = () => {
    return (
        <section id="amago" className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    
                    {/* Texto Explicação */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full flex flex-col items-center"
                    >
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mb-10"></div>
                        
                        <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif text-[#3f4d41] mb-10 leading-[1.3] md:leading-[1.4] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sua presença já fala.<br/>
                            <span className="italic text-[#7b8f7e] font-light">Âmago só amplifica.</span>
                        </h2>
                        
                        <div className="space-y-6 text-lg md:text-xl font-light text-[#78877a] leading-relaxed max-w-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <p>
                                Cada detalhe foi pensado para acompanhar quem não precisa provar nada — apenas ser.
                            </p>
                            <p>
                                Essa coleção não compete com você, ela potencializa.
                            </p>
                        </div>
                        
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mt-14 bg-opacity-50"></div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutCollection;
