import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serve from root in dev for simpler local/stackblitz/codesandbox URLs;
// keep '/vianeo-tools/' only for production builds/deploy.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/vianeo-tools/' : '/',
}))
