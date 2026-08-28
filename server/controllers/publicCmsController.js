import pool from "../config/database.js";

// ============================================================
// PUBLIC CMS CONTROLLER
// Only returns PUBLISHED content.
// No admin authentication required.
// ============================================================

// ------------------------------------------------------------
// GET SITE SETTINGS
// ------------------------------------------------------------
export async function getSiteSettings(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        setting_key,
        setting_value
      FROM site_settings
      ORDER BY setting_key ASC
    `);

    const settings = {};

    for (const row of rows) {
      settings[row.setting_key] = row.setting_value;
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("PUBLIC CMS - SITE SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load site settings.",
    });
  }
}

// ------------------------------------------------------------
// GET PUBLISHED PAGE
// ------------------------------------------------------------
export async function getPublishedPage(req, res) {
  try {
    const { pageKey } = req.params;

    const [pages] = await pool.execute(
      `
      SELECT
        id,
        page_key,
        title,
        slug,
        meta_title,
        meta_description,
        status
      FROM pages
      WHERE page_key = ?
        AND status = 'PUBLISHED'
      LIMIT 1
      `,
      [pageKey]
    );

    if (pages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Published page not found.",
      });
    }

    const page = pages[0];

    const [sections] = await pool.execute(
      `
      SELECT
        id,
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
      FROM page_sections
      WHERE page_id = ?
        AND status = 'PUBLISHED'
      ORDER BY display_order ASC, id ASC
      `,
      [page.id]
    );

    res.json({
      success: true,
      data: {
        ...page,
        sections,
      },
    });
  } catch (error) {
    console.error("PUBLIC CMS - PAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load page content.",
    });
  }
}

// ------------------------------------------------------------
// GET PUBLISHED LOCATIONS
// ------------------------------------------------------------
export async function getLocations(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        title,
        description,
        icon,
        display_order,
        status
      FROM locations
      WHERE status = 'PUBLISHED'
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("PUBLIC CMS - LOCATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load locations.",
    });
  }
}

// ------------------------------------------------------------
// GET PUBLISHED SOLUTIONS
// ------------------------------------------------------------
// Returns:
// - id
// - title
// - description
// - icon
// - image_url
// - display_order
// - status
//
// Only PUBLISHED solutions are exposed publicly.
// ------------------------------------------------------------
export async function getSolutions(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        title,
        description,
        icon,
        image_url,
        display_order,
        status
      FROM solutions
      WHERE status = 'PUBLISHED'
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("PUBLIC CMS - SOLUTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load solutions.",
    });
  }
}

// ------------------------------------------------------------
// GET PUBLISHED BENEFITS
// ------------------------------------------------------------
export async function getBenefits(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        title,
        description,
        icon,
        display_order,
        status
      FROM benefits
      WHERE status = 'PUBLISHED'
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("PUBLIC CMS - BENEFITS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load benefits.",
    });
  }
}

// ------------------------------------------------------------
// GET PUBLISHED CAMPAIGN PROCESS
// ------------------------------------------------------------
export async function getCampaignProcess(req, res) {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        step_number,
        title,
        description,
        display_order,
        status
      FROM campaign_process
      WHERE status = 'PUBLISHED'
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "PUBLIC CMS - CAMPAIGN PROCESS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load campaign process.",
    });
  }
}