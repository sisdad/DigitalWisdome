
import pool from "../config/database.js";

async function seedFooterPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM FOOTER CMS SEED");
  console.log("========================================");

  try {
    // ------------------------------------------------------------
    // FIND EXISTING FOOTER PAGE
    // ------------------------------------------------------------

    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'footer'
      LIMIT 1
      `
    );

    let pageId;

    // ------------------------------------------------------------
    // CREATE FOOTER PAGE IF IT DOES NOT EXIST
    // ------------------------------------------------------------

    if (pages.length === 0) {
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
        VALUES
        (
          'footer',
          'Footer',
          '/footer',
          'Digital Wisdom Footer',
          'Digital Wisdom Advertising & Promotion website footer.',
          'PUBLISHED'
        )
        `
      );

      pageId = result.insertId;

      console.log(
        `Footer page created with ID: ${pageId}`
      );
    } else {
      pageId = pages[0].id;

      console.log(
        `Existing Footer page found with ID: ${pageId}`
      );
    }

    // ------------------------------------------------------------
    // CLEAR EXISTING FOOTER SECTIONS
    // ------------------------------------------------------------

    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ------------------------------------------------------------
    // FOOTER CMS SECTIONS
    // ------------------------------------------------------------

    const sections = [
      {
        section_key: "brand",
        eyebrow: "Digital Wisdom",
        title:
          "Digital Wisdom Advertising & Promotion",
        description:
          "Helping businesses connect with their audiences through modern digital advertising and promotion.",
        content: JSON.stringify({
          logo_url:
            "/src/assets/digital-wisdom-logo.png",
          logo_alt:
            "Digital Wisdom Advertising & Promotion",
          home_url: "/",
        }),
        image_url:
          "/src/assets/digital-wisdom-logo.png",
        button_text: null,
        button_url: "/",
        display_order: 1,
      },

      {
        section_key: "contact",
        eyebrow: "Contact",
        title: "Let's Talk",
        description:
          "For advertising inquiries, campaign discussions, and promotional opportunities, contact Digital Wisdom.",
        content: JSON.stringify({
          phone: "+251 911 651 099",
          email: "sisdad37@gmail.com",
          location: "Ethiopia",
        }),
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 2,
      },

      {
        section_key: "navigation",
        eyebrow: "Explore",
        title: "Quick Links",
        description:
          "Explore Digital Wisdom and discover our advertising solutions.",
        content: JSON.stringify({
          links: [
            {
              name: "Home",
              path: "/",
            },
            {
              name: "About",
              path: "/about",
            },
            {
              name: "Our Network",
              path: "/network",
            },
            {
              name: "Solutions",
              path: "/solutions",
            },
            {
              name: "Contact",
              path: "/contact",
            },
          ],
        }),
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 3,
      },

      {
        section_key: "cta",
        eyebrow: "Advertising",
        title: "Put your brand in front of the right audience.",
        description:
          "Connect with Digital Wisdom to explore advertising and promotional opportunities.",
        content: JSON.stringify({
          text: "Advertise With Us",
          url: "/contact",
        }),
        image_url: null,
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 4,
      },

      {
        section_key: "copyright",
        eyebrow: "Digital Wisdom",
        title:
          "Digital Wisdom Advertising & Promotion",
        description:
          "All rights reserved.",
        content: JSON.stringify({
          text:
            "© 2026 Digital Wisdom Advertising & Promotion. All rights reserved.",
        }),
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 5,
      },
    ];

    // ------------------------------------------------------------
    // INSERT FOOTER SECTIONS
    // ------------------------------------------------------------

    for (const section of sections) {
      await pool.execute(
        `
        INSERT INTO page_sections
        (
          page_id,
          section_key,
          eyebrow,
          title,
          description,
          content,
          image_url,
          button_text,
          button_url,
          display_order,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          pageId,
          section.section_key,
          section.eyebrow,
          section.title,
          section.description,
          section.content,
          section.image_url,
          section.button_text,
          section.button_url,
          section.display_order,
        ]
      );
    }

    console.log(
      `Footer page sections inserted: ${sections.length}`
    );

    console.log("");
    console.log(
      "FOOTER CMS CONTENT CREATED SUCCESSFULLY"
    );
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("FOOTER PAGE SEED FAILED");
    console.error(error);
    console.error("========================================");

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedFooterPage();

