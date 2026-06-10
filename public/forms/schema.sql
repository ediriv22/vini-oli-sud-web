-- Vini Oli Sud — schema tabella lead form
--
-- Database Aruba: Sql1943124_1  (DB #1, gli altri 4 restano di riserva).
-- Eseguire in phpMyAdmin > Sql1943124_1 > SQL.
--
-- Tabella unica per i 3 form del sito, distinti dalla colonna form_type:
--   - manifestazione-interesse  (LeadMiniForm        → /contatti)
--   - carnet-degustazione       (VisitorCarnetForm   → /visitatori)
--   - segnalazione-editoriale   (FoodRadarSuggestionForm → /diario-del-sud)
--
-- Le colonne specifiche di un form restano NULL per gli altri tipi.
-- extra_json conserva l'intero payload grezzo per sicurezza/audit.

CREATE TABLE IF NOT EXISTS `vos_form_leads` (
  `id`                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `request_id`         VARCHAR(32)  NOT NULL,
  `form_type`          VARCHAR(50)  NOT NULL,
  `audience`           VARCHAR(60)      DEFAULT NULL,
  `interest`           VARCHAR(60)      DEFAULT NULL,
  `status`             VARCHAR(20)  NOT NULL DEFAULT 'new',

  -- Contatto / manifestazione interesse (LeadMiniForm)
  `fullname`           VARCHAR(160)     DEFAULT NULL,
  `company`            VARCHAR(180)     DEFAULT NULL,
  `email`              VARCHAR(180) NOT NULL,
  `website`            VARCHAR(300)     DEFAULT NULL,
  `message`            TEXT             DEFAULT NULL,

  -- Carnet degustazione (VisitorCarnetForm)
  `quantity`           VARCHAR(10)      DEFAULT NULL,

  -- Segnalazione Diario del Sud (FoodRadarSuggestionForm)
  `seg_title`          VARCHAR(300)     DEFAULT NULL,
  `seg_url`            VARCHAR(500)     DEFAULT NULL,
  `seg_source`         VARCHAR(200)     DEFAULT NULL,
  `seg_category`       VARCHAR(120)     DEFAULT NULL,

  -- Consensi (prova GDPR)
  `consenso_privacy`   TINYINT(1)   NOT NULL DEFAULT 0,
  `consenso_marketing` TINYINT(1)   NOT NULL DEFAULT 0,
  `privacy_version`    VARCHAR(40)      DEFAULT NULL,

  -- Metadati richiesta
  `source_url`         VARCHAR(500)     DEFAULT NULL,
  `utm_source`         VARCHAR(120)     DEFAULT NULL,
  `utm_medium`         VARCHAR(120)     DEFAULT NULL,
  `utm_campaign`       VARCHAR(180)     DEFAULT NULL,
  `ip_hash`            CHAR(64)         DEFAULT NULL,
  `user_agent`         VARCHAR(500)     DEFAULT NULL,
  `extra_json`         LONGTEXT         DEFAULT NULL,

  PRIMARY KEY (`id`),
  KEY `idx_form_type` (`form_type`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_email` (`email`),
  KEY `idx_request_id` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
