-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2026 at 03:32 AM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `digital_wisdom`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('WEBSITE_CONTENT_MANAGER','COMPANY_MANAGER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WEBSITE_CONTENT_MANAGER',
  `status` enum('ACTIVE','INACTIVE','LOCKED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `failed_attempts` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `locked_until` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `full_name`, `email`, `password_hash`, `role`, `status`, `failed_attempts`, `locked_until`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'sisay', 'sisdad37@gmail.com', '$2b$12$K5HUZnBdCqsdZIik5QhRXelrALmK0.otPhlosVfKobLQxWWSoq.Sa', 'WEBSITE_CONTENT_MANAGER', 'ACTIVE', 0, NULL, '2026-08-27 19:31:46', '2026-08-25 15:10:33', '2026-08-27 19:31:46'),
(2, 'wosen', 'wosen@digitalwisdom.com', '$2b$10$vsMkJUKxpJENvcMJs9UDxeXd9E0YDZv5jdW3yqWhinhmT4OKLcb2i', 'COMPANY_MANAGER', 'ACTIVE', 0, NULL, '2026-08-27 18:12:24', '2026-08-27 13:36:31', '2026-08-27 18:12:24');

-- --------------------------------------------------------

--
-- Table structure for table `benefits`
--

CREATE TABLE `benefits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `benefits`
--

INSERT INTO `benefits` (`id`, `title`, `description`, `icon`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Capture Attention', 'Use dynamic digital displays to attract attention in high-engagement environments.', 'Eye', 1, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-27 23:41:00'),
(2, 'Reach Audiences', 'Connect your brand with consumers in strategically selected locations.', 'Users', 2, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(3, 'Build Awareness', 'Maintain consistent brand visibility and strengthen audience recognition.', 'TrendingUp', 3, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(4, 'Drive Impact', 'Deliver timely and relevant messages that help turn visibility into action.', 'Zap', 4, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_process`
--

CREATE TABLE `campaign_process` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `step_number` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_process`
--

INSERT INTO `campaign_process` (`id`, `step_number`, `title`, `description`, `icon`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tell Us Your Goal', 'Share your advertising objective, target audience, campaign message, and desired outcome.', 'MessageSquare', 1, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-26 22:50:58'),
(2, 2, 'Plan Your Campaign', 'We identify suitable advertising environments and develop a campaign approach around your objectives.', 'ClipboardList', 2, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(3, 3, 'Prepare Your Content', 'Your visual content is prepared for digital display and optimized for the selected screens.', 'MonitorPlay', 3, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(4, 4, 'Reach Your Audience', 'Your campaign goes live across selected digital advertising locations.', 'Users', 4, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('NEW','CONTACTED','IN_PROGRESS','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `company`, `campaign_type`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'novacore system', 'sisay@hossana.com', 'nova', 'Video Advertising', 'my novacore plc', 'COMPLETED', '2026-08-25 06:55:09', '2026-08-25 19:31:28'),
(2, 'alemu', 'alex@gmail.com', 'moha', 'Image Advertising', 'advert by screen on crowded areas', 'IN_PROGRESS', '2026-08-27 15:55:33', '2026-08-27 18:12:46');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `title`, `description`, `icon`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Restaurants & Cafés', 'Reach consumers while they relax, dine, and engage.', 'Utensils', 1, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:56:19'),
(2, 'Hotels & Hospitality', 'Premium digital visibility in high-value environments.', 'Hotel', 2, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(3, 'Shopping & Retail', 'Put products and promotions directly in front of shoppers.', 'ShoppingBag', 3, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(4, 'Supermarkets', 'Influence purchasing decisions in high-footfall locations.', 'Store', 4, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(5, 'Corporate Locations', 'Professional environments for powerful brand communication.', 'Building2', 5, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(6, 'Premium Commercial Spots', 'Strategically selected locations designed for maximum visibility.', 'MapPin', 6, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `page_key`, `title`, `slug`, `meta_title`, `meta_description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'home', 'Home', '/', 'Digital Wisdom Advertising', 'Digital advertising and promotion through strategic digital display networks.', 'PUBLISHED', '2026-08-25 20:05:29', '2026-08-25 20:05:29'),
(2, 'about', 'About', '/about', 'About Digital Wisdom', 'Learn about Digital Wisdom Advertising & Promotion.', 'PUBLISHED', '2026-08-25 20:05:29', '2026-08-25 20:05:29'),
(3, 'network', 'Network', '/network', 'Digital Wisdom Network', 'Explore Digital Wisdom advertising locations and network opportunities.', 'PUBLISHED', '2026-08-25 20:05:29', '2026-08-25 20:05:29'),
(4, 'solutions', 'Solutions', '/solutions', 'Advertising Solutions | Digital Wisdom', 'Explore digital advertising solutions for businesses and brands.', 'PUBLISHED', '2026-08-25 20:05:29', '2026-08-25 20:05:29'),
(5, 'contact', 'Contact', '/contact', 'Contact Digital Wisdom', 'Contact Digital Wisdom about advertising, campaigns, locations, and promotional opportunities.', 'PUBLISHED', '2026-08-25 20:05:29', '2026-08-25 20:05:29'),
(6, 'navbar', 'Navbar', '/navbar', 'Digital Wisdom Navigation', 'Digital Wisdom website navigation and advertising call to action.', 'PUBLISHED', '2026-08-25 23:46:48', '2026-08-25 23:46:48'),
(7, 'footer', 'Footer', '/footer', 'Digital Wisdom Footer', 'Digital Wisdom Advertising & Promotion website footer.', 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `page_sections`
--

CREATE TABLE `page_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_id` bigint(20) UNSIGNED NOT NULL,
  `section_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eyebrow` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page_sections`
--

INSERT INTO `page_sections` (`id`, `page_id`, `section_key`, `eyebrow`, `title`, `subtitle`, `description`, `content`, `image_url`, `button_text`, `button_url`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'hero', 'About Digital Wisdom', 'Building the future of digital advertising.', NULL, 'Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.', NULL, '/uploads/cms/img6-1787861269341.jpeg', NULL, NULL, 1, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-27 23:49:16'),
(2, 2, 'introduction', NULL, 'Connecting brands with people.', NULL, 'We create opportunities for businesses to communicate their message through strategically positioned digital advertising environments.', 'Our approach combines strategic placement, creative communication, technology, and professional service to help brands gain visibility and connect with their audiences.', '/uploads/cms/img1-1787861310955.jpeg', NULL, NULL, 2, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-27 20:08:33'),
(3, 2, 'vision', '01', 'Our Vision', NULL, 'To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.', NULL, NULL, NULL, NULL, 3, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-25 21:13:06'),
(4, 2, 'mission', '02', 'Our Mission', NULL, 'To provide effective, creative, and technology-driven advertising solutions that help businesses reach their target customers, strengthen brand visibility, and generate meaningful marketing impact.', NULL, NULL, NULL, NULL, 4, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-25 21:13:06'),
(5, 2, 'why_us', 'Why Digital Wisdom', 'Advertising built around attention and impact.', NULL, 'We believe effective advertising is more than displaying a message. It is about reaching the right people, in the right environment, with the right communication.', NULL, NULL, NULL, NULL, 5, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-25 21:13:06'),
(6, 2, 'cta', 'Let\'s work together', 'Your brand deserves to be seen.', NULL, 'Connect with Digital Wisdom and discover advertising opportunities designed to put your message in front of the right audience.', NULL, NULL, 'Advertise With Us', '/contact', 6, 'PUBLISHED', '2026-08-25 21:13:06', '2026-08-25 21:13:06'),
(7, 4, 'hero', 'Advertising Solutions', 'Turn attention into brand impact.', NULL, 'Dynamic digital advertising solutions designed to help businesses communicate with consumers in high-engagement environments.', NULL, '/uploads/cms/photo_2026-08-27_04-25-15-1787835338447.jpg', NULL, NULL, 1, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 12:55:41'),
(8, 4, 'campaign_preview', 'Digital Campaigns', 'Your message deserves more than ordinary advertising.', NULL, 'From a single promotional message to a complete brand campaign, Digital Wisdom provides flexible digital advertising opportunities designed around your goals.', 'Dynamic Digital Campaign', '/uploads/cms/photo_2026-08-27_04-25-29-1787794210513.jpg', 'Start Your Campaign', '/contact', 2, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 01:30:14'),
(9, 4, 'solutions_intro', 'What We Offer', 'Solutions for every advertising objective.', NULL, 'Choose the advertising format and campaign approach that best supports your business objectives.', NULL, '/uploads/cms/img4-1787835661070.jpeg', NULL, NULL, 3, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 13:01:06'),
(10, 4, 'benefits_intro', 'Why Digital Advertising', 'Visibility that works for your brand.', NULL, 'Digital advertising gives businesses the flexibility to communicate visually, repeatedly, and strategically.', NULL, '/uploads/cms/photo_2026-08-27_04-25-36-1787835691544.jpg', NULL, NULL, 4, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 13:01:34'),
(11, 4, 'process_intro', 'Campaign Process', 'From idea to digital visibility.', NULL, NULL, NULL, '/uploads/cms/photo_2026-07-17_16-19-51-1787835708252.jpg', NULL, NULL, 5, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 23:45:10'),
(12, 4, 'cta', 'Ready to Advertise?', 'Let\'s put your brand in front of people.', NULL, 'Talk to Digital Wisdom about your campaign and discover the right advertising opportunity for your business.', NULL, '/uploads/cms/img3-1787835797517.jpeg', 'Advertise With Us', '/contact', 6, 'PUBLISHED', '2026-08-25 21:25:32', '2026-08-27 13:03:20'),
(22, 5, 'hero', 'Contact Digital Wisdom', 'Let\'s put your brand in front of the right audience.', NULL, 'Interested in advertising with Digital Wisdom? Tell us about your business and campaign, and our team can help you explore the right advertising opportunity.', NULL, '/uploads/cms/img3-1787860947819.jpeg', NULL, NULL, 1, 'PUBLISHED', '2026-08-25 23:14:16', '2026-08-27 20:02:30'),
(23, 5, 'contact_intro', 'Talk To Us', 'Start a conversation.', NULL, 'Whether you are launching a product, building brand awareness, or promoting a special offer, we\'re ready to discuss your advertising goals.', NULL, NULL, NULL, NULL, 2, 'PUBLISHED', '2026-08-25 23:14:16', '2026-08-27 23:51:25'),
(24, 5, 'contact_details', 'Contact Information', 'We\'re here to help.', NULL, 'Reach Digital Wisdom directly for advertising inquiries, campaign discussions, and promotional opportunities.', '{\"phone\":\"+251 911 651 099\",\"email\":\"sisdad37@gmail.com\",\"location\":\"Ethiopia\",\"phone_description\":\"Speak directly with our team.\",\"email_description\":\"Send us your advertising inquiry.\",\"location_description\":\"Digital Wisdom Promotion & Advertising.\"}', '/uploads/cms/photo_2026-08-27_04-25-29-1787859279388.jpg', NULL, NULL, 3, 'PUBLISHED', '2026-08-25 23:14:16', '2026-08-27 19:34:42'),
(26, 5, 'next_steps', 'What Happens Next', 'A simple path from inquiry to campaign.', NULL, NULL, NULL, NULL, NULL, NULL, 5, 'PUBLISHED', '2026-08-25 23:14:16', '2026-08-25 23:14:16'),
(27, 6, 'logo', 'Brand', 'Digital Wisdom Advertising & Promotion', NULL, 'Digital Wisdom Advertising & Promotion.', '{\"image_url\":\"/src/assets/digital-wisdom-logo.png\",\"alt\":\"Digital Wisdom Advertising & Promotion\",\"home_url\":\"/\"}', '/uploads/cms/photo_2026-08-27_04-25-15-1787879357175.jpg', NULL, '/', 1, 'PUBLISHED', '2026-08-25 23:46:48', '2026-08-28 01:09:20'),
(28, 6, 'navigation', 'Navigation', 'Main Navigation', '', 'Primary website navigation links.', '{\"links\":[{\"name\":\"Home\",\"path\":\"/\"},{\"name\":\"About\",\"path\":\"/about\"},{\"name\":\"Network\",\"path\":\"/network\"},{\"name\":\"Solutions\",\"path\":\"/solutions\"},{\"name\":\"Contact\",\"path\":\"/contact\"}]}', '', '', '', 2, 'PUBLISHED', '2026-08-25 23:46:48', '2026-08-26 20:17:19'),
(29, 6, 'cta', 'Primary Action', 'Advertise With Us', NULL, 'Invite businesses and organizations to contact Digital Wisdom for advertising opportunities.', '{\"text\":\"Advertise With Us\",\"url\":\"/contact\"}', NULL, 'Advertise With Us', '/contact', 3, 'PUBLISHED', '2026-08-25 23:46:48', '2026-08-25 23:46:48'),
(30, 7, 'brand', 'Digital Wisdom', 'Digital Wisdom Advertising & Promotion', NULL, 'Helping businesses connect with their audiences through modern digital advertising and promotion.', '{\"logo_url\":\"/src/assets/digital-wisdom-logo.png\",\"logo_alt\":\"Digital Wisdom Advertising & Promotion\",\"home_url\":\"/\"}', '/src/assets/digital-wisdom-logo.png', NULL, '/', 1, 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00'),
(31, 7, 'contact', 'Contact', 'Let\'s Talk', NULL, 'For advertising inquiries, campaign discussions, and promotional opportunities, contact Digital Wisdom.', '{\"phone\":\"+251 911 651 099\",\"email\":\"sisdad37@gmail.com\",\"location\":\"Ethiopia\"}', NULL, NULL, NULL, 2, 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00'),
(32, 7, 'navigation', 'Explore', 'Quick Links', NULL, 'Explore Digital Wisdom and discover our advertising solutions.', '{\"links\":[{\"name\":\"Home\",\"path\":\"/\"},{\"name\":\"About\",\"path\":\"/about\"},{\"name\":\"Our Network\",\"path\":\"/network\"},{\"name\":\"Solutions\",\"path\":\"/solutions\"},{\"name\":\"Contact\",\"path\":\"/contact\"}]}', NULL, NULL, NULL, 3, 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00'),
(33, 7, 'cta', 'Advertising', 'Put your brand in front of the right audience.', NULL, 'Connect with Digital Wisdom to explore advertising and promotional opportunities.', '{\"text\":\"Advertise With Us\",\"url\":\"/contact\"}', NULL, 'Advertise With Us', '/contact', 4, 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00'),
(34, 7, 'copyright', 'Digital Wisdom', 'Digital Wisdom Advertising & Promotion', NULL, 'All rights reserved.', '{\"text\":\"© 2026 Digital Wisdom Advertising & Promotion. All rights reserved.\"}', NULL, NULL, NULL, 5, 'PUBLISHED', '2026-08-25 23:57:00', '2026-08-25 23:57:00'),
(35, 1, 'hero', 'Digital Advertising & Promotion', 'Make your brand visible.', NULL, 'Digital Wisdom helps businesses connect with audiences through strategically positioned digital advertising screens and innovative promotional solutions.', '{\"secondary_button_text\":\"Explore Our Network\",\"secondary_button_url\":\"#network\",\"display_quality\":\"4K\",\"screen_size\":\"32\\\"\",\"visibility\":\"24/7\",\"screen_badge_title\":\"High Engagement\",\"screen_badge_text\":\"Strategic digital placement\",\"screen_label\":\"Advertising that gets noticed\",\"screen_title\":\"Be seen. Be remembered.\",\"screen_campaign_text\":\"Dynamic digital campaigns\",\"screen_status\":\"Digital Network Active\"}', '/uploads/cms/img2-1787790734951.jpeg', 'Advertise With Us', '/contact', 1, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-27 23:57:01'),
(36, 1, 'about_preview', 'About Digital Wisdom', 'Connecting brands with people.', NULL, 'Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.', 'We connect brands with consumers through strategically positioned digital advertising environments, helping businesses communicate their message at the right place and the right time.', '/uploads/cms/img3-1787790778032.jpeg', 'Discover Digital Wisdom', '/about', 2, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-27 00:33:00'),
(37, 1, 'network_intro', 'Our Digital Network', 'Your message, where attention happens.', NULL, 'Strategically positioned digital screens designed to place your brand in high-engagement environments.', NULL, NULL, 'View Our Full Network', '/network', 3, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-26 12:02:02'),
(38, 1, 'solutions_intro', 'Advertising Solutions', 'Make your brand impossible to ignore.', NULL, 'Deliver dynamic visual campaigns directly to consumers through premium digital advertising environments.', '[\"Video Advertising\",\"Image Advertising\",\"Product Launches\",\"Brand Campaigns\",\"Promotional Messages\",\"Seasonal Campaigns\",\"Targeted Advertising\",\"Corporate Communication\"]', NULL, 'Explore advertising solutions', '/solutions', 4, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-27 21:35:43'),
(39, 1, 'philosophy', 'Our Advertising Philosophy', 'Right place. Right message.', '', 'Effective advertising connects the right location, audience, message, and timing.', '[{\"number\":\"01\",\"title\":\"Right Location\",\"text\":\"Strategic environments with strong consumer footfall.\"},{\"number\":\"02\",\"title\":\"Right Audience\",\"text\":\"Connect your brand with people in relevant environments.\"},{\"number\":\"03\",\"title\":\"Right Message\",\"text\":\"Creative visual content designed to capture attention.\"},{\"number\":\"04\",\"title\":\"Right Time\",\"text\":\"Flexible digital campaigns delivered when they matter.\"}]', '', '', '', 5, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-26 20:14:46'),
(40, 1, 'vision', 'Our Vision', 'Ethiopia to East Africa.', NULL, 'To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.', 'Building the future of digital advertising', NULL, NULL, NULL, 6, 'PUBLISHED', '2026-08-26 12:02:02', '2026-08-28 00:09:30'),
(58, 3, 'hero', 'Our Digital Network', 'Advertising where attention happens.', NULL, 'Our 32-inch 4K digital screens are strategically positioned in selected high-traffic and premium commercial environments.', NULL, '/uploads/cms/img6-1787792222331.jpeg', NULL, NULL, 1, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 23:50:07'),
(59, 3, 'network_stats', '32\"', 'Digital Screens', NULL, 'Modern digital advertising displays positioned for strong audience visibility.', NULL, '/uploads/cms/img3-1787793523396.jpeg', NULL, NULL, 2, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 01:18:46'),
(60, 3, 'network_stats_4k', '4K', 'Display Quality', NULL, 'High-resolution visual presentation for clear and engaging advertising content.', NULL, NULL, NULL, NULL, 3, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(61, 3, 'network_stats_247', '24/7', 'Brand Visibility', NULL, 'Continuous digital exposure throughout the day and night.', NULL, NULL, NULL, NULL, 4, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(62, 3, 'locations_intro', 'Network Locations', 'Reach people where they are.', NULL, 'Each location is selected with audience visibility, commercial activity, and advertising opportunity in mind.', NULL, NULL, NULL, NULL, 5, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(63, 3, 'benefits_intro', 'Why Our Network', 'More than a screen. A point of connection.', NULL, 'Digital Wisdom transforms strategic physical environments into opportunities for brands to communicate, engage, and remain visible.', NULL, NULL, NULL, NULL, 6, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(64, 3, 'benefit_01', 'Eye', 'High Visibility', NULL, 'Place your brand in environments where people naturally spend time and attention.', NULL, NULL, NULL, NULL, 7, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(65, 3, 'benefit_02', 'Users', 'Audience Access', NULL, 'Connect with consumers through strategically selected commercial environments.', NULL, NULL, NULL, NULL, 8, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(66, 3, 'benefit_03', 'Zap', 'Dynamic Content', NULL, 'Deliver engaging video and visual campaigns through modern digital displays.', NULL, NULL, NULL, NULL, 9, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(67, 3, 'benefit_04', 'BarChart3', 'Brand Impact', NULL, 'Build stronger awareness through repeated and highly visible digital exposure.', NULL, NULL, NULL, NULL, 10, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(68, 3, 'process_intro', 'How It Works', 'Your campaign. Our network.', NULL, 'Getting your campaign onto the Digital Wisdom network is simple and straightforward.', NULL, NULL, NULL, NULL, 11, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(69, 3, 'process_01', '01', 'Choose Your Audience', NULL, 'Identify the audience and environment that best match your campaign.', NULL, NULL, NULL, NULL, 12, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(70, 3, 'process_02', '02', 'Select Locations', NULL, 'Choose the digital advertising locations that fit your campaign objectives.', NULL, NULL, NULL, NULL, 13, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(71, 3, 'process_03', '03', 'Deliver Your Content', NULL, 'Provide your approved visual advertising content for digital display.', NULL, NULL, NULL, NULL, 14, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(72, 3, 'process_04', '04', 'Build Visibility', NULL, 'Your campaign reaches audiences through our strategically positioned network.', NULL, NULL, NULL, NULL, 15, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(73, 3, 'cta', 'Reach More People', 'Put your brand on our network.', NULL, 'Talk to Digital Wisdom about advertising opportunities across our digital network.', NULL, NULL, 'Advertise With Us', '/contact', 16, 'PUBLISHED', '2026-08-27 00:49:14', '2026-08-27 00:49:14'),
(74, 3, 'new hero', 'this is new', 'new Network', NULL, 'this is the best website Network', NULL, NULL, NULL, NULL, 17, 'PUBLISHED', '2026-08-27 21:43:22', '2026-08-27 21:43:22');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('TEXT','URL','EMAIL','PHONE','JSON') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Digital Wisdom', 'TEXT', 'Website name', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(2, 'site_tagline', 'Digital Solutions for a Smarter Future', 'TEXT', 'Website tagline', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(3, 'site_email', 'info@digitalwisdom.com', 'EMAIL', 'Main website email', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(4, 'site_phone', '+251 900 000 000', 'PHONE', 'Main website phone number', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(5, 'site_logo', '/assets/digital-wisdom-logo.png', 'URL', 'Main website logo', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(6, 'facebook_url', '', 'URL', 'Facebook page URL', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(7, 'linkedin_url', '', 'URL', 'LinkedIn page URL', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24'),
(8, 'youtube_url', '', 'URL', 'YouTube channel URL', 1, '2026-08-26 23:44:24', '2026-08-26 23:44:24');

-- --------------------------------------------------------

--
-- Table structure for table `solutions`
--

CREATE TABLE `solutions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`id`, `title`, `description`, `icon`, `image_url`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Video Advertising', 'Dynamic video campaigns designed to capture attention and communicate your message effectively.', 'MonitorPlay', '/uploads/cms/img6-1787845584426.jpeg', 1, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-27 15:46:28'),
(2, 'Image Advertising', 'High-impact visual advertising for brands, products, promotions, and announcements.', 'Image', '/uploads/cms/photo_2026-07-17_16-19-51-1787845617033.jpg', 2, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-27 15:46:59'),
(3, 'Product Launches', 'Introduce new products and services to audiences through strategic digital screen placement.', 'Rocket', NULL, 3, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(4, 'Brand Campaigns', 'Build brand awareness and maintain visibility through consistent digital campaigns.', 'BadgeCheck', NULL, 4, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(5, 'Promotional Messages', 'Communicate offers, discounts, announcements, and promotional messages directly to consumers.', 'Megaphone', NULL, 5, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(6, 'Seasonal Campaigns', 'Deliver timely campaigns around holidays, seasons, events, and special occasions.', 'CalendarDays', NULL, 6, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-25 20:39:09'),
(7, 'Targeted Advertising', 'Place your message in environments where your desired audience is most likely to see it.', 'Target', NULL, 7, 'PUBLISHED', '2026-08-25 20:39:09', '2026-08-27 23:37:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_admin_users_email` (`email`),
  ADD KEY `idx_admin_users_status` (`status`);

--
-- Indexes for table `benefits`
--
ALTER TABLE `benefits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_benefits_status_order` (`status`,`display_order`);

--
-- Indexes for table `campaign_process`
--
ALTER TABLE `campaign_process`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_campaign_process_status_order` (`status`,`display_order`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inquiries_status` (`status`),
  ADD KEY `idx_inquiries_created_at` (`created_at`),
  ADD KEY `idx_inquiries_email` (`email`(191));

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_locations_status_order` (`status`,`display_order`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pages_key` (`page_key`),
  ADD UNIQUE KEY `uq_pages_slug` (`slug`);

--
-- Indexes for table `page_sections`
--
ALTER TABLE `page_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_page_section` (`page_id`,`section_key`),
  ADD KEY `idx_page_sections_page` (`page_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_site_settings_key` (`setting_key`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_solutions_status_order` (`status`,`display_order`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `campaign_process`
--
ALTER TABLE `campaign_process`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `page_sections`
--
ALTER TABLE `page_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `solutions`
--
ALTER TABLE `solutions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `page_sections`
--
ALTER TABLE `page_sections`
  ADD CONSTRAINT `fk_page_sections_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
