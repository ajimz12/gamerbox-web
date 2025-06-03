FROM node:20-alpine

# Soluciona problemas con esbuild
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

# Instalar dependencias con flags de optimización
RUN npm install --production --no-optional

COPY . .

# Configurar variables de entorno para optimizar Node.js
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV VITE_OPTIMIZE_DEP=true

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
