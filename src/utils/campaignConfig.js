import { useState, useEffect } from 'react';

// Janela oficial da campanha Black Friday Deu Nó (Horário de Brasília UTC-3)
export const BLACK_FRIDAY_START_ISO = '2026-11-13T00:00:00-03:00';
export const BLACK_FRIDAY_END_ISO = '2026-11-15T23:59:59-03:00';

/**
 * Verifica se há override de pré-visualização na URL (?preview=original ou ?preview=bf)
 * Permite testar a virada para o site original a qualquer momento.
 */
export const getPreviewOverride = () => {
    if (typeof window === 'undefined') return null;
    try {
        const params = new URLSearchParams(window.location.search);
        const preview = (params.get('preview') || params.get('modo') || '').toLowerCase();
        if (preview === 'original' || preview === 'normal') return false;
        if (preview === 'bf' || preview === 'black-friday' || preview === 'blackfriday') return true;
    } catch {
        // Ignora falhas de parsing de URL
    }
    return null;
};

/**
 * Calcula o status completo da campanha Black Friday.
 * - Até 15/11 às 23:59:59 (BRT): isBlackFridayActive = true
 * - A partir de 16/11 às 00:00:00 (BRT): isBlackFridayActive = false (volta automaticamente ao site original)
 */
export const getBlackFridayState = (referenceDate = new Date()) => {
    const override = getPreviewOverride();
    const nowMs = referenceDate instanceof Date ? referenceDate.getTime() : Number(referenceDate);
    const startMs = new Date(BLACK_FRIDAY_START_ISO).getTime();
    const endMs = new Date(BLACK_FRIDAY_END_ISO).getTime();

    if (override === false) {
        return {
            isBlackFridayActive: false,
            phase: 'ended',
            targetDate: endMs,
            timeLeft: 0,
            label: 'Black Friday Encerrada',
            shortLabel: 'Encerrada',
            badgeText: 'ENCERRADO',
            infoText: '*Nossa Black Friday foi finalizada. Acompanhe nossas redes para novas coleções e lançamentos!'
        };
    }

    if (override === true || nowMs <= endMs) {
        if (nowMs < startMs) {
            return {
                isBlackFridayActive: true,
                phase: 'upcoming',
                targetDate: startMs,
                timeLeft: Math.max(0, startMs - nowMs),
                label: 'A Black Friday Começa em',
                shortLabel: 'Começa em:',
                badgeText: '13 A 15/11',
                infoText: '*A contagem regressiva começou! Nossa Black Friday exclusiva acontece nos dias 13, 14 e 15 de novembro.'
            };
        }

        return {
            isBlackFridayActive: true,
            phase: 'active',
            targetDate: endMs,
            timeLeft: Math.max(0, endMs - nowMs),
            label: 'A Black Friday Encerra em',
            shortLabel: 'Termina em:',
            badgeText: 'BLACK FRIDAY',
            infoText: '*Black Friday Deu Nó ativa! Descontos especiais em todo o catálogo até 15/11 às 23:59.'
        };
    }

    // Após 15/11 às 23:59:59-03:00 -> Desativa a Black Friday e volta para o site original
    return {
        isBlackFridayActive: false,
        phase: 'ended',
        targetDate: endMs,
        timeLeft: 0,
        label: 'Black Friday Encerrada',
        shortLabel: 'Encerrada',
        badgeText: 'ENCERRADO',
        infoText: '*Nossa Black Friday foi finalizada. Acompanhe nossas redes para novas coleções e lançamentos!'
    };
};

/**
 * Hook reativo que monitora em tempo real o término da Black Friday.
 * Assim que o relógio atinge 16/11 às 00:00:00 (BRT), atualiza automaticamente
 * toda a interface para a versão original sem precisar recarregar a página.
 */
export const useBlackFridayStatus = () => {
    const [state, setState] = useState(() => getBlackFridayState());

    useEffect(() => {
        const checkStatus = () => {
            const next = getBlackFridayState();
            setState((prev) => {
                if (
                    prev.isBlackFridayActive !== next.isBlackFridayActive ||
                    prev.phase !== next.phase
                ) {
                    return next;
                }
                return prev;
            });
        };

        const interval = setInterval(checkStatus, 1000);
        window.addEventListener('popstate', checkStatus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('popstate', checkStatus);
        };
    }, []);

    return state;
};
