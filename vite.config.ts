import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    // IMPORTANTE: O nome do repositório deve estar entre barras
    base: '/Mel-e-magia-novo-usar-esse-/', 
    plugins: [react()],
    define: {
      'process.env': env
    },
    server: {
      port: 3000
    }
  };
});