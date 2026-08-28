export function validateInquiry(req, res, next) {
  const {
    name,
    email,
    company,
    campaignType,
    message,
  } = req.body;

  const errors = {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required.";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.trim().length > 100) {
    errors.name = "Name must not exceed 100 characters.";
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.email = "Email address is required.";
  } else {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      errors.email = "Please provide a valid email address.";
    }
  }

  if (company && company.length > 150) {
    errors.company = "Company name must not exceed 150 characters.";
  }

  if (!campaignType || typeof campaignType !== "string") {
    errors.campaignType = "Campaign type is required.";
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    errors.message = "Campaign details are required.";
  } else if (message.trim().length < 10) {
    errors.message =
      "Campaign details must be at least 10 characters.";
  } else if (message.trim().length > 5000) {
    errors.message =
      "Campaign details must not exceed 5000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    });
  }

  req.inquiry = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || null,
    campaignType: campaignType.trim(),
    message: message.trim(),
  };

  next();
}