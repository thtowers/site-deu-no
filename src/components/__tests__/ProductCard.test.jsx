import React from 'react';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ProductCard from '../ProductCard';

// Limpeza automática após cada teste
afterEach(cleanup);

// Mock do framer-motion para evitar problemas de animação e IntersectionObserver no JSDOM
vi.mock('framer-motion', () => ({
    motion: {
        div: React.forwardRef(({ children, whileInView, initial, animate, exit, transition, viewport, ...props }, ref) => (
            <div ref={ref} {...props}>{children}</div>
        )),
        a: React.forwardRef(({ children, ...props }, ref) => (
            <a ref={ref} {...props}>{children}</a>
        )),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mocks básicos de browser que podem ser necessários
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

global.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

// Mocking the data might be safer for test isolation
// But since the project is small, I'll use the real component with real color IDs.

const mockProps = {
    id: 'test-product',
    name: 'Anel Elegance',
    price: 'R$ 450,00',
    description: 'Um anel maravilhoso.',
    imageSrc: ['/image1.webp', '/image2.webp'],
    colorOptions: ['azul_marinho', 'marrom']
};

describe('ProductCard Component', () => {

    it('deve renderizar o nome e o preço corretamente', () => {
        render(<ProductCard {...mockProps} />);
        expect(screen.getByText('Anel Elegance')).toBeInTheDocument();
        expect(screen.getByText('R$ 450,00')).toBeInTheDocument();
    });

    it('deve alternar entre as imagens ao clicar nas setas', () => {
        render(<ProductCard {...mockProps} />);
        
        // Inicialmente mostra a primeira imagem
        const img = screen.getByAltText(/Anel Elegance - Joia Exclusiva/);
        expect(img.src).toContain('/image1.webp');
        
        // Clica na seta para avançar
        const nextBtn = screen.getByLabelText('Próxima imagem');
        fireEvent.click(nextBtn);
        
        // Agora deve mostrar a segunda imagem
        expect(screen.getByAltText(/Anel Elegance - Joia Exclusiva/).src).toContain('/image2.webp');
        
        // Clica na seta para voltar
        const prevBtn = screen.getByLabelText('Imagem anterior');
        fireEvent.click(prevBtn);
        expect(screen.getByAltText(/Anel Elegance - Joia Exclusiva/).src).toContain('/image1.webp');
    });

    it('deve abrir o modal de cores e listar as cores corretas', () => {
        render(<ProductCard {...mockProps} />);
        
        const colorBtn = screen.getByRole('button', { name: /Cores Disponíveis/i });
        fireEvent.click(colorBtn);
        
        // Verifica se o título do modal aparece (usando heading para diferenciar do botão)
        expect(screen.getByRole('heading', { name: /Cores Disponíveis/i })).toBeInTheDocument();
        
        // Verifica se as cores da lista aparecem no modal (usamos o último elemento caso haja duplicatas no card)
        const azulMarinhoLabels = screen.getAllByText('Azul Marinho');
        expect(azulMarinhoLabels[azulMarinhoLabels.length - 1]).toBeInTheDocument();
        
        const marromLabels = screen.getAllByText('Marrom');
        expect(marromLabels[marromLabels.length - 1]).toBeInTheDocument();
    });

    it('deve abrir o zoom da imagem ao clicar na miniatura de cor no modal', () => {
        render(<ProductCard {...mockProps} />);
        
        const colorBtn = screen.getByRole('button', { name: /Cores Disponíveis/i });
        fireEvent.click(colorBtn);
        
        const colorImgs = screen.getAllByAltText('Azul Marinho');
        fireEvent.click(colorImgs[colorImgs.length - 1]);
        
        expect(screen.getByAltText('Detalhe da Cor')).toBeInTheDocument();
    });

    it('deve fechar o modal de zoom ao clicar no botão fechar', () => {
        render(<ProductCard {...mockProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: /Cores Disponíveis/i }));
        const colorImgs = screen.getAllByAltText('Azul Marinho');
        fireEvent.click(colorImgs[colorImgs.length - 1]);
        
        expect(screen.getByAltText('Detalhe da Cor')).toBeInTheDocument();
        
        const closeButtons = screen.getAllByLabelText('Fechar');
        fireEvent.click(closeButtons[closeButtons.length - 1]);
        
        expect(screen.queryByAltText('Detalhe da Cor')).not.toBeInTheDocument();
    });

    it('deve fechar o modal de cores ao clicar no botão fechar do modal de cores', () => {
        render(<ProductCard {...mockProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: /Cores Disponíveis/i }));
        expect(screen.getByRole('heading', { name: /Cores Disponíveis/i })).toBeInTheDocument();
        
        const closeButtons = screen.getAllByLabelText('Fechar');
        fireEvent.click(closeButtons[closeButtons.length - 1]);
        
        expect(screen.queryByRole('heading', { name: /Cores Disponíveis/i })).not.toBeInTheDocument();
    });
});


