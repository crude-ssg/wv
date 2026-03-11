import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import phpApiErrorsToTs from './vite/php-api-errors-to-ts'
import phpSchemaToTs from "./vite/php-schema-to-ts"

// https://vite.dev/config/
export default defineConfig({
  base: "/video-gen/",
  plugins: [
    react(),
    tailwindcss(),
    phpApiErrorsToTs({
      input: "api/Exceptions.php",
      output: "src/lib/api.errors.gen.ts"
    }),
    phpSchemaToTs({
      input: "api/Schemas.php",
      output: "src/lib/api.types.gen.ts"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
