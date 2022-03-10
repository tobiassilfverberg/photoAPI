-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Värd: localhost:8889
-- Tid vid skapande: 10 mars 2022 kl 15:31
-- Serverversion: 5.7.34
-- PHP-version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `photoAPI`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `albums`
--

INSERT INTO `albums` (`id`, `title`, `user_id`) VALUES
(1, 'Confetti 4 life', 1),
(2, 'Sad album', NULL),
(3, 'My favorite album', 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `albums_photos`
--

CREATE TABLE `albums_photos` (
  `id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `albums_photos`
--

INSERT INTO `albums_photos` (`id`, `album_id`, `photo_id`) VALUES
(1, 1, 1),
(2, 1, 5),
(4, 1, 3),
(13, 3, 1),
(15, 3, 5),
(17, 3, 3),
(19, 1, 9),
(20, 1, 13);

-- --------------------------------------------------------

--
-- Tabellstruktur `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `photos`
--

INSERT INTO `photos` (`id`, `title`, `url`, `comment`, `user_id`) VALUES
(1, 'Super happy photo', 'https://image.happy.jippi', 'Such happy much wow', 1),
(2, 'Happy', 'https://image.happy.com', 'Super', 2),
(3, 'Sad', 'https://image.sad.now', 'Sadface much cry wow', 1),
(4, 'Mediocre', 'https://image.yolomode', 'What even is this', NULL),
(5, 'Angry', 'https://image.angry', 'Angry', 1),
(6, 'Confused', 'https://image.confused', 'Confused', NULL),
(8, 'Maddy-face', 'https://image.maddyface', 'Maddy-face', NULL),
(9, 'Cooooool', 'https://image.cool', 'Such cool much wow', 1),
(10, 'Yolo', 'https://image.yolo', 'Such yolo', NULL),
(13, 'Crying', 'https://image.cry', NULL, 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1, 'tobiassilfverberg@gmail.com', '$2b$10$YSHX6ehbXcqjQ84VjmH5b.PDdLpVpbyHEDsCVYNrO2noCW2bmzmSy', 'Tobias', 'Silfverberg'),
(5, 'tjena@hej.se', '$2b$10$O02CB2XBfPhJRfwu3Fp7mOyyBn9L3w/ehXdjlCVATblJFOT7D/Yl6', 'yolo', 'lmao');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `albums_photos`
--
ALTER TABLE `albums_photos`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT för tabell `albums_photos`
--
ALTER TABLE `albums_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT för tabell `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
