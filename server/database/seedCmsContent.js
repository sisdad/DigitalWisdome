import pool from "../config/database.js";

async function seedCmsContent() {
  const connection = await pool.getConnection();

  try {
    console.log("========================================");
    console.log(" DIGITAL WISDOM CMS CONTENT SEED");
    console.log("========================================");

    await connection.beginTransaction();

    // ==========================================================
    // LOCATIONS
    // ==========================================================

    const locations = [
      {
        title: "Restaurants & Cafés",
        description:
          "Reach consumers while they relax, dine, and engage.",
        icon: "Utensils",
        display_order: 1,
      },
      {
        title: "Hotels & Hospitality",
        description:
          "Premium digital visibility in high-value environments.",
        icon: "Hotel",
        display_order: 2,
      },
      {
        title: "Shopping & Retail",
        description:
          "Put products and promotions directly in front of shoppers.",
        icon: "ShoppingBag",
        display_order: 3,
      },
      {
        title: "Supermarkets",
        description:
          "Influence purchasing decisions in high-footfall locations.",
        icon: "Store",
        display_order: 4,
      },
      {
        title: "Corporate Locations",
        description:
          "Professional environments for powerful brand communication.",
        icon: "Building2",
        display_order: 5,
      },
      {
        title: "Premium Commercial Spots",
        description:
          "Strategically selected locations designed for maximum visibility.",
        icon: "MapPin",
        display_order: 6,
      },
    ];

    // Clear existing seed records
    await connection.execute(
      `DELETE FROM locations WHERE title IN (?, ?, ?, ?, ?, ?)`,
      locations.map((item) => item.title)
    );

    for (const location of locations) {
      await connection.execute(
        `
        INSERT INTO locations
          (title, description, icon, display_order, status)
        VALUES
          (?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          location.title,
          location.description,
          location.icon,
          location.display_order,
        ]
      );
    }

    console.log(`Locations inserted: ${locations.length}`);

    // ==========================================================
    // SOLUTIONS
    // ==========================================================

    const solutions = [
      {
        title: "Video Advertising",
        description:
          "Dynamic video campaigns designed to capture attention and communicate your message effectively.",
        icon: "MonitorPlay",
        display_order: 1,
      },
      {
        title: "Image Advertising",
        description:
          "High-impact visual advertising for brands, products, promotions, and announcements.",
        icon: "Image",
        display_order: 2,
      },
      {
        title: "Product Launches",
        description:
          "Introduce new products and services to audiences through strategic digital screen placement.",
        icon: "Rocket",
        display_order: 3,
      },
      {
        title: "Brand Campaigns",
        description:
          "Build brand awareness and maintain visibility through consistent digital campaigns.",
        icon: "BadgeCheck",
        display_order: 4,
      },
      {
        title: "Promotional Messages",
        description:
          "Communicate offers, discounts, announcements, and promotional messages directly to consumers.",
        icon: "Megaphone",
        display_order: 5,
      },
      {
        title: "Seasonal Campaigns",
        description:
          "Deliver timely campaigns around holidays, seasons, events, and special occasions.",
        icon: "CalendarDays",
        display_order: 6,
      },
      {
        title: "Targeted Advertising",
        description:
          "Place your message in environments where your desired audience is most likely to see it.",
        icon: "Target",
        display_order: 7,
      },
      {
        title: "Corporate Communication",
        description:
          "Use digital screens to communicate corporate messages, announcements, and information.",
        icon: "Building2",
        display_order: 8,
      },
    ];

    await connection.execute(
      `
      DELETE FROM solutions
      WHERE title IN (
        ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      solutions.map((item) => item.title)
    );

    for (const solution of solutions) {
      await connection.execute(
        `
        INSERT INTO solutions
          (title, description, icon, display_order, status)
        VALUES
          (?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          solution.title,
          solution.description,
          solution.icon,
          solution.display_order,
        ]
      );
    }

    console.log(`Solutions inserted: ${solutions.length}`);

    // ==========================================================
    // BENEFITS
    // ==========================================================

    const benefits = [
      {
        title: "Capture Attention",
        description:
          "Use dynamic digital displays to attract attention in high-engagement environments.",
        icon: "Eye",
        display_order: 1,
      },
      {
        title: "Reach Audiences",
        description:
          "Connect your brand with consumers in strategically selected locations.",
        icon: "Users",
        display_order: 2,
      },
      {
        title: "Build Awareness",
        description:
          "Maintain consistent brand visibility and strengthen audience recognition.",
        icon: "TrendingUp",
        display_order: 3,
      },
      {
        title: "Drive Impact",
        description:
          "Deliver timely and relevant messages that help turn visibility into action.",
        icon: "Zap",
        display_order: 4,
      },
    ];

    await connection.execute(
      `
      DELETE FROM benefits
      WHERE title IN (?, ?, ?, ?)
      `,
      benefits.map((item) => item.title)
    );

    for (const benefit of benefits) {
      await connection.execute(
        `
        INSERT INTO benefits
          (title, description, icon, display_order, status)
        VALUES
          (?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          benefit.title,
          benefit.description,
          benefit.icon,
          benefit.display_order,
        ]
      );
    }

    console.log(`Benefits inserted: ${benefits.length}`);

    // ==========================================================
    // CAMPAIGN PROCESS
    // ==========================================================

    const campaignProcess = [
      {
        step_number: 1,
        title: "Tell Us Your Goal",
        description:
          "Share your advertising objective, target audience, campaign message, and desired outcome.",
        icon: "MessageSquare",
        display_order: 1,
      },
      {
        step_number: 2,
        title: "Plan Your Campaign",
        description:
          "We identify suitable advertising environments and develop a campaign approach around your objectives.",
        icon: "ClipboardList",
        display_order: 2,
      },
      {
        step_number: 3,
        title: "Prepare Your Content",
        description:
          "Your visual content is prepared for digital display and optimized for the selected screens.",
        icon: "MonitorPlay",
        display_order: 3,
      },
      {
        step_number: 4,
        title: "Reach Your Audience",
        description:
          "Your campaign goes live across selected digital advertising locations.",
        icon: "Users",
        display_order: 4,
      },
    ];

    await connection.execute(
      `
      DELETE FROM campaign_process
      WHERE step_number IN (1, 2, 3, 4)
      `
    );

    for (const step of campaignProcess) {
      await connection.execute(
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
        VALUES
          (?, ?, ?, ?, ?, 'PUBLISHED')
        `,
        [
          step.step_number,
          step.title,
          step.description,
          step.icon,
          step.display_order,
        ]
      );
    }

    console.log(`Campaign process inserted: ${campaignProcess.length}`);

    await connection.commit();

    console.log("");
    console.log("CMS CONTENT CREATED SUCCESSFULLY");
    console.log("========================================");
  } catch (error) {
    await connection.rollback();

    console.error("");
    console.error("CMS CONTENT SEED FAILED");
    console.error("========================================");
    console.error(error);

    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedCmsContent();