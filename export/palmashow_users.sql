-- phpMyAdmin SQL Dump
-- version 3.1.5
-- http://www.phpmyadmin.net
--
-- Serveur: bobbysixkiller1987.sql.free.fr
-- Généré le : Lun 09 Mai 2016 à 18:31
-- Version du serveur: 5.0.83
-- Version de PHP: 5.3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Base de données: `bobbysixkiller1987`
--

-- --------------------------------------------------------

--
-- Structure de la table `palmashow_users`
--

CREATE TABLE IF NOT EXISTS `palmashow_users` (
  `id` int(5) NOT NULL auto_increment,
  `name` varchar(200) collate latin1_general_ci NOT NULL,
  `thumbtail` varchar(500) collate latin1_general_ci NOT NULL,
  `group_id` int(5) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=24 ;

--
-- Contenu de la table `palmashow_users`
--

INSERT INTO `palmashow_users` (`id`, `name`, `thumbtail`, `group_id`) VALUES
(1, 'Balthazar', 'https://dl.dropboxusercontent.com/s/2r9iwt68epqkf36/balthazar.png', 1),
(2, 'Forains', 'https://dl.dropboxusercontent.com/s/cpkjk19s30xo7x6/forains.png?dl=1raw=1', 7),
(3, 'Fabien', 'https://dl.dropboxusercontent.com/s/kgbf20v3mv5nx42/fabien.png?raw=1', 2),
(4, 'Morgan', 'https://dl.dropboxusercontent.com/s/lkmz01dzvc30sn4/morgan.png?raw=1', 2),
(5, 'Francis', 'https://dl.dropboxusercontent.com/s/p7yv4gfgcxa5y73/francis.png?raw=1', 4),
(6, 'Michel', 'https://dl.dropboxusercontent.com/s/zhf0hjsw9p4j7yx/michel.png?raw=1', 4),
(7, 'Batman', 'https://dl.dropboxusercontent.com/s/7s52fm9i3hhnr1a/batman.png?raw=1', 3),
(8, 'Robin', 'https://dl.dropboxusercontent.com/s/1y68ngbbxay1ol2/robin.png?raw=1', 3),
(9, 'Sydney', 'https://dl.dropboxusercontent.com/s/c7bkmiyq1883bn0/sydney.png?raw=1', 6),
(10, 'Enzo', 'https://dl.dropboxusercontent.com/s/ufsludovkvaf9m0/enzo.png?raw=1', 6),
(11, 'Maitre Gims', 'https://dl.dropboxusercontent.com/s/ndmefbr6l5724rc/gims.png?raw=1', NULL),
(12, 'The Bobo''s', 'https://dl.dropboxusercontent.com/s/9ddzsletj6mmydi/bobos.png?raw=1', NULL),
(13, 'Keen''v', 'https://dl.dropboxusercontent.com/s/8746gam1mdouewl/keenv.png', NULL),
(14, 'Monos de Ski', 'https://dl.dropboxusercontent.com/s/g86cfnje3zzax81/monos.png', NULL),
(15, 'Palmashow', 'https://dl.dropboxusercontent.com/s/84frmp8y3o5bkn0/dimanche.png', NULL),
(16, 'Palmashow', 'https://dl.dropboxusercontent.com/s/lkmmq1lzfakyzgt/seventeen.png', NULL),
(17, 'Frero de la ciotat', 'https://dl.dropboxusercontent.com/s/x17u2qrldtjchs0/frero_ciotat.png', NULL),
(18, 'Rastamilia', 'https://dl.dropboxusercontent.com/s/ake4g6huxrdp9s6/rastamilia.png?dl=0', NULL),
(19, 'Laurent Chanson et Alain Vazy', 'https://dl.dropboxusercontent.com/s/krp8ecycvicxoz2/chanson_vazy.png?dl=0', NULL),
(20, 'Prince des neiges', 'https://dl.dropboxusercontent.com/s/p5m10mrnbfweu1z/prince_neiges.png', NULL),
(21, 'Amaury et Jean-Claude', 'https://dl.dropboxusercontent.com/s/iyshk87m78s2wb5/amaury.png', 5),
(22, 'Palmashow', 'https://dl.dropboxusercontent.com/s/mid9wqeg9y9zaz9/palmashow.png', NULL),
(23, 'Gaspard', 'https://dl.dropboxusercontent.com/s/0kd9g8cmjhp6mqp/gaspard.png', 1);
