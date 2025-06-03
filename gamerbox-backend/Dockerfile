FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
 git unzip libpq-dev && docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-scripts --no-interaction --no-dev --optimize-autoloader

RUN composer update

RUN mkdir -p public/uploads/profile_pictures && \
    chmod -R 775 public/uploads && \
    chown -R www-data:www-data public/uploads

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"] 