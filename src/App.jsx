import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import SaleCountdown from './components/SaleCountdown';
import SaleStickyBar from './components/SaleStickyBar';
import AboutCollection from './components/AboutCollection';
import ProductsSection from './components/ProductsSection';
import QualitySection from './components/QualitySection';
import Footer from './components/Footer';
import { SectionBlackFridayStamps } from './components/BlackFridayStampsBackground';
import ColecoeAnterioresPage from './pages/ColecoeAnterioresPage';
import LinkHubPage from './pages/LinkHubPage';
import { useBlackFridayStatus } from './utils/campaignConfig';

let activeScrollRafId = null;

/* Função de rolagem suave com resposta instantânea no clique (curva easeOutCubic sem atraso inicial) */
export const smoothScrollToSection = (e, targetId, duration = 650) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  const target = document.getElementById(targetId);
  if (!target) return;

  if (activeScrollRafId) {
    window.cancelAnimationFrame(activeScrollRafId);
    activeScrollRafId = null;
  }

  const headerOffset = 80;
  const startY = window.scrollY || window.pageYOffset;
  const targetY = Math.max(0, target.getBoundingClientRect().top + startY - headerOffset);
  const distance = targetY - startY;

  if (Math.abs(distance) < 4) return;

  const startTime = performance.now();
  // Curva easeOutCubic: parte imediatamente no clique em velocidade máxima e desacelera suavemente até o alvo
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const step = (currentTime) => {
    const elapsed = Math.max(0, currentTime - startTime);
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo({
      top: startY + distance * easedProgress,
      behavior: 'instant'
    });

    if (progress < 1) {
      activeScrollRafId = window.requestAnimationFrame(step);
    } else {
      activeScrollRafId = null;
    }
  };

  activeScrollRafId = window.requestAnimationFrame(step);
};

/* Seção de Destaque do Relógio Black Friday na Home (Fundo original claro, Card do Relógio escuro) */
const BlackFridayHighlightSection = () => (
  <section
    id="black-friday"
    className="pt-10 pb-14 md:pt-14 md:pb-20 relative overflow-hidden"
    style={{ backgroundColor: '#faf9f7' }}
  >
    {/* Gradiente sutil original no fundo */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(120, 135, 122, 0.12) 0%, transparent 70%)'
      }}
    />

    {/* Elementos de fundo (Carimbos Black Friday em quantidade e tamanho equilibrados) */}
    <SectionBlackFridayStamps variant="highlight" />

    <div className="container mx-auto px-4 text-center relative z-10">
      {/* Linha decorativa superior */}
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#78877a] to-transparent mx-auto mb-6" />

      {/* Selo da Campanha */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border shadow-2xs"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(120, 135, 122, 0.25)'
        }}
      >
        <Tag size={13} className="text-[#c97d60]" />
        <span
          className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#3f4d41]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Black Friday • 13, 14 e 15 de Novembro
        </span>
      </motion.div>

      {/* Título Principal */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-4"
        style={{
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '-0.02em',
          color: '#3f4d41'
        }}
      >
        Presença Única, <span className="italic font-light text-[#7b8f7e]">Tempo Limitado</span>
      </motion.h2>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed px-4 mb-2 text-[#78877a]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Durante três dias especiais, nossas peças autorais e artesanais estão com condições exclusivas de Black Friday. Garanta suas favoritas antes que o relógio zere.
      </motion.p>

      {/* Relógio Regressivo (Card Escuro Black Friday) */}
      <SaleCountdown />

      {/* CTA para descer para os produtos */}
      <div className="mt-4">
        <a
          href="#produtos"
          onClick={(e) => smoothScrollToSection(e, 'produtos', 650)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#3f4d41] hover:text-[#78877a] transition-colors border-b border-[#3f4d41]/30 pb-1 cursor-pointer"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Explorar Catálogo em Oferta
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  </section>
);

/* Página principal com alternância automática entre Black Friday e Versão Original */
const HomePage = ({ isBlackFridayActive }) => (
  <div className="min-h-screen bg-white">
    <Header />
    <Hero />
    <main>
      {isBlackFridayActive && <BlackFridayHighlightSection />}
      <AboutCollection />
      <ProductsSection />
      <QualitySection />
    </main>
    <Footer />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const { isBlackFridayActive } = useBlackFridayStatus();

  useEffect(() => {
    document.title = isBlackFridayActive
      ? 'Deu Nó | Black Friday (13, 14 e 15 de Novembro)'
      : 'Deu Nó | Acessórios Artesanais Exclusivos';
  }, [isBlackFridayActive]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {isBlackFridayActive && <SaleStickyBar />}
      <Routes>
        <Route path="/" element={<HomePage isBlackFridayActive={isBlackFridayActive} />} />
        {!isBlackFridayActive && (
          <Route path="/colecoes-anteriores" element={<ColecoeAnterioresPage />} />
        )}
        <Route path="/links" element={<LinkHubPage />} />
        <Route path="/hub" element={<LinkHubPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
