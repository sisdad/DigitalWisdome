import pool from "../config/database.js";

async function seedNetworkPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM NETWORK PAGE SEED");
  console.log("========================================");

  try {
    // ------------------------------------------------------------
    // FIND NETWORK PAGE
    // ------------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'network'
      LIMIT 1
      `
    );

    if (pages.length === 0) {
      throw new Error(
        "Network page does not exist. Create the network page first."
      );
    }

    const pageId = pages[0].id;

    // ------------------------------------------------------------
    // CLEAR EXISTING NETWORK SECTIONS
    // ------------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ------------------------------------------------------------
    // NETWORK PAGE CMS SECTIONS
    //
    // image_url is intentionally NULL.
    // Images can be uploaded later from the CMS.
    // ------------------------------------------------------------
    const sections = [
      // ==========================================================
      // HERO
      // ==========================================================
      {
        section_key: "hero",
        eyebrow: "Our Digital Network",
        title: "Advertising where attention happens.",
        description:
          "Our 32-inch 4K digital screens are strategically positioned in selected high-traffic and premium commercial environments.",
        image_url: null,
        display_order: 1,
      },

      // ==========================================================
      // NETWORK STATISTICS
      // ==========================================================
      {
        section_key: "network_stats",
        eyebrow: '32"',
        title: "Digital Screens",
        description:
          "Modern digital advertising displays positioned for strong audience visibility.",
        image_url: null,
        display_order: 2,
      },

      {
        section_key: "network_stats_4k",
        eyebrow: "4K",
        title: "Display Quality",
        description:
          "High-resolution visual presentation for clear and engaging advertising content.",
        image_url: null,
        display_order: 3,
      },

      {
        section_key: "network_stats_247",
        eyebrow: "24/7",
        title: "Brand Visibility",
        description:
          "Continuous digital exposure throughout the day and night.",
        image_url: null,
        display_order: 4,
      },

      // ==========================================================
      // LOCATIONS INTRO
      // ==========================================================
      {
        section_key: "locations_intro",
        eyebrow: "Network Locations",
        title: "Reach people where they are.",
        description:
          "Each location is selected with audience visibility, commercial activity, and advertising opportunity in mind.",
        image_url: null,
        display_order: 5,
      },

      // ==========================================================
      // BENEFITS INTRO
      // ==========================================================
      {
        section_key: "benefits_intro",
        eyebrow: "Why Our Network",
        title: "More than a screen. A point of connection.",
        description:
          "Digital Wisdom transforms strategic physical environments into opportunities for brands to communicate, engage, and remain visible.",
        image_url: null,
        display_order: 6,
      },

      // ==========================================================
      // BENEFIT 01
      // ==========================================================
      {
        section_key: "benefit_01",
        eyebrow: "Eye",
        title: "High Visibility",
        description:
          "Place your brand in environments where people naturally spend time and attention.",
        image_url: null,
        display_order: 7,
      },

      // ==========================================================
      // BENEFIT 02
      // ==========================================================
      {
        section_key: "benefit_02",
        eyebrow: "Users",
        title: "Audience Access",
        description:
          "Connect with consumers through strategically selected commercial environments.",
        image_url: null,
        display_order: 8,
      },

      // ==========================================================
      // BENEFIT 03
      // ==========================================================
      {
        section_key: "benefit_03",
        eyebrow: "Zap",
        title: "Dynamic Content",
        description:
          "Deliver engaging video and visual campaigns through modern digital displays.",
        image_url: null,
        display_order: 9,
      },

      // ==========================================================
      // BENEFIT 04
      // ==========================================================
      {
        section_key: "benefit_04",
        eyebrow: "BarChart3",
        title: "Brand Impact",
        description:
          "Build stronger awareness through repeated and highly visible digital exposure.",
        image_url: null,
        display_order: 10,
      },

      // ==========================================================
      // PROCESS INTRO
      // ==========================================================
      {
        section_key: "process_intro",
        eyebrow: "How It Works",
        title: "Your campaign. Our network.",
        description:
          "Getting your campaign onto the Digital Wisdom network is simple and straightforward.",
        image_url: null,
        display_order: 11,
      },

      // ==========================================================
      // PROCESS 01
      // ==========================================================
      {
        section_key: "process_01",
        eyebrow: "01",
        title: "Choose Your Audience",
        description:
          "Identify the audience and environment that best match your campaign.",
        image_url: null,
        display_order: 12,
      },

      // ==========================================================
      // PROCESS 02
      // ==========================================================
      {
        section_key: "process_02",
        eyebrow: "02",
        title: "Select Locations",
        description:
          "Choose the digital advertising locations that fit your campaign objectives.",
        image_url: null,
        display_order: 13,
      },

      // ==========================================================
      // PROCESS 03
      // ==========================================================
      {
        section_key: "process_03",
        eyebrow: "03",
        title: "Deliver Your Content",
        description:
          "Provide your approved visual advertising content for digital display.",
        image_url: null,
        display_order: 14,
      },

      // ==========================================================
      // PROCESS 04
      // ==========================================================
      {
        section_key: "process_04",
        eyebrow: "04",
        title: "Build Visibility",
        description:
          "Your campaign reaches audiences through our strategically positioned network.",
        image_url: null,
        display_order: 15,
      },

      // ==========================================================
      // CTA
      // ==========================================================
      {
        section_key: "cta",
        eyebrow: "Reach More People",
        title: "Put your brand on our network.",
        description:
          "Talk to Digital Wisdom about advertising opportunities across our digital network.",
        image_url: null,
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 16,
      },
    ];

    // ------------------------------------------------------------
    // INSERT SECTIONS
    // ------------------------------------------------------------
    for (const section of sections) {
      await pool.execute(
        `
        INSERT INTO page_sections (
          page_id,
          section_key,
          eyebrow,
          title,
          description,
          image_url,
          button_text,
          button_url,
          display_order,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          pageId,
          section.section_key,
          section.eyebrow || null,
          section.title || null,
          section.description || null,
          section.image_url || null,
          section.button_text || null,
          section.button_url || null,
          section.display_order,
        ]
      );
    }

    console.log(
      `Network page sections inserted: ${sections.length}`
    );

    console.log("");
    console.log("NETWORK CMS CONTENT CREATED SUCCESSFULLY");
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("NETWORK CMS SEED FAILED");
    console.error("========================================");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedNetworkPage();