-- phpMyAdmin SQL Dump
-- version 3.1.5
-- http://www.phpmyadmin.net
--
-- Serveur: bobbysixkiller1987.sql.free.fr
-- Généré le : Lun 09 Mai 2016 à 18:27
-- Version du serveur: 5.0.83
-- Version de PHP: 5.3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `bobbysixkiller1987`
--

-- --------------------------------------------------------

--
-- Structure de la table `palmashow_config`
--

CREATE TABLE IF NOT EXISTS `palmashow_config` (
  `id` int(5) NOT NULL auto_increment,
  `method` varchar(50) collate latin1_general_ci NOT NULL default 'GET',
  `key` varchar(200) collate latin1_general_ci NOT NULL,
  `value` varchar(200) collate latin1_general_ci default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=8 ;

--
-- Contenu de la table `palmashow_config`
--

INSERT INTO `palmashow_config` (`id`, `method`, `key`, `value`) VALUES
(7, 'GET', 'CONFIG_USERS_PATH', '?cmd=users'),
(1, 'GET', 'SERVER_URL', 'http://bobbysixkiller1987.free.fr/palmashow/data.php'),
(2, 'GET', 'CHILD_GROUPS_PATH', '?cmd=childGroups&parent_id={parentId}'),
(3, 'GET', 'PARENT_GROUPS_PATH', '?cmd=parentGroups'),
(4, 'GET', 'SOUNDS_PATH', '?cmd=sounds&group_id={groupId}'),
(5, 'POST', 'SOUNDS_BY_IDS_PATH', '?cmd=soundsByIds');
