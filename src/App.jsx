import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutCollection from './components/AboutCollection';
import ProductsSection from './components/ProductsSection';
import QualitySection from './components/QualitySection';
import Footer from './components/Footer';

function App() {
  return (
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
}

export default App;
