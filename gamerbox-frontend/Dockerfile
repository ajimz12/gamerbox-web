FROM node:18-alpine

WORKDIR /app

# Configurar Node para producción
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 5173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]