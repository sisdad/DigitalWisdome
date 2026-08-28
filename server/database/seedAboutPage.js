import pool from "../config/database.js";

async function seedAboutPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM ABOUT PAGE SEED");
  console.log("========================================");

  try {
    // ------------------------------------------------------------
    // FIND ABOUT PAGE
    // ------------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'about'
      LIMIT 1
      `
    );

    if (pages.length === 0) {
      throw new Error(
        "About page does not exist. Create the about page first."
      );
    }

    const pageId = pages[0].id;

    // ------------------------------------------------------------
    // CLEAR EXISTING ABOUT SECTIONS
    // ------------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ------------------------------------------------------------
    // ABOUT PAGE SECTIONS
    // ------------------------------------------------------------
    const sections = [
      {
        section_key: "hero",
        eyebrow: "About Digital Wisdom",
        title: "Building the future of digital advertising.",
        subtitle: null,
        description:
          "Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 1,
      },

      {
        section_key: "introduction",
        eyebrow: null,
        title: "Connecting brands with people.",
        subtitle: null,
        description:
          "We create opportunities for businesses to communicate their message through strategically positioned digital advertising environments.",
        content:
          "Our approach combines strategic placement, creative communication, technology, and professional service to help brands gain visibility and connect with their audiences.",
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 2,
      },

      {
        section_key: "vision",
        eyebrow: "01",
        title: "Our Vision",
        subtitle: null,
        description:
          "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 3,
      },

      {
        section_key: "mission",
        eyebrow: "02",
        title: "Our Mission",
        subtitle: null,
        description:
          "To provide effective, creative, and technology-driven advertising solutions that help businesses reach their target customers, strengthen brand visibility, and generate meaningful marketing impact.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 4,
      },

      {
        section_key: "why_us",
        eyebrow: "Why Digital Wisdom",
        title: "Advertising built around attention and impact.",
        subtitle: null,
        description:
          "We believe effective advertising is more than displaying a message. It is about reaching the right people, in the right environment, with the right communication.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 5,
      },

      {
        section_key: "cta",
        eyebrow: "Let's work together",
        title: "Your brand deserves to be seen.",
        subtitle: null,
        description:
          "Connect with Digital Wisdom and discover advertising opportunities designed to put your message in front of the right audience.",
        content: null,
        image_url: null,
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 6,
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
          subtitle,
          description,
          content,
          image_url,
          button_text,
          button_url,
          display_order,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          pageId,
          section.section_key,
          section.eyebrow,
          section.title,
          section.subtitle,
          section.description,
          section.content,
          section.image_url,
          section.button_text,
          section.button_url,
          section.display_order,
        ]
      );
    }

    console.log(`About sections inserted: ${sections.length}`);
    console.log("");
    console.log("ABOUT CMS CONTENT CREATED SUCCESSFULLY");
    console.log("========================================");
  } catch (error) {
    console.error("ABOUT CMS SEED ERROR:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedAboutPage();