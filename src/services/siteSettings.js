// src/services/siteSettings.js
// Serviço para consulta leve e reativa das configurações do site (Hero, banners, etc.)

const DEFAULT_HERO_CONFIG = {
    mediaType: 'banner', // 'banner' ou 'video'
    desktopBanner: '/assets/desktop_banner_1.webp',
    mobileBanner: '/assets/Mobile_banner_1.webp',
    bannersList: [
        {
            desktop: '/assets/desktop_banner_1.webp',
            mobile: '/assets/Mobile_banner_1.webp'
        },
        {
            desktop: '/assets/desktop_banner_2.webp',
            mobile: '/assets/mobile_banner_2.webp'
        },
        {
            desktop: '/assets/desktop_banner_3.webp',
            mobile: '/assets/mobile_banner_3.webp'
        }
    ]
};

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://qubfrnezfmbrpmxintdq.supabase.co';
const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1YmZybmV6Zm1icnBteGludGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MzgxMDIsImV4cCI6MjA5NjIxNDEwMn0.IVZkMEHx1ftdURf9i6kD6qd4nuddLdUAJ4SElvLQYX8';

let cachedConfig = null;

export async function getHeroSettings(forceRefresh = false) {
    if (!forceRefresh && cachedConfig) {
        return cachedConfig;
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/website_settings?key=in.(hero_media_type,hero_banner_desktop,hero_banner_mobile,hero_banners_list)&select=key,value`,
            {
                cache: 'no-store',
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();
        const settingsMap = {};
        data.forEach(item => {
            settingsMap[item.key] = item.value;
        });

        let bannersList = DEFAULT_HERO_CONFIG.bannersList;
        if (settingsMap.hero_banners_list) {
            try {
                bannersList = JSON.parse(settingsMap.hero_banners_list);
            } catch (e) {
                console.warn('Erro ao parsear hero_banners_list:', e);
            }
        } else if (settingsMap.hero_banner_desktop || settingsMap.hero_banner_mobile) {
            bannersList = [{
                desktop: settingsMap.hero_banner_desktop || DEFAULT_HERO_CONFIG.desktopBanner,
                mobile: settingsMap.hero_banner_mobile || DEFAULT_HERO_CONFIG.mobileBanner
            }];
        }

        cachedConfig = {
            mediaType: settingsMap.hero_media_type || DEFAULT_HERO_CONFIG.mediaType,
            desktopBanner: settingsMap.hero_banner_desktop || DEFAULT_HERO_CONFIG.desktopBanner,
            mobileBanner: settingsMap.hero_banner_mobile || DEFAULT_HERO_CONFIG.mobileBanner,
            bannersList: bannersList && bannersList.length > 0 ? bannersList : DEFAULT_HERO_CONFIG.bannersList
        };

        try {
            localStorage.setItem('site_hero_config', JSON.stringify(cachedConfig));
        } catch (e) {}

        return cachedConfig;
    } catch (error) {
        console.warn('Não foi possível carregar configurações remotas do Hero, tentando cache local:', error);
        try {
            const local = localStorage.getItem('site_hero_config');
            if (local) {
                const parsed = JSON.parse(local);
                if (parsed && (parsed.desktopBanner || parsed.mobileBanner)) {
                    cachedConfig = parsed;
                    return cachedConfig;
                }
            }
        } catch (e) {}
        return DEFAULT_HERO_CONFIG;
    }
}
