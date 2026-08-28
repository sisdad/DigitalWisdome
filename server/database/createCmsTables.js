import pool from "../config/database.js";

async function createCmsTables() {
  const connection = await pool.getConnection();

  try {
    console.log("========================================");
    console.log(" DIGITAL WISDOM CMS DATABASE MIGRATION");
    console.log("========================================");

    await connection.beginTransaction();

    // ============================================================
    // 1. SITE SETTINGS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT NULL,
        setting_type ENUM('TEXT', 'URL', 'EMAIL', 'PHONE', 'JSON')
          NOT NULL DEFAULT 'TEXT',
        description VARCHAR(255) NULL,
        is_public TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        UNIQUE KEY uq_site_settings_key (setting_key)
      )
    `);

    // ============================================================
    // 2. PAGES
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        page_key VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(150) NOT NULL,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'DRAFT',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        UNIQUE KEY uq_pages_key (page_key),
        UNIQUE KEY uq_pages_slug (slug)
      )
    `);

    // ============================================================
    // 3. PAGE SECTIONS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS page_sections (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        page_id BIGINT UNSIGNED NOT NULL,
        section_key VARCHAR(100) NOT NULL,
        eyebrow VARCHAR(255) NULL,
        title VARCHAR(500) NULL,
        subtitle VARCHAR(500) NULL,
        description TEXT NULL,
        content TEXT NULL,
        image_url VARCHAR(500) NULL,
        button_text VARCHAR(255) NULL,
        button_url VARCHAR(500) NULL,
        display_order INT NOT NULL DEFAULT 0,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'DRAFT',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        UNIQUE KEY uq_page_section (
          page_id,
          section_key
        ),

        KEY idx_page_sections_page (
          page_id
        ),

        CONSTRAINT fk_page_sections_page
          FOREIGN KEY (page_id)
          REFERENCES pages(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )
    `);

    // ============================================================
    // 4. SOLUTIONS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS solutions (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NULL,
        display_order INT NOT NULL DEFAULT 0,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'PUBLISHED',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        KEY idx_solutions_status_order (
          status,
          display_order
        )
      )
    `);

    // ============================================================
    // 5. LOCATIONS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS locations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NULL,
        display_order INT NOT NULL DEFAULT 0,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'PUBLISHED',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        KEY idx_locations_status_order (
          status,
          display_order
        )
      )
    `);

    // ============================================================
    // 6. BENEFITS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS benefits (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NULL,
        display_order INT NOT NULL DEFAULT 0,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'PUBLISHED',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        KEY idx_benefits_status_order (
          status,
          display_order
        )
      )
    `);

    // ============================================================
    // 7. CAMPAIGN PROCESS
    // ============================================================

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS campaign_process (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        step_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NULL,
        display_order INT NOT NULL DEFAULT 0,
        status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')
          NOT NULL DEFAULT 'PUBLISHED',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        KEY idx_campaign_process_status_order (
          status,
          display_order
        )
      )
    `);

    await connection.commit();

    console.log("");
    console.log("CMS TABLES CREATED SUCCESSFULLY");
    console.log("========================================");

  } catch (error) {
    await connection.rollback();

    console.error("");
    console.error("CMS MIGRATION FAILED");
    console.error("========================================");
    console.error(error);

    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

createCmsTables();