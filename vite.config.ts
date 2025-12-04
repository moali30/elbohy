import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // هام جداً: يجعل المسارات نسبية لتعمل على أي استضافة
});