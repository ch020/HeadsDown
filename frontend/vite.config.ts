import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
            manifest: {
                name: "HeadsDown",
                short_name: "HeadsDown",
                start_url: "/",
                display: "standalone",
                background_color: "#0b1020",
                theme_color: "#4f7bff",
                orientation: "landscape",
                icons: [
                    { src: "icon-192.png", sizes: "192x192", type: "image/png" },
                    { src: "icon-512.png", sizes: "512x512", type: "image/png" },
                    { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" }
                ]
            }
        })
    ],
    server: {
        host: true
    }
});