FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install \
    pdo_mysql \
    intl \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

ENV APP_ENV=prod
ENV APP_DEBUG=0

# IMPORTANTE: NO ejecutar scripts para evitar cache:clear fallando en build
RUN composer install --no-dev --optimize-autoloader --no-scripts

RUN mkdir -p /var/www/public/uploads/profile_pictures \
    && chown -R www-data:www-data /var/www/public/uploads \
    && mkdir -p /var/www/config/jwt \
    && chown -R www-data:www-data /var/www/config/jwt \
    && chmod -R 644 /var/www/config/jwt/*.pem

EXPOSE 9000

CMD ["php-fpm"]
