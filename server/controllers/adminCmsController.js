import pool from "../config/database.js";

// ============================================================
// ADMIN CMS CONTROLLER
// ============================================================
// Full CRUD management for:
//
// - Site Settings
// - Pages
// - Page Sections
// - Solutions
// - Locations
// - Benefits
// - Campaign Process
//
// Solution images are supported through:
// - solutions.image_url
// - createSolution()
// - updateSolution()
// - solution image controller
// ============================================================

const VALID_STATUS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

function clean(value) {
  if (value === undefined || value === null) {
    return null;
  }

  return String(value).trim();
}

function validStatus(status) {
  return VALID_STATUS.includes(status);
}

// ============================================================
// SITE SETTINGS
// ============================================================

export async function getSiteSettingsAdmin(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT *
      FROM site_settings
      ORDER BY id ASC
    `);

    return res.json({
      success: true,
      settings: rows,
    });
  } catch (error) {
    console.error("GET SITE SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load site settings.",
    });
  }
}

export async function createSiteSetting(req, res) {
  try {
    const {
      setting_key,
      setting_value,
      setting_type = "TEXT",
      description,
      is_public = 1,
    } = req.body;

    if (!clean(setting_key)) {
      return res.status(400).json({
        success: false,
        message: "Setting key is required.",
      });
    }

    const [result] = await pool.execute(
      `
      INSERT INTO site_settings
      (
        setting_key,
        setting_value,
        setting_type,
        description,
        is_public
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        clean(setting_key),
        clean(setting_value),
        clean(setting_type) || "TEXT",
        clean(description),
        Number(is_public) ? 1 : 0,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM site_settings WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Site setting created successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("CREATE SITE SETTING ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A setting with this key already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create site setting.",
    });
  }
}

export async function updateSiteSetting(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid setting ID.",
      });
    }

    const {
      setting_key,
      setting_value,
      setting_type,
      description,
      is_public,
    } = req.body;

    const [result] = await pool.execute(
      `
      UPDATE site_settings
      SET
        setting_key = COALESCE(?, setting_key),
        setting_value = ?,
        setting_type = COALESCE(?, setting_type),
        description = ?,
        is_public = COALESCE(?, is_public)
      WHERE id = ?
      `,
      [
        clean(setting_key),
        clean(setting_value),
        clean(setting_type),
        clean(description),
        is_public === undefined
          ? null
          : Number(is_public)
            ? 1
            : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Site setting not found.",
      });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM site_settings WHERE id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Site setting updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("UPDATE SITE SETTING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update site setting.",
    });
  }
}

export async function deleteSiteSetting(req, res) {
  try {
    const id = Number(req.params.id);

    const [result] = await pool.execute(
      `DELETE FROM site_settings WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Site setting not found.",
      });
    }

    return res.json({
      success: true,
      message: "Site setting deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SITE SETTING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete site setting.",
    });
  }
}

// ============================================================
// PAGES
// ============================================================

export async function getPages(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        p.*,
        (
          SELECT COUNT(*)
          FROM page_sections ps
          WHERE ps.page_id = p.id
        ) AS section_count
      FROM pages p
      ORDER BY p.id ASC
    `);

    return res.json({
      success: true,
      pages: rows,
    });
  } catch (error) {
    console.error("GET PAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load pages.",
    });
  }
}

export async function getPage(req, res) {
  try {
    const pageId = Number(req.params.id);

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID.",
      });
    }

    const [pages] = await pool.execute(
      `SELECT * FROM pages WHERE id = ? LIMIT 1`,
      [pageId]
    );

    if (pages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found.",
      });
    }

    const [sections] = await pool.execute(
      `
      SELECT *
      FROM page_sections
      WHERE page_id = ?
      ORDER BY display_order ASC, id ASC
      `,
      [pageId]
    );

    return res.json({
      success: true,
      page: pages[0],
      sections,
    });
  } catch (error) {
    console.error("GET PAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load page.",
    });
  }
}

