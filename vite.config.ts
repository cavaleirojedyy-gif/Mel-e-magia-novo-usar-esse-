import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (como API_KEY e VITE_SUPABASE_*)
  // O terceiro argumento '' garante que carregamos todas as vars, não apenas as que começam com VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    base: './', // Define caminhos relativos para funcionar no GitHub Pages
    plugins: [react()],
    define: {
      // Polifill para que process.env.API_KEY funcione no navegador
      'process.env': env
    },
    server: {
      port: 3000
    }
  };
});