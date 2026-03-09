import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for React
// @vitejs/plugin-react enables JSX transform and Fast Refresh
// (hot module replacement — the page updates instantly as you save files)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // same port as CRA so nothing else needs to change
  },
});
