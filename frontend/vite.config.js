import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'custom-server-message',
      configureServer() {
        console.log('\n⚙️  Vite dev server started (internal port 3000 - proxied by backend)');
        console.log('   👉 Access your app at: http://localhost:8080\n');
      }
    }
  ],
  cacheDir: '/tmp/vite-cache',
  server: {
    host: "127.0.0.1",
    port: 8080,
    strictPort: true,
    clearScreen: false,
    // Suppress the default Vite URL output
    hmr: {
      overlay: true
    }
  }
})
