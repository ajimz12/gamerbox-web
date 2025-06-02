-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2025 a las 11:55:29
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.12

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
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `follow`
--

CREATE TABLE `follow` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) DEFAULT NULL,
  `followed_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `follow`
--

INSERT INTO `follow` (`id`, `follower_id`, `followed_id`, `created_at`) VALUES
(29, 5, 6, '2025-05-12 17:45:35'),
(30, 6, 5, '2025-05-21 13:28:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `game_reference`
--

CREATE TABLE `game_reference` (
  `id` int(11) NOT NULL,
  `rawg_id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `background_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `game_reference`
--

INSERT INTO `game_reference` (`id`, `rawg_id`, `slug`, `name`, `background_image`) VALUES
(16, 5679, 'the-elder-scrolls-v-skyrim', 'The Elder Scrolls V: Skyrim', 'https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg'),
(17, 3939, 'payday-2', 'PAYDAY 2', 'https://media.rawg.io/media/games/73e/73eecb8909e0c39fb246f457b5d6cbbe.jpg'),
(18, 13536, 'portal', 'Portal', 'https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg'),
(19, 3498, 'grand-theft-auto-v', 'Grand Theft Auto V', 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg'),
(20, 802, 'borderlands-2', 'Borderlands 2', 'https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f140cc4825868e858cb.jpg'),
(21, 13537, 'half-life-2', 'Half-Life 2', 'https://media.rawg.io/media/games/b8c/b8c243eaa0fbac8115e0cdccac3f91dc.jpg'),
(22, 3439, 'life-is-strange-episode-1-2', 'Life is Strange', 'https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg'),
(23, 28, 'red-dead-redemption-2', 'Red Dead Redemption 2', 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg'),
(24, 4546, 'red-dead-redemption-undead-nightmare', 'Red Dead Redemption: Undead Nightmare', 'https://media.rawg.io/media/games/632/63248c06f2dbf7362ed7add26603d40f.jpg'),
(25, 1115, 'red-dead-revolver', 'Red Dead Revolver', 'https://media.rawg.io/media/games/f7e/f7e2d60d8e813593c831a07d28bba5c3.jpg'),
(26, 286398, 'a', 'a (itch)', 'https://media.rawg.io/media/screenshots/7b8/7b820b4d50344bd61d43eb005b9900be.jpg'),
(27, 35502, 'torrente-el-juego', 'Torrente: El Juego', 'https://media.rawg.io/media/screenshots/74e/74eb85c60b0e137209bf60abd5bbd7ca.jpg'),
(28, 2647, 'manhunt', 'Manhunt', 'https://media.rawg.io/media/games/c23/c23b578d6a9dd1c73ee403157184e793.jpg'),
(29, 5286, 'tomb-raider', 'Tomb Raider (2013)', 'https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg'),
(30, 159125, 'j-ball', 'J-Ball', 'https://media.rawg.io/media/screenshots/5c5/5c5b56003fa182944d4e78307cd23e82.jpg'),
(31, 3265, 'god-of-war-iii-remastered', 'God of War III Remastered', 'https://media.rawg.io/media/games/4b6/4b67558bf04c7211aabeff179271bdd8.jpg'),
(32, 13627, 'undertale', 'Undertale', 'https://media.rawg.io/media/games/ffe/ffed87105b14f5beff72ff44a7793fd5.jpg'),
(33, 622493, 'super-monkey-ball-banana-mania', 'Super Monkey Ball: Banana Mania', 'https://media.rawg.io/media/games/5a4/5a447ceb56af54944c5a09fc42ba6595.jpg'),
(34, 952559, 'texas-chainsaw-massacre-the-next-generation-the-ga', 'Texas Chainsaw Massacre: The Next Generation - The Game', 'https://media.rawg.io/media/screenshots/d35/d353fddd665b8e12377067cacb995eca.jpg'),
(35, 442854, 'mafia', 'Mafia: Definitive Edition', 'https://media.rawg.io/media/games/345/3452d9d4483686c602372e0e6b3bb4cc.jpg'),
(36, 3790, 'outlast', 'Outlast', 'https://media.rawg.io/media/games/9dd/9ddabb34840ea9227556670606cf8ea3.jpg'),
(37, 416, 'grand-theft-auto-san-andreas', 'Grand Theft Auto: San Andreas', 'https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg'),
(38, 5205, 'manhunt-2', 'Manhunt 2', 'https://media.rawg.io/media/games/2a8/2a8e6acdf8cde8915920f568bd6f86b0.jpg'),
(39, 438620, 'the-lord-of-the-rings-gollum', 'The Lord of the Rings: Gollum', 'https://media.rawg.io/media/games/470/470fb8435cdea25bda1126e0b8e0a3b0.jpg'),
(40, 868086, 'silent-hill-2-remake', 'Silent Hill 2', 'https://media.rawg.io/media/games/09b/09b41c1a2c5761c5b1772a4ae238bb0e.jpg'),
(41, 39118, 'guitar-hero-metallica', 'Guitar Hero: Metallica', 'https://media.rawg.io/media/games/5b4/5b4b871003501327cd08085023d1f085.jpg'),
(42, 385481, 'being-a-dik-season-1', 'Being a DIK - Season 1', 'https://media.rawg.io/media/screenshots/7d5/7d5e713dc3c7effc4eed32d665309e6e.jpg'),
(43, 374517, 'h-rescue', 'H-Rescue', 'https://media.rawg.io/media/screenshots/e47/e474a9ea5d295739118938259589b7ff.jpg'),
(44, 4200, 'portal-2', 'Portal 2', 'https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg'),
(45, 4291, 'counter-strike-global-offensive', 'Counter-Strike: Global Offensive', 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg'),
(46, 3882, 'god-of-war-ascension', 'God of War: Ascension', 'https://media.rawg.io/media/games/c13/c13815d4923dc9778ff959985ad4dd43.jpg'),
(47, 32161, 'the-lord-of-the-rings-the-fellowship-of-the-ring', 'The Lord of the Rings: The Fellowship of the Ring', 'https://media.rawg.io/media/screenshots/77b/77b09856b521f8a4410d516da249a38a.jpg'),
(48, 3287, 'batman-arkham-knight', 'Batman: Arkham Knight', 'https://media.rawg.io/media/games/310/3106b0e012271c5ffb16497b070be739.jpg'),
(49, 324997, 'baldurs-gate-3', 'Baldur\'s Gate III', 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg'),
(50, 28026, 'super-mario-odyssey', 'Super Mario Odyssey', 'https://media.rawg.io/media/games/267/267bd0dbc496f52692487d07d014c061.jpg'),
(51, 4544, 'red-dead-redemption', 'Red Dead Redemption', 'https://media.rawg.io/media/games/686/686909717c3aa01518bc42ae2bf4259e.jpg'),
(52, 1002185, 'payasos-balazos', 'Payasos & Balazos', 'https://media.rawg.io/media/screenshots/a82/a82f5426ee6c9d4552cf6aaa981e8a1d.jpg'),
(53, 29642, 'silent-hill-2', 'Silent Hill 2 (2001)', 'https://media.rawg.io/media/games/003/0033ae7d21418ff5a7807ab2c7d90247.jpg'),
(54, 9835, 'outlast-2', 'Outlast 2', 'https://media.rawg.io/media/games/880/880f6aa65fe9d786f1a455963df76180.jpg'),
(55, 11726, 'dead-cells', 'Dead Cells', 'https://media.rawg.io/media/games/f90/f90ee1a4239247a822771c40488e68c5.jpg'),
(56, 980502, 'kingdom-come-deliverance-ii', 'Kingdom Come: Deliverance II', 'https://media.rawg.io/media/games/d84/d842fec4ae7bbd782d330f678c980f7f.jpg'),
(57, 39707, 'god-of-war-ii', 'God of War II', 'https://media.rawg.io/media/games/615/615e9fc0a325e0d87b84dad029b8b7b9.jpg'),
(58, 39039, 'god-of-war-iii', 'God of War III', 'https://media.rawg.io/media/games/289/289951d92239d05f2a663d632aa3888a.jpg'),
(59, 4853, 'god-of-war-ghost-of-sparta', 'God of War: Ghost of Sparta', 'https://media.rawg.io/media/games/5c2/5c2aef36106ee4751cdfda8fd408aaf5.jpg'),
(60, 4852, 'god-of-war-collection', 'God of War Collection', 'https://media.rawg.io/media/screenshots/5bb/5bbc83c6b4789122cc30b62877a9dcf6.jpg'),
(61, 29179, 'god-of-war', 'God of War I', 'https://media.rawg.io/media/games/1aa/1aa4ca34a8a6bb57a2e065c8332dc230.jpg'),
(62, 13583, 'the-lord-of-the-rings-online', 'The Lord of the Rings Online', 'https://media.rawg.io/media/screenshots/179/17969ec669130c15b8b480fcc43c53fe.jpg'),
(63, 30899, 'mafia-the-city-of-lost-heaven', 'Mafia: The City of Lost Heaven', 'https://media.rawg.io/media/games/74c/74ca0ec569682a150f3c6f9f661fb6a5.jpg'),
(64, 378578, 'grand-theft-auto-iv-complete-edition', 'Grand Theft Auto IV: Complete Edition', 'https://media.rawg.io/media/screenshots/e59/e59cc96f38cc93af5a396173878018d7.jpg'),
(65, 302, 'ninja-pizza-girl', 'Ninja Pizza Girl', 'https://media.rawg.io/media/screenshots/fe3/fe356c2c94aa4a7bab58b635014dae08.jpg'),
(66, 430, 'grand-theft-auto-vice-city', 'Grand Theft Auto: Vice City', 'https://media.rawg.io/media/games/13a/13a528ac9cf48bbb6be5d35fe029336d.jpg'),
(67, 17576, 'batman-arkham-city-goty', 'Batman: Arkham City - Game of the Year Edition', 'https://media.rawg.io/media/games/c50/c5085506fe4b5e20fc7aa5ace842c20b.jpg'),
(68, 35314, 'silent-hill-3', 'Silent Hill 3', 'https://media.rawg.io/media/games/594/59415e7fe99545bb303c108b19f38667.jpg'),
(69, 5868, 'five-nights-at-freddys', 'Five Nights at Freddy\'s', 'https://media.rawg.io/media/games/bdc/bdcb4e528bdd91bc4b3ab75fedb31f7b.jpg'),
(70, 452649, 'resident-evil-village', 'Resident Evil: Village', 'https://media.rawg.io/media/games/6cc/6cc23249972a427f697a3d10eb57a820.jpg'),
(71, 58813, 'resident-evil-2-2019', 'Resident Evil 2', 'https://media.rawg.io/media/games/053/053fc543bf488349610f1ae2d0c1b51b.jpg'),
(72, 386752, 'slenderman', 'Slenderman', 'https://media.rawg.io/media/screenshots/7bc/7bc49c495430d0887b310ec6c61e77d0.jpeg'),
(73, 38991, 'saw', 'Saw: The Video Game', 'https://media.rawg.io/media/games/10d/10d066aec891b24b3049b82543120cd8.jpg'),
(74, 993875, 'marvel-rivals', 'Marvel Rivals', 'https://media.rawg.io/media/screenshots/3f0/3f0fdfc7c71655366aa83ab80ecab9b8.jpg'),
(75, 4286, 'bioshock', 'BioShock', 'https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg'),
(76, 4459, 'grand-theft-auto-iv', 'Grand Theft Auto IV', 'https://media.rawg.io/media/games/4a0/4a0a1316102366260e6f38fd2a9cfdce.jpg'),
(77, 2634, 'bully', 'Bully', 'https://media.rawg.io/media/games/682/682973f711e9ea6fcf11f71cbb39cdd5.jpeg'),
(78, 1303, 'nba-2k17', 'NBA 2K17', 'https://media.rawg.io/media/games/5ee/5eec6d58cd7a4dde9c6486359c7e6842.jpg'),
(79, 3636, 'the-last-of-us-remastered', 'The Last Of Us Remastered', 'https://media.rawg.io/media/games/364/3642d850efb217c58feab80b8affaa89.jpg'),
(80, 42215, 'dying-light', 'Dying Light', 'https://media.rawg.io/media/games/4a5/4a5ce21f529cf8fd4670b4c3188b25df.jpg'),
(81, 356714, 'among-us', 'Among Us', 'https://media.rawg.io/media/games/e74/e74458058b35e01c1ae3feeb39a3f724.jpg'),
(82, 22509, 'minecraft', 'Minecraft', 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg'),
(83, 59248, 'shadow-of-the-colossus-2', 'Shadow of the Colossus', 'https://media.rawg.io/media/games/8ea/8ea1e2850d7568bc9733d546c0ac6ce1.jpg'),
(84, 11973, 'shadow-of-mordor', 'Middle-earth: Shadow of Mordor', 'https://media.rawg.io/media/games/d1a/d1a2e99ade53494c6330a0ed945fe823.jpg'),
(85, 22513, 'uncharted-2-among-thieves', 'Uncharted 2: Among Thieves', 'https://media.rawg.io/media/games/74b/74b239f6ef0216a2f66e652d54abb2e6.jpg'),
(86, 58175, 'god-of-war-2', 'God of War (2018)', 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg'),
(87, 58890, 'need-for-speed-most-wanted', 'Need For Speed: Most Wanted', 'https://media.rawg.io/media/games/41b/41ba37b6a3e706dc1d27d49afbf0f72a.jpg'),
(88, 3990, 'the-last-of-us', 'The Last Of Us', 'https://media.rawg.io/media/games/a5a/a5a7fb8d9cb8063a8b42ee002b410db6.jpg'),
(89, 57842, 'tekken-3', 'Tekken 3', 'https://media.rawg.io/media/games/4aa/4aa1440932f4a12d9d0ea70a5e2164f6.jpg'),
(90, 262384, 'tekken-5', 'Tekken 5', 'https://media.rawg.io/media/games/ff8/ff8bdb62481960550013c57025d47812.jpg'),
(91, 51325, 'the-last-of-us-part-2', 'The Last of Us Part II', 'https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg'),
(92, 857, 'halo-the-master-chief-collection', 'Halo: The Master Chief Collection', 'https://media.rawg.io/media/games/c24/c24f4434882ae9c2c8d9d38de82cb7a5.jpg'),
(93, 635386, 'symphonia-2', 'Symphonia', 'https://media.rawg.io/media/screenshots/e79/e798477413a08e16369dc064dc55524b.jpg'),
(94, 161263, 'eyes-of-ra', 'Eyes of Ra', 'https://media.rawg.io/media/screenshots/020/02088005eee6199e21c46d0ec39949c7.jpg'),
(95, 28623, 'batman-arkham-city-2', 'Batman: Arkham City', 'https://media.rawg.io/media/games/b5a/b5a1226bfd971284a735a4a0969086b3.jpg'),
(96, 330615, 'pokemon-black-version', 'Pokémon Black, White', 'https://media.rawg.io/media/games/3dd/3ddf27683a9aecf1cf39605100651a99.jpg'),
(97, 3489, 'the-crew', 'The Crew', 'https://media.rawg.io/media/screenshots/b79/b797325a14fc62444ca6032d59aa1c75.jpg'),
(98, 29028, 'metro-2033', 'Metro 2033', 'https://media.rawg.io/media/games/120/1201a40e4364557b124392ee50317b99.jpg'),
(99, 25097, 'the-legend-of-zelda-ocarina-of-time', 'The Legend of Zelda: Ocarina of Time', 'https://media.rawg.io/media/games/3a0/3a0c8e9ed3a711c542218831b893a0fa.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `list_entity`
--

CREATE TABLE `list_entity` (
  `id` int(11) NOT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `list_entity`
--

INSERT INTO `list_entity` (`id`, `creator_id`, `title`, `description`, `is_public`, `created_at`) VALUES
(16, 6, 'lista nueva', 'juegos', 1, '2025-05-24 23:33:45'),
(18, 5, 'lista', 'aaaaa', 1, '2025-05-25 15:35:03'),
(22, 5, 'aaaa', 'aaaaaa', 1, '2025-05-25 16:37:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `list_item`
--

CREATE TABLE `list_item` (
  `id` int(11) NOT NULL,
  `list_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `list_item`
--

INSERT INTO `list_item` (`id`, `list_id`, `game_id`) VALUES
(53, 16, 80),
(54, 16, 81),
(55, 16, 82),
(56, 16, 83),
(57, 16, 84),
(72, 18, 95),
(73, 18, 96),
(74, 18, 97),
(75, 18, 98);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `played_before` tinyint(1) NOT NULL DEFAULT 0,
  `played_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `review`
--

INSERT INTO `review` (`id`, `author_id`, `game_id`, `rating`, `text`, `created_at`, `played_before`, `played_at`) VALUES
(66, 6, 74, 4, 'Muy bueno', '2025-05-24 17:05:48', 0, '2025-05-24 00:00:00'),
(67, 6, 21, 5, 'Una autentica joya atemporal', '2025-05-24 17:20:53', 0, '2025-05-14 00:00:00'),
(68, 6, 75, 5, 'Un maravilla', '2025-05-24 17:21:29', 1, '2025-05-24 00:00:00'),
(69, 6, 23, 5, 'The GOAT', '2025-05-24 17:22:06', 1, '2025-04-10 00:00:00'),
(70, 6, 38, 5, 'Una autentica experiencia!', '2025-05-24 17:25:14', 1, '2025-04-29 00:00:00'),
(71, 5, 85, 4, 'Juegazo', '2025-05-25 13:43:06', 1, '2025-05-25 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review_comment`
--