export async function createPage(req, res) {
  try {
    const {
      page_key,
      title,
      slug,
      meta_title,
      meta_description,
      status = "DRAFT",
    } = req.body;

    if (!clean(page_key) || !clean(title) || !clean(slug)) {
      return res.status(400).json({
        success: false,
        message: "Page key, title and slug are required.",
      });
    }

    if (!validStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page status.",
      });
    }

    const [result] = await pool.execute(
      `
      INSERT INTO pages
      (
        page_key,
        title,
        slug,
        meta_title,
        meta_description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        clean(page_key),
        clean(title),
        clean(slug),
        clean(meta_title),
        clean(meta_description),
        status,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM pages WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Page created successfully.",
      page: rows[0],
    });
  } catch (error) {
    console.error("CREATE PAGE ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Page key or slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create page.",
    });
  }
}

export async function updatePage(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID.",
      });
    }

    const {
      page_key,
      title,
      slug,
      meta_title,
      meta_description,
      status,
    } = req.body;

    if (status !== undefined && !validStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page status.",
      });
    }

    const [result] = await pool.execute(
      `
      UPDATE pages
      SET
        page_key = COALESCE(?, page_key),
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        meta_title = ?,
        meta_description = ?,
        status = COALESCE(?, status)
      WHERE id = ?
      `,
      [
        clean(page_key),
        clean(title),
        clean(slug),
        clean(meta_title),
        clean(meta_description),
        clean(status),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found.",
      });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM pages WHERE id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Page updated successfully.",
      page: rows[0],
    });
  } catch (error) {
    console.error("UPDATE PAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update page.",
    });
  }
}

export async function deletePage(req, res) {
  try {
    const id = Number(req.params.id);

    const [result] = await pool.execute(
      `DELETE FROM pages WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found.",
      });
    }

    return res.json({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete page.",
    });
  }
}

// ============================================================
// PAGE SECTIONS
// ============================================================

export async function getSections(req, res) {
  try {
    const pageId = Number(req.params.pageId);

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID.",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM page_sections
      WHERE page_id = ?
      ORDER BY display_order ASC, id ASC
      `,
      [pageId]
    );

    return res.json({
      success: true,
      sections: rows,
    });
  } catch (error) {
    console.error("GET SECTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load page sections.",
    });
  }
}

export async function createSection(req, res) {
  try {
    const pageId = Number(req.params.pageId);

    const {
      section_key,
      eyebrow,
      title,
      subtitle,
      description,
      content,
      image_url,
      button_text,
      button_url,
      display_order = 0,
      status = "DRAFT",
    } = req.body;

    if (!Number.isInteger(pageId) || pageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page ID.",
      });
    }

    if (!clean(section_key)) {
      return res.status(400).json({
        success: false,
        message: "Section key is required.",
      });
    }

    if (!validStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section status.",
      });
    }

    const [result] = await pool.execute(
      `
      INSERT INTO page_sections
      (
        page_id,
        section_key,
        eyebrow,
        title,
        subtitle,
        description,
        content,
        image_url,
        button_text,
        button_url,
        display_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        pageId,
        clean(section_key),
        clean(eyebrow),
        clean(title),
        clean(subtitle),
        clean(description),
        clean(content),
        clean(image_url),
        clean(button_text),
        clean(button_url),
        Number(display_order) || 0,
        status,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM page_sections WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Page section created successfully.",
      section: rows[0],
    });
  } catch (error) {
    console.error("CREATE SECTION ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This section key already exists on this page.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create page section.",
    });
  }
}

export async function updateSection(req, res) {
  try {
    const id = Number(req.params.id);

    const {
      section_key,
      eyebrow,
      title,
      subtitle,
      description,
      content,
      image_url,
      button_text,
      button_url,
      display_order,
      status,
    } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID.",
      });
    }

    if (status !== undefined && !validStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section status.",
      });
    }

    const [result] = await pool.execute(
      `
      UPDATE page_sections
      SET
        section_key = COALESCE(?, section_key),
        eyebrow = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        content = ?,
        image_url = ?,
        button_text = ?,
        button_url = ?,
        display_order = COALESCE(?, display_order),
        status = COALESCE(?, status)
      WHERE id = ?
      `,
      [
        clean(section_key),
        clean(eyebrow),
        clean(title),
        clean(subtitle),
        clean(description),
        clean(content),
        clean(image_url),
        clean(button_text),
        clean(button_url),
        display_order === undefined
          ? null
          : Number(display_order) || 0,
        clean(status),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Page section not found.",
      });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM page_sections WHERE id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Page section updated successfully.",
      section: rows[0],
    });
  } catch (error) {
    console.error("UPDATE SECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update page section.",
    });
  }
}

