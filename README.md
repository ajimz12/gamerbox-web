# GamerBox
GamerBox es una aplicación web tipo red social que utiliza la API de RAWG para crear una comunidad de gamers.

## Descripción
Una plataforma moderna que permite a los jugadores seguir, reseñar y compartir sus experiencias gaming, utilizando la extensa base de datos de videojuegos de RAWG.

## Credenciales y Puertos

### Puertos utilizados
- Frontend: 5173 (desarrollo) / 80 (producción)
- Backend API: 9000 (interno) / 8081 (exterior)
- Base de datos MySQL: 3306
- PHPMyAdmin: 8080


### Credenciales por defecto
- Base de datos:
  - Usuario: root
  - Contraseña: (vacía)
  - Base de datos: gamerbox

- PHPMyAdmin:
  - URL: http://localhost:8080
  - Usuario: root
  - Contraseña: (vacía)

## Instrucciones de uso

### Requisitos previos
- Docker y Docker Compose
- Node.js 18 o superior
- PHP 8.2 o superior
- Composer

### Instalación y ejecución local

1. Clonar el repositorio:
```bash
SSH:
git clone git@github.com:ajimz12/gamerbox-web.git
HTTPS:
git clone https://github.com/ajimz12/gamerbox-web.git
cd gamerbox-web
```

2. Iniciar los servicios con Docker:
```bash
docker-compose up -d
```

3. Instalar dependencias del frontend:
```bash
cd gamerbox-frontend
npm install
```

4. Instalar dependencias del backend:
```bash
cd ../gamerbox-backend
composer install
```

5. Generar las claves JWT:
```bash
cd gamerbox-backend && mkdir -p config/jwt && openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:gamerbox 4096 && openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:gamerbox
```

```bash
chmod 644 gamerbox-backend/config/jwt/private.pem gamerbox-backend/config/jwt/public.pem
```

### Acceso a la aplicación
- Frontend: http://localhost:8081
- PHPMyAdmin: http://localhost:8080

## Datos de prueba

### Usuarios de prueba
- Email: gamerbox@gmail.com
- Contraseña: gamerbox
- Usuario normal

- Email: admin@admin.com
- Contraseña: admin
- Usuario administrador



### Notas importantes
- La aplicación utiliza JWT para la autenticación
- Las imágenes de perfil se almacenan en `/var/www/public/uploads/profile_pictures`
- El token JWT expira después de 24 horas
- La API está configurada para aceptar peticiones CORS desde `http://localhost:5173`


