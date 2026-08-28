import pool from "../config/database.js";

async function seedHomePage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM HOME PAGE SEED");
  console.log("========================================");

  try {
    // ----------------------------------------------------------
    // FIND HOME PAGE
    // ----------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'home'
      LIMIT 1
      `
    );

    if (pages.length === 0) {
      throw new Error(
        "Home page does not exist. Create the home page first."
      );
    }

    const pageId = pages[0].id;

    // ----------------------------------------------------------
    // CLEAR EXISTING HOME SECTIONS
    // ----------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ----------------------------------------------------------
    // HOME PAGE SECTIONS
    // ----------------------------------------------------------
    const sections = [
      {
        section_key: "hero",
        eyebrow: "Digital Advertising & Promotion",
        title: "Make your brand visible.",
        description:
          "Digital Wisdom helps businesses connect with audiences through strategically positioned digital advertising screens and innovative promotional solutions.",
        content: JSON.stringify({
          secondary_button_text: "Explore Our Network",
          secondary_button_url: "#network",
          display_quality: "4K",
          screen_size: '32"',
          visibility: "24/7",
          screen_badge_title: "High Engagement",
          screen_badge_text: "Strategic digital placement",
          screen_label: "Advertising that gets noticed",
          screen_title: "Be seen. Be remembered.",
          screen_campaign_text: "Dynamic digital campaigns",
          screen_status: "Digital Network Active",
        }),
        button_text: "Advertise With Us",
        button_url: "/contact",
        display_order: 1,
      },

      {
        section_key: "about_preview",
        eyebrow: "About Digital Wisdom",
        title: "Connecting brands with people.",
        description:
          "Digital Wisdom Advertising & Promotion is an innovative advertising company focused on digital advertising, promotion, and audience engagement.",
        content:
          "We connect brands with consumers through strategically positioned digital advertising environments, helping businesses communicate their message at the right place and the right time.",
        button_text: "Discover Digital Wisdom",
        button_url: "/about",
        display_order: 2,
      },

      {
        section_key: "network_intro",
        eyebrow: "Our Digital Network",
        title: "Your message, where attention happens.",
        description:
          "Strategically positioned digital screens designed to place your brand in high-engagement environments.",
        content: null,
        button_text: "View Our Full Network",
        button_url: "/network",
        display_order: 3,
      },

      {
        section_key: "solutions_intro",
        eyebrow: "Advertising Solutions",
        title: "Make your brand impossible to ignore.",
        description:
          "Deliver dynamic visual campaigns directly to consumers through premium digital advertising environments.",
        content: JSON.stringify([
          "Video Advertising",
          "Image Advertising",
          "Product Launches",
          "Brand Campaigns",
          "Promotional Messages",
          "Seasonal Campaigns",
          "Targeted Advertising",
          "Corporate Communication",
        ]),
        button_text: "Explore advertising solutions",
        button_url: "/solutions",
        display_order: 4,
      },

      {
        section_key: "philosophy",
        eyebrow: "Our Advertising Philosophy",
        title: "Right place. Right message.",
        description:
          "Effective advertising connects the right location, audience, message, and timing.",
        content: JSON.stringify([
          {
            number: "01",
            title: "Right Location",
            text: "Strategic environments with strong consumer footfall.",
          },
          {
            number: "02",
            title: "Right Audience",
            text: "Connect your brand with people in relevant environments.",
          },
          {
            number: "03",
            title: "Right Message",
            text: "Creative visual content designed to capture attention.",
          },
          {
            number: "04",
            title: "Right Time",
            text: "Flexible digital campaigns delivered when they matter.",
          },
        ]),
        display_order: 5,
      },

      {
        section_key: "vision",
        eyebrow: "Our Vision",
        title: "From Ethiopia to East Africa.",
        description:
          "To become a leading indoor digital advertising network in Ethiopia and expand our innovative advertising platform across East Africa and selected international markets.",
        content: "Building the future of digital advertising",
        display_order: 6,
      },

      {
        section_key: "cta",
        eyebrow: "Ready to be seen?",
        title: "Put your brand where attention happens.",
        description:
          "Let's create a digital advertising campaign that puts your message in front of the right audience.",
        content: null,
        button_text: "Start Your Campaign",
        button_url: "/contact",
        display_order: 7,
      },
    ];

    // ----------------------------------------------------------
    // INSERT HOME SECTIONS
    // ----------------------------------------------------------
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
          section.eyebrow || null,
          section.title || null,
          section.description || null,
          section.content || null,
          section.button_text || null,
          section.button_url || null,
          section.display_order,
        ]
      );
    }

    console.log(
      `Home page sections inserted: ${sections.length}`
    );

    console.log("");
    console.log("HOME CMS CONTENT CREATED SUCCESSFULLY");
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("HOME CMS SEED FAILED");
    console.error("========================================");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedHomePage();