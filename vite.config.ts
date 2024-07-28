import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  // server: {
  //   host:'node06.cs.colman.ac.il',
  //   https: {
  //     key: fs.readFileSync("../client-key.pem"),
  //     cert: fs.readFileSync("../client-cert.pem"),
  //   },
  //   port: 443
  // }
})
