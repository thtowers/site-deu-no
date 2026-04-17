import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutCollection from './components/AboutCollection';
import ProductsSection from './components/ProductsSection';
import QualitySection from './components/QualitySection';
import Footer from './components/Footer';
import ColecoeAnterioresPage from './pages/ColecoeAnterioresPage';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/colecoes-anteriores" element={<ColecoeAnterioresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
