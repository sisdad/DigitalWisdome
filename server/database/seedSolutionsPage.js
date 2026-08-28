import pool from "../config/database.js";

async function seedSolutionsPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM SOLUTIONS PAGE SEED");
  console.log("========================================");

  try {
    // ----------------------------------------------------------
    // FIND SOLUTIONS PAGE
    // ----------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'solutions'
      LIMIT 1
      `
    );

    if (pages.length === 0) {
      throw new Error(
        "Solutions page does not exist. Please create the solutions page first."
      );
    }

    const pageId = pages[0].id;

    // ----------------------------------------------------------
    // REMOVE EXISTING SECTIONS
    // ----------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ----------------------------------------------------------
    // INSERT SECTIONS
    // ----------------------------------------------------------
    const sections = [
      {
        section_key: "hero",
        eyebrow: "Advertising Solutions",
        title: "Turn attention into brand impact.",
        description:
          "Dynamic digital advertising solutions designed to help businesses communicate with consumers in high-engagement environments.",
        content: null,
        button_text: null,
        button_url: null,
        display_order: 1,
      },
      {
        section_key: "campaign_preview",
        eyebrow: "Digital Campaigns",
        title: "Your message deserves more than ordinary advertising.",
        description:
          "From a single promotional message to a complete brand campaign, Digital Wisdom provides flexible digital advertising opportunities designed around your goals.",
        content: "Dynamic Digital Campaign",
        button_text: "Start Your Campaign",
        button_url: "/contact",
        display_order: 2,
      },
      {
        section_key: "solutions_intro",
        eyebrow: "What We Offer",
        title: "Solutions for every advertising objective.",
        description:
          "Choose the advertising format and campaign approach that best supports your business objectives.",
        content: null,
        button_text: null,
        button_url: null,
        display_order: 3,
      },
      {
        section_key: "benefits_intro",
        eyebrow: "Why Digital Advertising",
        title: "Visibility that works for your brand.",
        description:
          "Digital advertising gives businesses the flexibility to communicate visually, repeatedly, and strategically.",
        content: null,
        button_text: null,
        button_url: null,
        display_order: 4,
      },
      {
        section_key: "process_intro",
        eyebrow: "Campaign Process",
        title: "From idea to digital visibility.",
        description: null,
        content: null,
        button_text: null,
        button_url: null,
        display_order: 5,
      },
      {
        section_key: "cta",
        eyebrow: "Ready to Advertise?",
        title: "Let's put your brand in front of people.",
        description:
          "Talk to Digital Wisdom about your campaign and discover the right advertising opportunity for your business.",
        content: null,
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 6,
      },
    ];

    for (const section of sections) {
      await pool.execute(
        `
        INSERT INTO page_sections (
          page_id,
          section_key,
          eyebrow,
          title,
          description,
          content,
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
          section.eyebrow,
          section.title,
          section.description,
          section.content,
          section.button_text,
          section.button_url,
          section.display_order,
        ]
      );
    }

    console.log(`Solutions page sections inserted: ${sections.length}`);
    console.log("");
    console.log("SOLUTIONS CMS CONTENT CREATED SUCCESSFULLY");
    console.log("========================================");
  } catch (error) {
    console.error("SOLUTIONS CMS SEED ERROR:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedSolutionsPage();