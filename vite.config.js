import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { open: true } // opens the browser automatically on `npm run dev`
});
