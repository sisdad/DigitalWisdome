
import pool from "../config/database.js";

async function seedContactPage() {
  console.log("========================================");
  console.log(" DIGITAL WISDOM CONTACT PAGE SEED");
  console.log("========================================");

  try {
    // ------------------------------------------------------------
    // FIND CONTACT PAGE
    // ------------------------------------------------------------
    const [pages] = await pool.execute(
      `
      SELECT id
      FROM pages
      WHERE page_key = 'contact'
      LIMIT 1
      `
    );

    if (pages.length === 0) {
      throw new Error(
        "Contact page does not exist. Create the contact page first."
      );
    }

    const pageId = pages[0].id;

    // ------------------------------------------------------------
    // CLEAR EXISTING CONTACT SECTIONS
    // ------------------------------------------------------------
    await pool.execute(
      `
      DELETE FROM page_sections
      WHERE page_id = ?
      `,
      [pageId]
    );

    // ------------------------------------------------------------
    // CONTACT PAGE SECTIONS
    // ------------------------------------------------------------
    const sections = [
      // ==========================================================
      // HERO
      // ==========================================================
      {
        section_key: "hero",
        eyebrow: "Contact Digital Wisdom",
        title:
          "Let's put your brand in front of the right audience.",
        description:
          "Interested in advertising with Digital Wisdom? Tell us about your business and campaign, and our team can help you explore the right advertising opportunity.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 1,
      },

      // ==========================================================
      // CONTACT INTRO
      // ==========================================================
      {
        section_key: "contact_intro",
        eyebrow: "Talk To Us",
        title: "Start a conversation.",
        description:
          "Whether you are launching a product, building brand awareness, or promoting a special offer, we're ready to discuss your advertising goals.",
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 2,
      },

      // ==========================================================
      // CONTACT DETAILS
      // ==========================================================
      {
        section_key: "contact_details",
        eyebrow: "Contact Information",
        title: "We're here to help.",
        description:
          "Reach Digital Wisdom directly for advertising inquiries, campaign discussions, and promotional opportunities.",
        content: JSON.stringify({
          phone: "+251 911 651 099",
          email: "sisdad37@gmail.com",
          location: "Ethiopia",
          phone_description: "Speak directly with our team.",
          email_description:
            "Send us your advertising inquiry.",
          location_description:
            "Digital Wisdom Promotion & Advertising.",
        }),
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 3,
      },

      // ==========================================================
      // INQUIRY FORM
      // ==========================================================
      {
        section_key: "inquiry_form",
        eyebrow: "Advertising Inquiry",
        title: "Tell us what you want to promote.",
        description: null,
        content: JSON.stringify({
          submit_text: "Send Advertising Request",
          submitting_text: "Sending Request...",
          success_message:
            "Thank you. Your advertising request has been received. Our team will contact you soon.",
          security_message:
            "Your inquiry will be securely submitted to Digital Wisdom.",
        }),
        image_url: null,
        button_text: "Send Advertising Request",
        button_url: null,
        display_order: 4,
      },

      // ==========================================================
      // NEXT STEPS
      // ==========================================================
      {
        section_key: "next_steps",
        eyebrow: "What Happens Next",
        title: "A simple path from inquiry to campaign.",
        description: null,
        content: null,
        image_url: null,
        button_text: null,
        button_url: null,
        display_order: 5,
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
      `Contact page sections inserted: ${sections.length}`
    );

    console.log("");
    console.log(
      "CONTACT CMS CONTENT CREATED SUCCESSFULLY"
    );
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("CONTACT PAGE SEED FAILED");
    console.error(error);
    console.error("========================================");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedContactPage();

