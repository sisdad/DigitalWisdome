
import pool from "../config/database.js";

async function seedNavbarPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM NAVBAR CMS SEED");
  console.log("========================================");

  try {
    // ------------------------------------------------------------
    // FIND EXISTING NAVBAR PAGE
    // ------------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'navbar'
      LIMIT 1
      `
    );

    let pageId;

    // ------------------------------------------------------------
    // CREATE NAVBAR PAGE IF IT DOES NOT EXIST
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
          'navbar',
          'Navbar',
          '/navbar',
          'Digital Wisdom Navigation',
          'Digital Wisdom website navigation and advertising call to action.',
          'PUBLISHED'
        )
        `
      );

      pageId = result.insertId;

      console.log(`Navbar page created with ID: ${pageId}`);
    } else {
      pageId = pages[0].id;

      console.log(`Existing navbar page found with ID: ${pageId}`);
    }

    // ------------------------------------------------------------
    // CLEAR EXISTING NAVBAR SECTIONS
    // ------------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ------------------------------------------------------------
    // NAVBAR CMS SECTIONS
    // ------------------------------------------------------------
    const sections = [
      {
        section_key: "logo",
        eyebrow: "Brand",
        title: "Digital Wisdom Advertising & Promotion",
        description:
          "Digital Wisdom Advertising & Promotion.",
        content: JSON.stringify({
          image_url: "/src/assets/digital-wisdom-logo.png",
          alt: "Digital Wisdom Advertising & Promotion",
          home_url: "/",
        }),
        image_url: "/src/assets/digital-wisdom-logo.png",
        button_text: null,
        button_url: "/",
        display_order: 1,
      },
      {
        section_key: "navigation",
        eyebrow: "Navigation",
        title: "Main Navigation",
        description: "Primary website navigation links.",
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
        display_order: 2,
      },
      {
        section_key: "cta",
        eyebrow: "Primary Action",
        title: "Advertise With Us",
        description:
          "Invite businesses and organizations to contact Digital Wisdom for advertising opportunities.",
        content: JSON.stringify({
          text: "Advertise With Us",
          url: "/contact",
        }),
        image_url: null,
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 3,
      },
    ];

    // ------------------------------------------------------------
    // INSERT SECTIONS
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
      `Navbar page sections inserted: ${sections.length}`
    );

    console.log("");
    console.log(
      "NAVBAR CMS CONTENT CREATED SUCCESSFULLY"
    );
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("NAVBAR PAGE SEED FAILED");
    console.error(error);
    console.error("========================================");

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedNavbarPage();

