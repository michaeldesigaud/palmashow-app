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
-- Structure de la table `palmashow_groups`
--

CREATE TABLE IF NOT EXISTS `palmashow_groups` (
  `id` int(5) NOT NULL auto_increment,
  `iconName` varchar(100) collate latin1_general_ci NOT NULL,
  `title` varchar(200) collate latin1_general_ci NOT NULL,
  `imageName` varchar(300) collate latin1_general_ci NOT NULL,
  `description` varchar(200) collate latin1_general_ci NOT NULL,
  `parent_id` int(5) default NULL,
  `creation_date` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `sub_groups` tinyint(1) NOT NULL,
  `items` varchar(300) collate latin1_general_ci default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=22 ;

--
-- Contenu de la table `palmashow_groups`
--

INSERT INTO `palmashow_groups` (`id`, `iconName`, `title`, `imageName`, `description`, `parent_id`, `creation_date`, `sub_groups`, `items`) VALUES
(1, '', 'Gaspard et Balthazar', 'https://dl.dropboxusercontent.com/s/9av3h8yodezhoz6/gaspard_balthazar_card.png?raw=1', 'Lui c''est Gaspard et moi c''est Balthazar', 8, '2016-04-27 14:57:39', 0, NULL),
(2, '', 'Morgan et Fabien', 'https://dl.dropboxusercontent.com/s/mrve547w9a0uyzu/morgan_fabian_card.png?raw=1', 'Franchement tu fais trop tiep', 8, '2016-04-27 14:57:39', 0, NULL),
(3, '', 'Batman et Robin', 'https://dl.dropboxusercontent.com/s/mlq3gfpeqcm83k0/batman_robin_card.png?raw=1', 'Ici c''est Gotham, Batman et Robin.', 8, '2016-04-27 14:57:39', 0, NULL),
(4, '', 'Michel et Francis', 'https://dl.dropboxusercontent.com/s/rn0ba5wa2t7f80n/michel_francis_card.png?raw=1', 'Elle est où jeanne ?', 8, '2016-04-27 14:57:39', 0, NULL),
(5, '', 'Amaury et Jean-Claude', 'https://dl.dropboxusercontent.com/s/y7lhxly5pxxsfk0/jean_paul_jean_claude_card.png?raw=1', 'Même mamadou à eu son bac...', 8, '2016-04-27 14:57:39', 0, NULL),
(6, '', 'Enzo et Sydney', 'https://dl.dropboxusercontent.com/s/de10lzc8l81lw1t/enzo_sydney_card.jpg?raw=1', 'Onde de choc! 10 sur l''échelle de richard', 8, '2016-04-27 14:57:39', 0, NULL),
(7, '', 'Les forains', 'https://dl.dropboxusercontent.com/s/hm2y6bpx1kcotu5/forains_card.png?raw=1', 'Tu veu pome damour ?', 8, '2016-04-27 14:57:39', 0, NULL),
(8, 'person', 'Les personnages', 'https://dl.dropboxusercontent.com/s/mlq3gfpeqcm83k0/batman_robin_card.png?raw=1', 'Retrouvez tous les sons du palmashow de vos personnages préférés.', NULL, '2016-05-26 14:57:39', 1, 'Gaspard,Balthazard,Morgan,Fabien,Batman, Les forains,...'),
(9, 'videocam', 'Les parodies', 'https://dl.dropboxusercontent.com/s/1ubu8i8fl4bgpf0/the_voice.jpg?raw=1', 'Retrouvez tous les sons des meilleurs parodies du palmashow.', NULL, '2016-05-24 14:57:39', 1, 'The voice,Masterchef,Le grand Journale,New style new look, Recherche appartement,...'),
(10, '', 'The voice', 'https://dl.dropboxusercontent.com/s/1ubu8i8fl4bgpf0/the_voice.jpg?raw=1', 'Ils chantent tous encore plus la même chose', 9, '2016-04-27 14:57:39', 0, NULL),
(11, '', 'Masterchef', 'https://dl.dropboxusercontent.com/s/ekmau6t4sufdr1z/masterchef.jpg?raw=1', 'Moi j''aime bien quand ca claque comme ca', 9, '2016-04-27 14:57:39', 0, NULL),
(12, 'musical-notes', 'Les chansons', 'https://dl.dropboxusercontent.com/s/ivyv3rtpiwm12oo/bobos.jpg', 'Les fautes d''ortho sur le macchiato', NULL, '2016-05-29 16:05:06', 0, 'Quinoa,Ça m''vénère,Keen''v,Rap des prénoms,Supermâles,...'),
(13, '', 'Le grand journale', 'https://dl.dropboxusercontent.com/s/cjoovpjjxl24sol/grand_journale.jpg', 'Ya plus Michel !', 9, '2016-05-01 18:30:52', 0, NULL),
(14, '', 'Le grand frère', 'https://dl.dropboxusercontent.com/s/26ujeybxx3afkh9/grand_frere.jpg', 'Il est où graine de star ?', 9, '2016-05-01 18:42:16', 0, NULL),
(15, '', 'Un diner presque pas mal', 'https://dl.dropboxusercontent.com/s/dahm86orcxllmyp/diner_presque_pas_mal.jpg', 'Limonette ! Limonette ! Limonette !', 9, '2016-05-01 18:52:57', 0, NULL),
(16, '', 'Ko Lantah', 'https://dl.dropboxusercontent.com/s/c5azwr7x4cfvc9l/ko_lantah.jpg', 'Je viens de me péter le bide dans ma tente', 9, '2016-05-01 20:58:34', 0, NULL),
(17, '', 'Tous ensemble', 'https://dl.dropboxusercontent.com/s/9d2zeokxv8i74v4/tous_ensemble.jpg', 'Check ca!', 9, '2016-05-01 21:09:32', 0, NULL),
(18, '', 'Palmashow', 'https://dl.dropboxusercontent.com/s/45d6a1dwzz217yo/palmashow.jpg', 'Les meilleurs extraits des vidéos palmashow, very bad blagues, etc...', NULL, '2016-05-06 20:57:50', 0, NULL),
(21, '', 'New style new look', 'https://dl.dropboxusercontent.com/s/7b4jaig953u8tmm/new_look.jpg', 'Un joli pull de laine', 9, '2016-05-07 00:13:26', 0, NULL);
