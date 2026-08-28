
import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../config/api";

async function publicCmsRequest(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        `CMS request failed: ${response.status}`
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message ||
        "CMS request failed."
    );
  }

  return result.data;
}

// ============================================================
// PAGES
// ============================================================

export async function getPublicPage(pageKey) {
  return publicCmsRequest(
    `/public-cms/pages/${pageKey}`
  );
}

// ============================================================
// SECTIONS
// ============================================================

export async function getPublicSections(pageId) {
  return publicCmsRequest(
    `/public-cms/pages/${pageId}/sections`
  );
}

// ============================================================
// SOLUTIONS
// ============================================================

export async function getPublicSolutions() {
  return publicCmsRequest(
    "/public-cms/solutions"
  );
}

// ============================================================
// LOCATIONS
// ============================================================

export async function getPublicLocations() {
  return publicCmsRequest(
    "/public-cms/locations"
  );
}

// ============================================================
// BENEFITS
// ============================================================

export async function getPublicBenefits() {
  return publicCmsRequest(
    "/public-cms/benefits"
  );
}

// ============================================================
// CAMPAIGN PROCESS
// ============================================================

export async function getPublicCampaignProcess() {
  return publicCmsRequest(
    "/public-cms/campaign-process"
  );
}

// ============================================================
// SETTINGS
// ============================================================

export async function getPublicSettings() {
  return publicCmsRequest(
    "/public-cms/settings"
  );
}