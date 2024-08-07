import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    host:'10.10.248.166',
    https: {
      key: fs.readFileSync("../client-key.pem"),
      cert: fs.readFileSync("../client-cert.pem"),
      ca: fs.readFileSync("../ca.crt"),
      
    },
    port: 443
  }
})