CREATE TABLE `review_comment` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `review_id` int(11) DEFAULT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `review_comment`
--

INSERT INTO `review_comment` (`id`, `author_id`, `review_id`, `content`, `created_at`) VALUES
(10, 6, 68, 'mariquiton', '2025-05-24 23:41:36'),
(11, 5, 70, 'jajajaj', '2025-05-25 13:38:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review_likes`
--

CREATE TABLE `review_likes` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `review_likes`
--

INSERT INTO `review_likes` (`review_id`, `user_id`) VALUES
(68, 6),
(70, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `username` varchar(180) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `instagram_profile` varchar(255) DEFAULT NULL,
  `twitter_profile` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `banned` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `profile_picture`, `roles`, `password`, `location`, `instagram_profile`, `twitter_profile`, `description`, `banned`) VALUES
(3, 'alvarojimgil@gmail.com', 'ajimz', NULL, '[\"ROLE_USER\"]', '$2y$13$yh4OzGCD8VLh0hMsLJNxKu37t6YRAahYBqpZ/rvhO2ae/nf0v6yQi', NULL, NULL, NULL, NULL, 0),
(5, 'joselui@gmail.com', 'joseeeeee', 'joseeeeee-6807e695f33e1.jpg', '[\"ROLE_USER\"]', '$2y$13$w3AFhHCnv5NJ5HnW80j6vuL4mG9GqFkEutAKma4YBxYx5jB3du4x.', 'mordor', '@hola', '@hola', 'jjijijij', 0),
(6, 'rafaleitor@hotmail.com', 'gamerbox', 'rafaleitor-680a4b1fee9af.png', '[\"ROLE_USER\"]', '$2y$13$F5JH61bk8koCNedqUSFQKeaJDtBDBZ9Eye1mJWsya76v6xisfRXaq', 'granada', '@alvaro27m', '@fritorabano', 'aaaaa', 0),
(9, 'sans@gmail.com', 'sans', NULL, '[\"ROLE_USER\"]', '$2y$13$9Fm0wIv2rZT5edjmo1p5o.3MMS02W6DgLmgy.PYFljac3iDMU/9pS', NULL, NULL, NULL, NULL, 1),
(10, 'admin@gmail.com', 'admin', NULL, '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$2y$13$WER1wDWiA0j3Q/I91SllleVaAi1TE.euFFOqf2ijupoxud3th77GG', NULL, NULL, NULL, NULL, 0),
(11, 'papyrus@gmail.com', 'papyrus', NULL, '[\"ROLE_USER\"]', '$2y$13$1mPW19BdijS6DyLHRkuDwubinXGwXfVG25UQlQXGvJ6QhrElUyU4.', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_game`
--

CREATE TABLE `user_game` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `is_favorite` tinyint(1) NOT NULL,
  `played_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `status` varchar(255) NOT NULL,
  `is_super_favorite` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_game`
--

INSERT INTO `user_game` (`id`, `user_id`, `game_id`, `is_favorite`, `played_at`, `status`, `is_super_favorite`) VALUES
(44, 6, 74, 1, '2025-05-24 17:05:31', 'played', 0),
(45, 6, 21, 0, '2025-05-24 17:20:53', 'played', 0),
(46, 6, 75, 0, '2025-05-24 17:21:29', 'played', 0),
(47, 6, 23, 0, '2025-05-24 17:22:06', 'played', 0),
(48, 6, 38, 0, '2025-05-24 17:25:14', 'played', 0),
(49, 6, 51, 0, '2025-05-24 23:13:43', 'pending', 1),
(50, 6, 76, 0, '2025-05-24 23:13:57', 'pending', 1),
(51, 6, 77, 0, '2025-05-24 23:14:03', 'pending', 1),
(52, 6, 31, 0, '2025-05-24 23:14:16', 'pending', 1),
(53, 6, 78, 0, '2025-05-24 23:14:24', 'pending', 1),
(54, 6, 79, 1, '2025-05-24 23:24:09', 'pending', 0),
(55, 5, 85, 1, '2025-05-25 13:42:04', 'played', 0),
(56, 5, 74, 1, '2025-05-25 14:29:37', 'played', 0),
(57, 5, 88, 1, '2025-05-25 15:21:48', 'played', 0),
(58, 5, 89, 1, '2025-05-25 15:27:48', 'played', 0),
(59, 5, 90, 0, '2025-05-25 15:28:31', 'pending', 1),
(60, 5, 91, 0, '2025-05-25 15:28:39', 'pending', 1),
(61, 5, 92, 0, '2025-05-25 15:28:51', 'pending', 1),
(62, 5, 93, 1, '2025-05-25 15:33:51', 'played', 0),
(63, 10, 99, 0, '2025-05-26 16:09:11', 'played', 0),
(64, 10, 50, 0, '2025-05-26 16:17:27', 'played', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `game_reference`
--
ALTER TABLE `game_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `list_entity`
--
ALTER TABLE `list_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `list_item`
--
ALTER TABLE `list_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `review_comment`
--
ALTER TABLE `review_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `user_game`
--
ALTER TABLE `user_game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

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
  ADD CONSTRAINT `FK_97F8864661220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `list_item`
--
ALTER TABLE `list_item`
  ADD CONSTRAINT `FK_5AD5FAF73DAE168B` FOREIGN KEY (`list_id`) REFERENCES `list_entity` (`id`),
  ADD CONSTRAINT `FK_5AD5FAF7E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`);

--
-- Filtros para la tabla `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK_794381C6E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`),
  ADD CONSTRAINT `FK_794381C6F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `review_comment`
--
ALTER TABLE `review_comment`
  ADD CONSTRAINT `FK_F9AE69B3E2E969B` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`),
  ADD CONSTRAINT `FK_F9AE69BF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

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
  ADD CONSTRAINT `FK_59AA7D45A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_59AA7D45E48FD905` FOREIGN KEY (`game_id`) REFERENCES `game_reference` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
