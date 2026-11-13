import React, { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Carimbo retangular estilo "Grunge Rubber Stamp" de BLACK FRIDAY
 * fiel à imagem de referência enviada pelo usuário:
 * - Moldura retangular espessa com cantos arredondados
 * - Tipografia alta, condensada e pesada em 2 linhas ("BLACK" / "FRIDAY")
 * - Textura grunge de carimbo real (falhas de tinta e aspecto desgastado)
 * - Opacidade suave de marca d'água para não competir com o layout do site
 */
export const BlackFridayStamp = ({
  width = 84,
  rotate = -8,
  opacity = 0.08,
  color = '#171e19',
  seed = 1,
  className = '',
  style = {}
}) => {
  const maskId = `bf-stamp-grunge-${seed}`;
  const height = Math.round(width * 0.75);

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotate}deg)`,
        opacity,
        ...style
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 240 180"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Máscara grunge detalhada imitando falha de tinta de carimbo */}
          <mask id={maskId}>
            <rect x="0" y="0" width="240" height="180" fill="white" />

            {/* Desgastes orgânicos na moldura e nas letras */}
            <g fill="black">
              {/* Borda Superior */}
              <ellipse cx="34" cy="13" rx="6" ry="3.2" transform="rotate(-14 34 13)" />
              <circle cx="43" cy="18" r="3.2" />
              <circle cx="51" cy="11" r="2.5" />
              <ellipse cx="79" cy="12" rx="8" ry="2.8" transform="rotate(-10 79 12)" />
              <circle cx="94" cy="17" r="2.4" />
              <circle cx="126" cy="14" r="4.2" />
              <ellipse cx="154" cy="12" rx="10" ry="3.5" transform="rotate(9 154 12)" />
              <circle cx="166" cy="18" r="3.8" />
              <ellipse cx="202" cy="15" rx="6" ry="2.6" transform="rotate(-18 202 15)" />

              {/* Borda Esquerda */}
              <ellipse cx="13" cy="44" rx="3.8" ry="9" transform="rotate(12 13 44)" />
              <circle cx="18" cy="56" r="3.2" />
              <circle cx="12" cy="78" r="2.8" />
              <circle cx="14" cy="96" r="4.5" />
              <ellipse cx="15" cy="130" rx="4.2" ry="7" transform="rotate(-8 15 130)" />
              <circle cx="18" cy="148" r="3.4" />

              {/* Borda Direita */}
              <ellipse cx="226" cy="52" rx="4" ry="8" transform="rotate(-14 226 52)" />
              <circle cx="222" cy="72" r="2.8" />
              <circle cx="225" cy="104" r="4.6" />
              <ellipse cx="226" cy="140" rx="5.2" ry="4.2" transform="rotate(15 226 140)" />
              <circle cx="221" cy="154" r="3.2" />

              {/* Borda Inferior */}
              <ellipse cx="46" cy="166" rx="9" ry="3.8" transform="rotate(6 46 166)" />
              <circle cx="58" cy="162" r="3.4" />
              <circle cx="84" cy="167" r="2.8" />
              <ellipse cx="114" cy="166" rx="7" ry="3" transform="rotate(-10 114 166)" />
              <circle cx="142" cy="163" r="2.6" />
              <ellipse cx="176" cy="165" rx="10" ry="3.5" transform="rotate(-5 176 165)" />
              <circle cx="210" cy="162" r="4.2" />

              {/* Falhas de tinta sobre "BLACK" */}
              <circle cx="48" cy="46" r="3" />
              <ellipse cx="62" cy="68" rx="5" ry="2.2" transform="rotate(-25 62 68)" />
              <circle cx="72" cy="52" r="2.2" />
              <circle cx="88" cy="78" r="3.4" />
              <ellipse cx="116" cy="50" rx="4" ry="2.4" transform="rotate(18 116 50)" />
              <circle cx="124" cy="72" r="2.6" />
              <circle cx="148" cy="74" r="3.2" />
              <ellipse cx="164" cy="60" rx="4.5" ry="2.2" transform="rotate(-15 164 60)" />
              <circle cx="190" cy="48" r="3" />
              <ellipse cx="198" cy="76" rx="4.5" ry="2.5" transform="rotate(12 198 76)" />

              {/* Falhas de tinta sobre "FRIDAY" */}
              <circle cx="46" cy="112" r="2.8" />
              <ellipse cx="54" cy="134" rx="4" ry="2" transform="rotate(-12 54 134)" />
              <ellipse cx="76" cy="106" rx="4.5" ry="2.4" transform="rotate(20 76 106)" />
              <circle cx="84" cy="136" r="3.5" />
              <ellipse cx="108" cy="122" rx="3.4" ry="2.2" />
              <circle cx="136" cy="104" r="3.2" />
              <ellipse cx="142" cy="138" rx="5" ry="2.4" transform="rotate(-18 142 138)" />
              <circle cx="168" cy="118" r="3" />
              <circle cx="182" cy="108" r="2.4" />
              <ellipse cx="196" cy="130" rx="4.5" ry="2.6" transform="rotate(14 196 130)" />

              {/* Riscos e ranhuras diagonais de textura grunge */}
              <path d="M18 32 L58 16" stroke="black" strokeWidth="2.1" strokeLinecap="round" />
              <path d="M136 24 L182 9" stroke="black" strokeWidth="1.9" strokeLinecap="round" />
              <path d="M24 152 L74 170" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M152 170 L208 148" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M36 84 L96 64" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M126 140 L190 116" stroke="black" strokeWidth="1.7" strokeLinecap="round" />
            </g>
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {/* Moldura externa retangular espessa com cantos arredondados */}
          <rect
            x="13"
            y="13"
            width="214"
            height="154"
            rx="14"
            ry="14"
            stroke={color}
            strokeWidth="15"
          />

          {/* Linha 1: BLACK */}
          <g transform="translate(120, 83) scale(0.82, 1.22)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill={color}
              style={{
                fontFamily: "'Impact', 'Arial Black', 'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: '54px',
                letterSpacing: '0.04em'
              }}
            >
              BLACK
            </text>
          </g>

          {/* Linha 2: FRIDAY */}
          <g transform="translate(120, 145) scale(0.78, 1.22)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill={color}
              style={{
                fontFamily: "'Impact', 'Arial Black', 'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: '52px',
                letterSpacing: '0.03em'
              }}
            >
              FRIDAY
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * SEÇÕES CURTAS/MÉDIAS (sempre em número ÍMPAR e layout assimétrico exclusivo por seção,
 * posicionados fora da área dos cards):
 * - highlight: 5 carimbos assimétricos (3 na esquerda, 2 na direita)
 * - about: 3 carimbos assimétricos (1 na esquerda, 2 na direita)
 * - quality: 3 carimbos assimétricos (2 na esquerda, 1 na direita)
 */
export const SectionBlackFridayStamps = ({ variant = 'highlight' }) => {
  const presets = {
    highlight: [
      { top: '9%', right: 'calc(50% + 430px)', width: 86, rotate: -12, opacity: 0.085, responsiveClass: 'hidden min-[1060px]:block' },
      { top: '48%', right: 'calc(50% + 510px)', width: 76, rotate: 8, opacity: 0.075, responsiveClass: 'hidden min-[1200px]:block' },
      { bottom: '10%', right: 'calc(50% + 445px)', width: 80, rotate: -6, opacity: 0.08, responsiveClass: 'hidden min-[1080px]:block' },
      { top: '20%', left: 'calc(50% + 440px)', width: 82, rotate: 11, opacity: 0.08, responsiveClass: 'hidden min-[1080px]:block' },
      { bottom: '16%', left: 'calc(50% + 480px)', width: 84, rotate: -9, opacity: 0.085, responsiveClass: 'hidden min-[1140px]:block' }
    ],
    about: [
      { top: '22%', right: 'calc(50% + 395px)', width: 84, rotate: -11, opacity: 0.08, responsiveClass: 'hidden min-[980px]:block' },
      { top: '14%', left: 'calc(50% + 420px)', width: 78, rotate: 9, opacity: 0.075, responsiveClass: 'hidden min-[1040px]:block' },
      { bottom: '15%', left: 'calc(50% + 380px)', width: 82, rotate: -7, opacity: 0.08, responsiveClass: 'hidden min-[980px]:block' }
    ],
    quality: [
      { top: '22px', right: 'calc(50% + 360px)', width: 82, rotate: -10, opacity: 0.08, responsiveClass: 'hidden md:block' },
      { top: '52%', right: 'calc(50% + 605px)', width: 78, rotate: 7, opacity: 0.075, responsiveClass: 'hidden min-[1400px]:block' },
      { top: '30px', left: 'calc(50% + 410px)', width: 80, rotate: 11, opacity: 0.08, responsiveClass: 'hidden md:block' }
    ]
  };

  const items = presets[variant] || presets.highlight;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {items.map((item, idx) => (
        <BlackFridayStamp
          key={idx}
          width={item.width}
          rotate={item.rotate}
          opacity={item.opacity}
          seed={100 + idx}
          className={`absolute ${item.responsiveClass || ''}`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right
          }}
        />
      ))}
    </div>
  );
};

/**
 * Margens externas da seção de Produtos (fora dos 1536px do .container) + cabeçalho,
 * também em número ímpar e com alturas/rotações assimétricas (sem padrão repetitivo).
 */
export const ProductsBlackFridayStamps = () => {
  // 15 carimbos assimétricos (número ímpar) nas bordas ultra-largas + 3 no cabeçalho (ímpar)
  const outerStamps = [
    { top: '2.8%', right: 'calc(50% + 782px)', width: 84, rotate: -12, opacity: 0.085 },
    { top: '8.4%', left: 'calc(50% + 796px)', width: 76, rotate: 10, opacity: 0.075 },
    { top: '14.1%', right: 'calc(50% + 804px)', width: 80, rotate: 7, opacity: 0.08 },
    { top: '21.7%', right: 'calc(50% + 778px)', width: 86, rotate: -8, opacity: 0.085 },
    { top: '27.3%', left: 'calc(50% + 784px)', width: 82, rotate: -11, opacity: 0.08 },
    { top: '35.6%', left: 'calc(50% + 802px)', width: 78, rotate: 9, opacity: 0.075 },
    { top: '42.9%', right: 'calc(50% + 790px)', width: 84, rotate: 12, opacity: 0.08 },
    { top: '50.4%', left: 'calc(50% + 778px)', width: 80, rotate: -7, opacity: 0.085 },
    { top: '58.8%', right: 'calc(50% + 800px)', width: 76, rotate: -13, opacity: 0.075 },
    { top: '65.2%', left: 'calc(50% + 792px)', width: 86, rotate: 8, opacity: 0.085 },
    { top: '73.5%', right: 'calc(50% + 780px)', width: 82, rotate: 10, opacity: 0.08 },
    { top: '79.1%', left: 'calc(50% + 805px)', width: 78, rotate: -9, opacity: 0.075 },
    { top: '86.4%', right: 'calc(50% + 794px)', width: 84, rotate: -6, opacity: 0.08 },
    { top: '92.0%', left: 'calc(50% + 782px)', width: 80, rotate: 11, opacity: 0.085 },
    { top: '96.8%', right: 'calc(50% + 788px)', width: 78, rotate: -10, opacity: 0.08 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* 3 carimbos assimétricos (número ímpar) no cabeçalho acima do 1º card */}
      <BlackFridayStamp
        width={84}
        rotate={-11}
        opacity={0.085}
        seed={390}
        className="absolute hidden md:block"
        style={{ top: '18px', right: 'calc(50% + 330px)' }}
      />
      <BlackFridayStamp
        width={74}
        rotate={7}
        opacity={0.075}
        seed={391}
        className="absolute hidden lg:block"
        style={{ top: '44px', right: 'calc(50% + 490px)' }}
      />
      <BlackFridayStamp
        width={80}
        rotate={10}
        opacity={0.08}
        seed={392}
        className="absolute hidden md:block"
        style={{ top: '28px', left: 'calc(50% + 360px)' }}
      />

      {/* Carimbos nas colunas externas fora dos 1536px (.container) dos ProductCards */}
      {outerStamps.map((stamp, idx) => (
        <BlackFridayStamp
          key={idx}
          width={stamp.width}
          rotate={stamp.rotate}
          opacity={stamp.opacity}
          seed={400 + idx}
          className="absolute hidden min-[1740px]:block"
          style={{
            top: stamp.top,
            left: stamp.left,
            right: stamp.right
          }}
        />
      ))}
    </div>
  );
};

/**
 * 25 COMPOSIÇÕES ÚNICAS E ASSIMÉTRICAS PARA CADA `ElegantDivider`
 * Regras aplicadas em 100% dos layouts abaixo:
 * 1. Todos possuem SEMPRE um número ÍMPAR de carimbos (3 ou 5 carimbos).
 * 2. Cada ElegantDivider recebe um layout diferente (não repete o padrão de organização).
 * 3. Todos ficam dentro da faixa vertical segura (top: 18% a 66%) do ElegantDivider (py-20),
 *    e longe do emblema central de urgência (mantendo o centro 34% a 66% totalmente livre).
 */
const UNIQUE_DIVIDER_LAYOUTS = [
  // Layout 0: 3 carimbos (2 na esquerda: externa alta + interna baixa | 1 na direita média)
  [
    { top: '20%', left: '2%', width: 84, rotate: -12, opacity: 0.085 },
    { top: '58%', left: '21%', width: 76, rotate: 9, opacity: 0.075 },
    { top: '36%', right: '12%', width: 82, rotate: -7, opacity: 0.08 }
  ],
  // Layout 1: 5 carimbos (2 na esquerda | 3 na direita em escada invertida)
  [
    { top: '54%', left: '4%', width: 78, rotate: 11, opacity: 0.08 },
    { top: '24%', left: '19%', width: 84, rotate: -8, opacity: 0.085 },
    { top: '60%', right: '24%', width: 74, rotate: 7, opacity: 0.075 },
    { top: '22%', right: '13%', width: 82, rotate: -13, opacity: 0.08 },
    { top: '50%', right: '2%', width: 80, rotate: 10, opacity: 0.085 }
  ],
  // Layout 2: 3 carimbos (1 na esquerda média | 2 na direita: interna alta + externa baixa)
  [
    { top: '44%', left: '15%', width: 86, rotate: -9, opacity: 0.085 },
    { top: '20%', right: '21%', width: 76, rotate: 12, opacity: 0.075 },
    { top: '58%', right: '3.5%', width: 82, rotate: -11, opacity: 0.08 }
  ],
  // Layout 3: 5 carimbos (3 na esquerda em arco | 2 na direita espaçados)
  [
    { top: '22%', left: '1.5%', width: 80, rotate: 8, opacity: 0.08 },
    { top: '58%', left: '12%', width: 84, rotate: -14, opacity: 0.085 },
    { top: '26%', left: '24%', width: 74, rotate: 6, opacity: 0.075 },
    { top: '52%', right: '19%', width: 82, rotate: -9, opacity: 0.08 },
    { top: '24%', right: '4%', width: 78, rotate: 13, opacity: 0.08 }
  ],
  // Layout 4: 3 carimbos (2 na esquerda: externa baixa + média alta | 1 na direita externa alta)
  [
    { top: '60%', left: '4%', width: 82, rotate: -7, opacity: 0.08 },
    { top: '22%', left: '18%', width: 78, rotate: 14, opacity: 0.075 },
    { top: '28%', right: '3.5%', width: 86, rotate: -10, opacity: 0.085 }
  ],
  // Layout 5: 3 carimbos (1 na esquerda externa alta | 2 na direita: média baixa + externa média)
  [
    { top: '24%', left: '4.5%', width: 84, rotate: 10, opacity: 0.085 },
    { top: '60%', right: '18%', width: 80, rotate: -12, opacity: 0.08 },
    { top: '32%', right: '2.5%', width: 76, rotate: 8, opacity: 0.075 }
  ],
  // Layout 6: 5 carimbos (2 na esquerda | 3 na direita em zigue-zague)
  [
    { top: '30%', left: '8%', width: 82, rotate: -11, opacity: 0.08 },
    { top: '58%', left: '22%', width: 76, rotate: 9, opacity: 0.075 },
    { top: '22%', right: '24%', width: 78, rotate: -6, opacity: 0.08 },
    { top: '56%', right: '12%', width: 84, rotate: 12, opacity: 0.085 },
    { top: '26%', right: '1.5%', width: 80, rotate: -10, opacity: 0.08 }
  ],
  // Layout 7: 3 carimbos (2 na esquerda: média baixa + interna alta | 1 na direita interna baixa)
  [
    { top: '56%', left: '9%', width: 80, rotate: 13, opacity: 0.08 },
    { top: '20%', left: '23%', width: 76, rotate: -9, opacity: 0.075 },
    { top: '54%', right: '20%', width: 86, rotate: -11, opacity: 0.085 }
  ],
  // Layout 8: 5 carimbos (3 na esquerda diagonal descendente | 2 na direita altos)
  [
    { top: '18%', left: '2%', width: 84, rotate: -8, opacity: 0.085 },
    { top: '40%', left: '13%', width: 76, rotate: 11, opacity: 0.075 },
    { top: '62%', left: '24%', width: 80, rotate: -13, opacity: 0.08 },
    { top: '22%', right: '20%', width: 82, rotate: 8, opacity: 0.08 },
    { top: '46%', right: '5%', width: 78, rotate: -7, opacity: 0.075 }
  ],
  // Layout 9: 3 carimbos (1 na esquerda interna | 2 na direita: externa alta + média baixa)
  [
    { top: '38%', left: '21%', width: 82, rotate: -12, opacity: 0.08 },
    { top: '58%', right: '16%', width: 78, rotate: 9, opacity: 0.075 },
    { top: '20%', right: '3.5%', width: 86, rotate: 13, opacity: 0.085 }
  ],
  // Layout 10: 3 carimbos (2 na esquerda afastados | 1 na direita interno)
  [
    { top: '48%', left: '2.5%', width: 78, rotate: 9, opacity: 0.075 },
    { top: '22%', left: '20%', width: 84, rotate: -10, opacity: 0.085 },
    { top: '56%', right: '23%', width: 80, rotate: 7, opacity: 0.08 }
  ],
  // Layout 11: 5 carimbos (2 na esquerda extremos | 3 na direita diagonal ascendente)
  [
    { top: '24%', left: '3.5%', width: 82, rotate: -14, opacity: 0.08 },
    { top: '56%', left: '20%', width: 78, rotate: 8, opacity: 0.075 },
    { top: '60%', right: '24%', width: 76, rotate: -9, opacity: 0.075 },
    { top: '38%', right: '13%', width: 84, rotate: 11, opacity: 0.085 },
    { top: '18%', right: '2%', width: 80, rotate: -7, opacity: 0.08 }
  ],
  // Layout 12: 3 carimbos (1 na esquerda externa baixa | 2 na direita: interna alta + média)
  [
    { top: '58%', left: '5%', width: 86, rotate: 11, opacity: 0.085 },
    { top: '20%', right: '24%', width: 76, rotate: -8, opacity: 0.075 },
    { top: '46%', right: '9%', width: 82, rotate: -12, opacity: 0.08 }
  ],
  // Layout 13: 5 carimbos (3 na esquerda diagonal ascendente | 2 na direita extremos)
  [
    { top: '60%', left: '2%', width: 80, rotate: -9, opacity: 0.08 },
    { top: '38%', left: '13%', width: 84, rotate: 12, opacity: 0.085 },
    { top: '18%', left: '24%', width: 74, rotate: -6, opacity: 0.075 },
    { top: '26%', right: '21%', width: 78, rotate: 10, opacity: 0.08 },
    { top: '58%', right: '3.5%', width: 82, rotate: -11, opacity: 0.08 }
  ],
  // Layout 14: 3 carimbos (2 na esquerda: externa média + interna alta | 1 na direita externa baixa)
  [
    { top: '42%', left: '3.5%', width: 78, rotate: -13, opacity: 0.075 },
    { top: '20%', left: '22%', width: 84, rotate: 9, opacity: 0.085 },
    { top: '58%', right: '4.5%', width: 82, rotate: 7, opacity: 0.08 }
  ],
  // Layout 15: 3 carimbos (1 na esquerda média alta | 2 na direita: interna baixa + externa alta)
  [
    { top: '22%', left: '13%', width: 84, rotate: 8, opacity: 0.085 },
    { top: '58%', right: '22%', width: 78, rotate: -11, opacity: 0.075 },
    { top: '24%', right: '2.5%', width: 80, rotate: 12, opacity: 0.08 }
  ],
  // Layout 16: 5 carimbos (2 na esquerda baixos | 3 na direita alternados)
  [
    { top: '54%', left: '4%', width: 82, rotate: 10, opacity: 0.08 },
    { top: '60%', left: '19%', width: 76, rotate: -9, opacity: 0.075 },
    { top: '20%', right: '24%', width: 84, rotate: -12, opacity: 0.085 },
    { top: '52%', right: '12%', width: 78, rotate: 8, opacity: 0.075 },
    { top: '22%', right: '1.5%', width: 80, rotate: 11, opacity: 0.08 }
  ],
  // Layout 17: 3 carimbos (2 na esquerda: interna média + média baixa | 1 na direita média alta)
  [
    { top: '56%', left: '8%', width: 80, rotate: -8, opacity: 0.08 },
    { top: '30%', left: '23%', width: 76, rotate: 13, opacity: 0.075 },
    { top: '22%', right: '15%', width: 86, rotate: -10, opacity: 0.085 }
  ],
  // Layout 18: 5 carimbos (3 na esquerda alternados | 2 na direita internos)
  [
    { top: '52%', left: '1.5%', width: 80, rotate: -11, opacity: 0.08 },
    { top: '20%', left: '12%', width: 84, rotate: 9, opacity: 0.085 },
    { top: '56%', left: '23%', width: 74, rotate: -7, opacity: 0.075 },
    { top: '24%', right: '21%', width: 82, rotate: 12, opacity: 0.08 },
    { top: '54%', right: '8%', width: 78, rotate: -9, opacity: 0.075 }
  ],
  // Layout 19: 3 carimbos (1 na esquerda externa média | 2 na direita: interna alta + média baixa)
  [
    { top: '36%', left: '3%', width: 84, rotate: 11, opacity: 0.085 },
    { top: '22%', right: '23%', width: 78, rotate: -10, opacity: 0.075 },
    { top: '58%', right: '11%', width: 82, rotate: 8, opacity: 0.08 }
  ],
  // Layout 20: 3 carimbos (2 na esquerda: externa alta + média baixa | 1 na direita interna média)
  [
    { top: '20%', left: '4%', width: 80, rotate: -9, opacity: 0.08 },
    { top: '58%', left: '17%', width: 84, rotate: 12, opacity: 0.085 },
    { top: '38%', right: '21%', width: 76, rotate: -11, opacity: 0.075 }
  ],
  // Layout 21: 5 carimbos (2 na esquerda altos | 3 na direita em V)
  [
    { top: '22%', left: '5%', width: 78, rotate: 8, opacity: 0.075 },
    { top: '26%', left: '20%', width: 82, rotate: -12, opacity: 0.08 },
    { top: '24%', right: '24%', width: 76, rotate: 10, opacity: 0.075 },
    { top: '60%', right: '13%', width: 86, rotate: -8, opacity: 0.085 },
    { top: '28%', right: '2%', width: 80, rotate: 13, opacity: 0.08 }
  ],
  // Layout 22: 3 carimbos (1 na esquerda interna alta | 2 na direita: média alta + externa baixa)
  [
    { top: '22%', left: '21%', width: 82, rotate: -10, opacity: 0.08 },
    { top: '26%', right: '17%', width: 76, rotate: 9, opacity: 0.075 },
    { top: '58%', right: '3%', width: 84, rotate: -12, opacity: 0.085 }
  ],
  // Layout 23: 5 carimbos (3 na esquerda em V invertido | 2 na direita desalinhados)
  [
    { top: '58%', left: '2%', width: 80, rotate: 11, opacity: 0.08 },
    { top: '20%', left: '13%', width: 86, rotate: -9, opacity: 0.085 },
    { top: '56%', left: '24%', width: 74, rotate: 7, opacity: 0.075 },
    { top: '48%', right: '19%', width: 82, rotate: -13, opacity: 0.08 },
    { top: '20%', right: '4%', width: 78, rotate: 9, opacity: 0.075 }
  ],
  // Layout 24: 3 carimbos (2 na esquerda: média alta + interna baixa | 1 na direita externa média)
  [
    { top: '24%', left: '9%', width: 84, rotate: -11, opacity: 0.085 },
    { top: '58%', left: '22%', width: 78, rotate: 8, opacity: 0.075 },
    { top: '40%', right: '4%', width: 80, rotate: -9, opacity: 0.08 }
  ]
];

// Contador sequencial para atribuir automaticamente um layout diferente a cada ElegantDivider montado
let globalDividerSequence = 0;

export const DividerBlackFridayStamps = ({ variantIndex }) => {
  const assignedIndexRef = useRef(null);

  if (assignedIndexRef.current === null) {
    assignedIndexRef.current =
      typeof variantIndex === 'number'
        ? variantIndex
        : globalDividerSequence++;
  }

  const layoutIndex = assignedIndexRef.current % UNIQUE_DIVIDER_LAYOUTS.length;
  const stamps = UNIQUE_DIVIDER_LAYOUTS[layoutIndex];

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {stamps.map((stamp, idx) => (
        <motion.div
          key={idx}
          animate={{ opacity: [0.55, 1.35, 0.55] }}
          transition={{
            duration: 2.6 + (idx % 3) * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.35
          }}
          className="absolute scale-60 sm:scale-80 md:scale-100"
          style={{
            top: stamp.top,
            left: stamp.left,
            right: stamp.right
          }}
        >
          <BlackFridayStamp
            width={stamp.width}
            rotate={stamp.rotate}
            opacity={stamp.opacity}
            seed={700 + layoutIndex * 10 + idx}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BlackFridayStamp;
