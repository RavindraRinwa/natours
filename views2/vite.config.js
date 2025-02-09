import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Import the React plugin

export default defineConfig({
  plugins: [react()], // Add the React plugin
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000', // API server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
