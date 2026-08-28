import pool from "../config/database.js";

export async function createInquiry(req, res) {
  try {
    const {
      name,
      email,
      company,
      campaignType,
      message,
    } = req.inquiry;

    const [result] = await pool.execute(
      `
      INSERT INTO inquiries
        (
          name,
          email,
          company,
          campaign_type,
          message
        )
      VALUES
        (?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        company,
        campaignType,
        message,
      ]
    );

    console.log("========================================");
    console.log("NEW ADVERTISING INQUIRY SAVED");
    console.log("========================================");
    console.log("Inquiry ID:", result.insertId);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Company:", company || "Not provided");
    console.log("Campaign:", campaignType);
    console.log("========================================");

    return res.status(201).json({
      success: true,
      message:
        "Your advertising request has been received successfully.",
      inquiry: {
        id: result.insertId,
        name,
        email,
        company,
        campaignType,
      },
    });
  } catch (error) {
    console.error("CREATE INQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to save your advertising request. Please try again later.",
    });
  }
}