export async function deleteSection(req, res) {
  try {
    const id = Number(req.params.id);

    const [result] = await pool.execute(
      `DELETE FROM page_sections WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Page section not found.",
      });
    }

    return res.json({
      success: true,
      message: "Page section deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete page section.",
    });
  }
}

// ============================================================
// GENERIC CONTENT TABLE HELPERS
// ============================================================

const CONTENT_TABLES = {
  solutions: "solutions",
  locations: "locations",
  benefits: "benefits",
  "campaign-process": "campaign_process",
};

function getSafeContentTable(table) {
  if (!Object.values(CONTENT_TABLES).includes(table)) {
    throw new Error(`Invalid CMS content table: ${table}`);
  }

  return table;
}

// ============================================================
// GET CONTENT
// ============================================================

async function getContentRows(table) {
  const safeTable = getSafeContentTable(table);

  const [rows] = await pool.execute(`
    SELECT *
    FROM ${safeTable}
    ORDER BY display_order ASC, id ASC
  `);

  return rows;
}

// ============================================================
// CREATE CONTENT
// ============================================================
// IMPORTANT:
// Solutions now support image_url.
// ============================================================

async function createContentRow(table, body) {
  const safeTable = getSafeContentTable(table);

  const {
    title,
    description,
    icon,
    image_url,
    step_number,
    display_order = 0,
    status = "PUBLISHED",
  } = body;

  if (!clean(title) || !clean(description)) {
    throw {
      status: 400,
      message: "Title and description are required.",
    };
  }

  if (!validStatus(status)) {
    throw {
      status: 400,
      message: "Invalid status.",
    };
  }

  // ----------------------------------------------------------
  // SOLUTIONS
  // ----------------------------------------------------------

  if (safeTable === "solutions") {
    const [result] = await pool.execute(
      `
      INSERT INTO solutions
      (
        title,
        description,
        icon,
        image_url,
        display_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        clean(title),
        clean(description),
        clean(icon),
        clean(image_url),
        Number(display_order) || 0,
        status,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM solutions WHERE id = ?`,
      [result.insertId]
    );

    return rows[0];
  }

  // ----------------------------------------------------------
  // CAMPAIGN PROCESS
  // ----------------------------------------------------------

  if (safeTable === "campaign_process") {
    const [result] = await pool.execute(
      `
      INSERT INTO campaign_process
      (
        step_number,
        title,
        description,
        icon,
        display_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        Number(step_number) || 1,
        clean(title),
        clean(description),
        clean(icon),
        Number(display_order) || 0,
        status,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM campaign_process WHERE id = ?`,
      [result.insertId]
    );

    return rows[0];
  }

  // ----------------------------------------------------------
  // LOCATIONS / BENEFITS
  // ----------------------------------------------------------

  const [result] = await pool.execute(
    `
    INSERT INTO ${safeTable}
    (
      title,
      description,
      icon,
      display_order,
      status
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      clean(title),
      clean(description),
      clean(icon),
      Number(display_order) || 0,
      status,
    ]
  );

  const [rows] = await pool.execute(
    `SELECT * FROM ${safeTable} WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
}

// ============================================================
// UPDATE CONTENT
// ============================================================
// IMPORTANT:
// Solutions now support image_url.
// ============================================================

async function updateContentRow(table, id, body) {
  const safeTable = getSafeContentTable(table);

  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw {
      status: 400,
      message: "Invalid content item ID.",
    };
  }

  const {
    title,
    description,
    icon,
    image_url,
    step_number,
    display_order,
    status,
  } = body;

  if (status !== undefined && !validStatus(status)) {
    throw {
      status: 400,
      message: "Invalid status.",
    };
  }

  let result;

  // ----------------------------------------------------------
  // SOLUTIONS
  // ----------------------------------------------------------

  if (safeTable === "solutions") {
    [result] = await pool.execute(
      `
      UPDATE solutions
      SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        icon = ?,
        image_url = ?,
        display_order = COALESCE(?, display_order),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        clean(title),
        clean(description),
        clean(icon),
        clean(image_url),
        display_order === undefined
          ? null
          : Number(display_order) || 0,
        clean(status),
        numericId,
      ]
    );
  }

  // ----------------------------------------------------------
  // CAMPAIGN PROCESS
  // ----------------------------------------------------------

  else if (safeTable === "campaign_process") {
    [result] = await pool.execute(
      `
      UPDATE campaign_process
      SET
        step_number = COALESCE(?, step_number),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        icon = ?,
        display_order = COALESCE(?, display_order),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        step_number === undefined
          ? null
          : Number(step_number) || 1,
        clean(title),
        clean(description),
        clean(icon),
        display_order === undefined
          ? null
          : Number(display_order) || 0,
        clean(status),
        numericId,
      ]
    );
  }

  // ----------------------------------------------------------
  // LOCATIONS / BENEFITS
  // ----------------------------------------------------------

  else {
    [result] = await pool.execute(
      `
      UPDATE ${safeTable}
      SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        icon = ?,
        display_order = COALESCE(?, display_order),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        clean(title),
        clean(description),
        clean(icon),
        display_order === undefined
          ? null
          : Number(display_order) || 0,
        clean(status),
        numericId,
      ]
    );
  }

  if (result.affectedRows === 0) {
    throw {
      status: 404,
      message: "Content item not found.",
    };
  }

  const [rows] = await pool.execute(
    `SELECT * FROM ${safeTable} WHERE id = ?`,
    [numericId]
  );

  return rows[0];
}

// ============================================================
// DELETE CONTENT
// ============================================================

async function deleteContentRow(table, id) {
  const safeTable = getSafeContentTable(table);

  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw {
      status: 400,
      message: "Invalid content item ID.",
    };
  }

  const [result] = await pool.execute(
    `DELETE FROM ${safeTable} WHERE id = ?`,
    [numericId]
  );

  if (result.affectedRows === 0) {
    throw {
      status: 404,
      message: "Content item not found.",
    };
  }
}

// ============================================================
// SOLUTIONS
// ============================================================

export async function getSolutionsAdmin(req, res) {
  try {
    return res.json({
      success: true,
      items: await getContentRows("solutions"),
    });
  } catch (error) {
    console.error("GET SOLUTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load solutions.",
    });
  }
}

export async function createSolution(req, res) {
  try {
    const item = await createContentRow(
      "solutions",
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Solution created successfully.",
      item,
    });
  } catch (error) {
    console.error("CREATE SOLUTION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to create solution.",
    });
  }
}

export async function updateSolution(req, res) {
  try {
    const item = await updateContentRow(
      "solutions",
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      message: "Solution updated successfully.",
      item,
    });
  } catch (error) {
    console.error("UPDATE SOLUTION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update solution.",
    });
  }
}

export async function deleteSolution(req, res) {
  try {
    await deleteContentRow(
      "solutions",
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Solution deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SOLUTION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete solution.",
    });
  }
}

// ============================================================
// LOCATIONS
// ============================================================

export async function getLocationsAdmin(req, res) {
  try {
    return res.json({
      success: true,
      items: await getContentRows("locations"),
    });
  } catch (error) {
    console.error("GET LOCATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load locations.",
    });
  }
}

export async function createLocation(req, res) {
  try {
    const item = await createContentRow(
      "locations",
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Location created successfully.",
      item,
    });
  } catch (error) {
    console.error("CREATE LOCATION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to create location.",
    });
  }
}

export async function updateLocation(req, res) {
  try {
    const item = await updateContentRow(
      "locations",
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      message: "Location updated successfully.",
      item,
    });
  } catch (error) {
    console.error("UPDATE LOCATION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update location.",
    });
  }
}

export async function deleteLocation(req, res) {
  try {
    await deleteContentRow(
      "locations",
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Location deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE LOCATION ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete location.",
    });
  }
}

// ============================================================
// BENEFITS
// ============================================================

export async function getBenefitsAdmin(req, res) {
  try {
    return res.json({
      success: true,
      items: await getContentRows("benefits"),
    });
  } catch (error) {
    console.error("GET BENEFITS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load benefits.",
    });
  }
}

export async function createBenefit(req, res) {
  try {
    const item = await createContentRow(
      "benefits",
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Benefit created successfully.",
      item,
    });
  } catch (error) {
    console.error("CREATE BENEFIT ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to create benefit.",
    });
  }
}

export async function updateBenefit(req, res) {
  try {
    const item = await updateContentRow(
      "benefits",
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      message: "Benefit updated successfully.",
      item,
    });
  } catch (error) {
    console.error("UPDATE BENEFIT ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update benefit.",
    });
  }
}

export async function deleteBenefit(req, res) {
  try {
    await deleteContentRow(
      "benefits",
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Benefit deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE BENEFIT ERROR:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete benefit.",
    });
  }
}

// ============================================================
// CAMPAIGN PROCESS
// ============================================================

export async function getCampaignProcessAdmin(req, res) {
  try {
    return res.json({
      success: true,
      items: await getContentRows(
        "campaign_process"
      ),
    });
  } catch (error) {
    console.error(
      "GET CAMPAIGN PROCESS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load campaign process.",
    });
  }
}

export async function createCampaignProcess(req, res) {
  try {
    const item = await createContentRow(
      "campaign_process",
      req.body
    );

    return res.status(201).json({
      success: true,
      message:
        "Campaign process step created successfully.",
      item,
    });
  } catch (error) {
    console.error(
      "CREATE CAMPAIGN PROCESS ERROR:",
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to create campaign process step.",
    });
  }
}

export async function updateCampaignProcess(req, res) {
  try {
    const item = await updateContentRow(
      "campaign_process",
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      message:
        "Campaign process step updated successfully.",
      item,
    });
  } catch (error) {
    console.error(
      "UPDATE CAMPAIGN PROCESS ERROR:",
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update campaign process step.",
    });
  }
}

export async function deleteCampaignProcess(req, res) {
  try {
    await deleteContentRow(
      "campaign_process",
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message:
        "Campaign process step deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CAMPAIGN PROCESS ERROR:",
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete campaign process step.",
    });
  }
}