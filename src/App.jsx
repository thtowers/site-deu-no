import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutCollection from './components/AboutCollection';
import ProductsSection from './components/ProductsSection';
import QualitySection from './components/QualitySection';
import Footer from './components/Footer';
import ColecoeAnterioresPage from './pages/ColecoeAnterioresPage';
import LinkHubPage from './pages/LinkHubPage';

/* Página principal */
const HomePage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <Hero />
    <main>
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
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/colecoes-anteriores" element={<ColecoeAnterioresPage />} />
        <Route path="/links" element={<LinkHubPage />} />
        <Route path="/hub" element={<LinkHubPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
