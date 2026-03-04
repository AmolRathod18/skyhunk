import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['akash.png'],
      manifest: {
        name: 'Akash Athavani | Fitness Coach',
        short_name: 'SkyHunk',
        description: 'Personal fitness coaching by Akash Athavani — Cult Neo Gym, Bengaluru',
        theme_color: '#ffcc00',
        background_color: '#05070a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/akash.png', sizes: '192x192', type: 'image/png' },
          { src: '/akash.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
