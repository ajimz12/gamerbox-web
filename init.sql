-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 02-06-2025 a las 12:46:20
-- Versión del servidor: 8.0.42
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gamerbox`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `follow`
--

CREATE TABLE `follow` (
  `id` int NOT NULL,
  `follower_id` int DEFAULT NULL,
  `followed_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `follow`
--

INSERT INTO `follow` (`id`, `follower_id`, `followed_id`, `created_at`) VALUES
(35, 12, 16, '2025-06-02 12:07:13'),
(36, 12, 17, '2025-06-02 12:07:49'),
(37, 16, 12, '2025-06-02 12:22:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `game_reference`
--

CREATE TABLE `game_reference` (
  `id` int NOT NULL,
  `rawg_id` int NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `background_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `game_reference`
--

INSERT INTO `game_reference` (`id`, `rawg_id`, `slug`, `name`, `background_image`) VALUES
(100, 38283, 'guitar-hero-3-legends-of-rock', 'Guitar Hero III: Legends of Rock', 'https://media.rawg.io/media/games/444/444d319b3156101aeef3d1a8df219f3f.jpg'),
(101, 416, 'grand-theft-auto-san-andreas', 'Grand Theft Auto: San Andreas', 'https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg'),
(102, 35314, 'silent-hill-3', 'Silent Hill 3', 'https://media.rawg.io/media/games/594/59415e7fe99545bb303c108b19f38667.jpg'),
(103, 22511, 'the-legend-of-zelda-breath-of-the-wild', 'The Legend of Zelda: Breath of the Wild', 'https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg'),
(104, 3790, 'outlast', 'Outlast', 'https://media.rawg.io/media/games/9dd/9ddabb34840ea9227556670606cf8ea3.jpg'),
(105, 4459, 'grand-theft-auto-iv', 'Grand Theft Auto IV', 'https://media.rawg.io/media/games/4a0/4a0a1316102366260e6f38fd2a9cfdce.jpg'),
(106, 39118, 'guitar-hero-metallica', 'Guitar Hero: Metallica', 'https://media.rawg.io/media/games/5b4/5b4b871003501327cd08085023d1f085.jpg'),
(107, 27714, 'super-mario-advance-4-super-mario-bros-3', 'Super Mario Advance 4: Super Mario Bros. 3', 'https://media.rawg.io/media/screenshots/3a6/3a674b1817d889fb917d5f3ea70e7f38.jpg'),
(108, 2634, 'bully', 'Bully', 'https://media.rawg.io/media/games/682/682973f711e9ea6fcf11f71cbb39cdd5.jpeg'),
(109, 57842, 'tekken-3', 'Tekken 3', 'https://media.rawg.io/media/games/4aa/4aa1440932f4a12d9d0ea70a5e2164f6.jpg'),
(110, 22513, 'uncharted-2-among-thieves', 'Uncharted 2: Among Thieves', 'https://media.rawg.io/media/games/74b/74b239f6ef0216a2f66e652d54abb2e6.jpg'),
(111, 13583, 'the-lord-of-the-rings-online', 'The Lord of the Rings Online', 'https://media.rawg.io/media/screenshots/179/17969ec669130c15b8b480fcc43c53fe.jpg'),
(112, 378578, 'grand-theft-auto-iv-complete-edition', 'Grand Theft Auto IV: Complete Edition', 'https://media.rawg.io/media/screenshots/e59/e59cc96f38cc93af5a396173878018d7.jpg'),
(113, 1303, 'nba-2k17', 'NBA 2K17', 'https://media.rawg.io/media/games/5ee/5eec6d58cd7a4dde9c6486359c7e6842.jpg'),
(114, 13627, 'undertale', 'Undertale', 'https://media.rawg.io/media/games/ffe/ffed87105b14f5beff72ff44a7793fd5.jpg'),
(115, 5205, 'manhunt-2', 'Manhunt 2', 'https://media.rawg.io/media/games/2a8/2a8e6acdf8cde8915920f568bd6f86b0.jpg'),
(117, 28623, 'batman-arkham-city-2', 'Batman: Arkham City', 'https://media.rawg.io/media/games/b5a/b5a1226bfd971284a735a4a0969086b3.jpg'),
(118, 356714, 'among-us', 'Among Us', 'https://media.rawg.io/media/games/e74/e74458058b35e01c1ae3feeb39a3f724.jpg'),
(119, 5689, 'the-sims-3', 'The Sims 3', 'https://media.rawg.io/media/games/369/36914d895c20e35f273286145c267764.jpg'),
(120, 1358, 'papers-please', 'Papers, Please', 'https://media.rawg.io/media/games/6d3/6d33014a4ed48a19c30a77ead5a0f62e.jpg'),
(121, 56123, 'metroid-prime', 'Metroid Prime', 'https://media.rawg.io/media/games/c86/c86bc047ba949959a90fe24209d59439.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `list_entity`
--

CREATE TABLE `list_entity` (
  `id` int NOT NULL,
  `creator_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `list_entity`
--

INSERT INTO `list_entity` (`id`, `creator_id`, `title`, `description`, `is_public`, `created_at`) VALUES
(24, 12, 'lista gamerbox', 'juegos favoritos', 1, '2025-06-02 12:02:26'),
(25, 16, 'nueva lista', 'mis juegos', 1, '2025-06-02 12:20:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `list_item`
--

CREATE TABLE `list_item` (
  `id` int NOT NULL,
  `list_id` int DEFAULT NULL,
  `game_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `list_item`
--

INSERT INTO `list_item` (`id`, `list_id`, `game_id`) VALUES
(81, 24, 105),
(82, 24, 106),
(83, 24, 107),
(84, 24, 108),
(85, 25, 117),
(86, 25, 118),
(87, 25, 119),
(88, 25, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint NOT NULL,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review`
--

CREATE TABLE `review` (
  `id` int NOT NULL,
  `author_id` int DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `played_before` tinyint(1) NOT NULL DEFAULT '0',
  `played_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `review`
--

INSERT INTO `review` (`id`, `author_id`, `game_id`, `rating`, `text`, `created_at`, `played_before`, `played_at`) VALUES
(80, 12, 109, 5, 'Es un muy buen juego ', '2025-06-02 12:04:33', 0, '2025-06-02 00:00:00'),
(81, 12, 110, 4, 'Increible experiencia', '2025-06-02 12:05:44', 1, '2025-05-30 00:00:00'),
(83, 16, 121, 5, 'Un muy buen juego, lo recordaba asi', '2025-06-02 12:43:22', 1, '2025-05-30 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review_comment`
--

CREATE TABLE `review_comment` (
  `id` int NOT NULL,
  `author_id` int DEFAULT NULL,
  `review_id` int DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review_likes`
--

CREATE TABLE `review_likes` (
  `review_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_profile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_profile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `banned` tinyint(1) NOT NULL DEFAULT '0'
) ;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `profile_picture`, `roles`, `password`, `location`, `instagram_profile`, `twitter_profile`, `description`, `banned`) VALUES
(12, 'gamerbox@gmail.com', 'gamerbox', 'gamerbox-683d91a7c9f40.jpg', '[\"ROLE_USER\"]', '$2y$13$ewtbuG4zOmR43JlJSGG2WuVGDqL1/ycAow7BZ/PLfFjm.w0KcNbx.', 'Granada', '@gamerbox', '@gamerbox', 'Hola', 0),
(13, 'sans@gmail.com', 'sans', NULL, '[\"ROLE_USER\"]', '$2y$13$Xwfi6dwN0EPcpb5nZZPLPOzqcTE0XN6h53B2MXCAEkXpejpqMRA0W', NULL, NULL, NULL, NULL, 0),
(14, 'papyrus@gmail.com', 'papyrus', NULL, '[\"ROLE_USER\"]', '$2y$13$XMTqP6lrihIO5GLSLCNKPOtEtBQCi4G0yLiQIrEsSCgKW4Xy.QpJC', NULL, NULL, NULL, NULL, 0),
(15, 'asgore@gmail.com', 'asgore', NULL, '[\"ROLE_USER\"]', '$2y$13$bgF.xA93Hwb9p02HD9rE8uEscvEm6iHPtrLiozK7JKa87zEP1ByyO', NULL, NULL, NULL, NULL, 0),
(16, 'nikobellic@gmail.com', 'nikobellic', 'nikobellic-683d95777aaa9.jpg', '[\"ROLE_USER\"]', '$2y$13$oZrIpn2QJHo3LaEZsyJ6Xep6XRllmXQjm2OsuVuijf2BUDJxsZhb6', 'Barcelona', '@nikobellic', '@nikobellic', 'Hola', 0),
(17, 'tonymontana@gmail.com', 'tonymontana', NULL, '[\"ROLE_USER\"]', '$2y$13$W3dXrT1fV.jP7CIYKi1bcej3MRL5Hi0gKn.eOThCwaptOZqV7VsD6', NULL, NULL, NULL, NULL, 0),
(18, 'admin@admin.com', 'admin', NULL, '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$2y$13$CsRzcxDq5FZKkj9Rp7yUYeJTnuiH.rPKYKzuYEBeJaeiX.5ExRvJm', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_game`
--

CREATE TABLE `user_game` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  `is_favorite` tinyint(1) NOT NULL,
  `played_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_super_favorite` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_game`
--

INSERT INTO `user_game` (`id`, `user_id`, `game_id`, `is_favorite`, `played_at`, `status`, `is_super_favorite`) VALUES
(65, 12, 100, 0, '2025-06-02 11:54:31', 'pending', 1),
(66, 12, 101, 0, '2025-06-02 11:54:54', 'pending', 1),
(67, 12, 102, 0, '2025-06-02 11:55:09', 'pending', 1),
(68, 12, 103, 0, '2025-06-02 11:55:30', 'pending', 1),
(69, 12, 104, 0, '2025-06-02 11:55:50', 'pending', 0),
(70, 12, 109, 0, '2025-06-02 12:04:33', 'played', 0),
(71, 12, 110, 1, '2025-06-02 12:05:17', 'played', 0),
(72, 16, 111, 0, '2025-06-02 12:10:02', 'pending', 1),
(73, 16, 112, 0, '2025-06-02 12:10:20', 'pending', 1),
(74, 16, 113, 0, '2025-06-02 12:10:40', 'pending', 1),
(75, 16, 114, 0, '2025-06-02 12:10:57', 'pending', 1),
(76, 16, 115, 0, '2025-06-02 12:11:55', 'pending', 1),
(78, 16, 121, 1, '2025-06-02 12:42:45', 'played', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_68344470AC24F853` (`follower_id`),
  ADD KEY `IDX_68344470D956F010` (`followed_id`);

--
-- Indices de la tabla `game_reference`
--
ALTER TABLE `game_reference`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `list_entity`
--
ALTER TABLE `list_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_97F8864661220EA6` (`creator_id`);

--
-- Indices de la tabla `list_item`
--
ALTER TABLE `list_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5AD5FAF73DAE168B` (`list_id`),
  ADD KEY `IDX_5AD5FAF7E48FD905` (`game_id`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_game_review` (`author_id`,`game_id`),
  ADD KEY `IDX_794381C6F675F31B` (`author_id`),
  ADD KEY `IDX_794381C6E48FD905` (`game_id`);

--
-- Indices de la tabla `review_comment`
--
ALTER TABLE `review_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F9AE69BF675F31B` (`author_id`),
  ADD KEY `IDX_F9AE69B3E2E969B` (`review_id`);

--
-- Indices de la tabla `review_likes`
--
ALTER TABLE `review_likes`
  ADD PRIMARY KEY (`review_id`,`user_id`),
  ADD KEY `IDX_5A4462663E2E969B` (`review_id`),
  ADD KEY `IDX_5A446266A76ED395` (`user_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- Indices de la tabla `user_game`
--
ALTER TABLE `user_game`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_59AA7D45A76ED395` (`user_id`),
  ADD KEY `IDX_59AA7D45E48FD905` (`game_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `game_reference`
--
ALTER TABLE `game_reference`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT de la tabla `list_entity`
--
ALTER TABLE `list_entity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `list_item`
--
ALTER TABLE `list_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `review`
--
ALTER TABLE `review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT de la tabla `review_comment`
--
ALTER TABLE `review_comment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_game`
--
ALTER TABLE `user_game`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `FK_68344470AC24F853` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_68344470D956F010` FOREIGN KEY (`followed_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `list_entity`
--
ALTER TABLE `list_entity`
  ADD CONSTRAINT `FK_97F8864661220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `list_item`
--
ALTER TABLE `list_item`
  ADD CONSTRAINT `FK_5AD5FAF73DAE168B` FOREIGN KEY (`list_id`) REFERENCES `list_entity` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5AD5FAF7E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK_794381C6E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_794381C6F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `review_comment`
--
ALTER TABLE `review_comment`
  ADD CONSTRAINT `FK_F9AE69B3E2E969B` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_F9AE69BF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `review_likes`
--
ALTER TABLE `review_likes`
  ADD CONSTRAINT `FK_5A4462663E2E969B` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5A446266A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_game`
--
ALTER TABLE `user_game`
  ADD CONSTRAINT `FK_59AA7D45A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_59AA7D45E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
