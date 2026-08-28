
const TOKEN_KEY = "digital_wisdom_admin_token";

import {
  API_BASE_URL,
  SERVER_BASE_URL,
} from "../../config/api";

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function notifyAdminSessionExpired() {
  window.dispatchEvent(
    new CustomEvent(
      "digital-wisdom-admin-session-expired"
    )
  );
}

// ============================================================
// AUTHENTICATED REQUEST
// ============================================================

async function adminRequest(endpoint, options = {}) {
  const token = getAdminToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // ==========================================================
  // AUTHENTICATION FAILURE
  // ==========================================================

  if (response.status === 401) {
    clearAdminToken();

    notifyAdminSessionExpired();

    const error = new Error(
      data?.message ||
        "Your administrator session is no longer valid."
    );

    error.status = 401;
    error.data = data;

    throw error;
  }

  // ==========================================================
  // AUTHORIZATION FAILURE
  // ==========================================================

  if (response.status === 403) {
    const error = new Error(
      data?.message ||
        "You do not have permission to perform this action."
    );

    error.status = 403;
    error.data = data;

    throw error;
  }

  // ==========================================================
  // OTHER API ERRORS
  // ==========================================================

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Request failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// ============================================================
// ADMIN LOGIN
// ============================================================

export async function loginAdmin(
  email,
  password
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Unable to login."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  if (!data?.token) {
    throw new Error(
      "Authentication token was not returned."
    );
  }

  setAdminToken(data.token);

  return data;
}

// ============================================================
// LOGOUT
// ============================================================

export function logoutAdmin() {
  clearAdminToken();
}

// ============================================================
// INQUIRIES
// ============================================================

export async function getAdminInquiries() {
  return adminRequest(
    "/admin/inquiries"
  );
}

export async function getAdminInquiry(id) {
  return adminRequest(
    `/admin/inquiries/${id}`
  );
}

export async function updateInquiryStatus(
  id,
  status
) {
  return adminRequest(
    `/admin/inquiries/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );
}

// ============================================================
// CMS — PAGES
// ============================================================

export async function getCmsPages() {
  return adminRequest(
    "/admin/cms/pages"
  );
}

export async function getCmsPage(id) {
  return adminRequest(
    `/admin/cms/pages/${id}`
  );
}

export async function createCmsPage(page) {
  return adminRequest(
    "/admin/cms/pages",
    {
      method: "POST",
      body: JSON.stringify(page),
    }
  );
}

export async function updateCmsPage(
  id,
  page
) {
  return adminRequest(
    `/admin/cms/pages/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(page),
    }
  );
}

export async function deleteCmsPage(id) {
  return adminRequest(
    `/admin/cms/pages/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — PAGE SECTIONS
// ============================================================

export async function getCmsSections(
  pageId
) {
  return adminRequest(
    `/admin/cms/pages/${pageId}/sections`
  );
}

export async function createCmsSection(
  pageId,
  section
) {
  return adminRequest(
    `/admin/cms/pages/${pageId}/sections`,
    {
      method: "POST",
      body: JSON.stringify(section),
    }
  );
}

export async function updateCmsSection(
  id,
  section
) {
  return adminRequest(
    `/admin/cms/sections/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(section),
    }
  );
}

export async function deleteCmsSection(id) {
  return adminRequest(
    `/admin/cms/sections/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — SOLUTIONS
// ============================================================

export async function getCmsSolutions() {
  return adminRequest(
    "/admin/cms/solutions"
  );
}

export async function createCmsSolution(
  solution
) {
  return adminRequest(
    "/admin/cms/solutions",
    {
      method: "POST",
      body: JSON.stringify(solution),
    }
  );
}

export async function updateCmsSolution(
  id,
  solution
) {
  return adminRequest(
    `/admin/cms/solutions/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(solution),
    }
  );
}

export async function deleteCmsSolution(id) {
  return adminRequest(
    `/admin/cms/solutions/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — LOCATIONS
// ============================================================

export async function getCmsLocations() {
  return adminRequest(
    "/admin/cms/locations"
  );
}

export async function createCmsLocation(
  location
) {
  return adminRequest(
    "/admin/cms/locations",
    {
      method: "POST",
      body: JSON.stringify(location),
    }
  );
}

export async function updateCmsLocation(
  id,
  location
) {
  return adminRequest(
    `/admin/cms/locations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(location),
    }
  );
}

export async function deleteCmsLocation(id) {
  return adminRequest(
    `/admin/cms/locations/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — BENEFITS
// ============================================================

export async function getCmsBenefits() {
  return adminRequest(
    "/admin/cms/benefits"
  );
}

export async function createCmsBenefit(
  benefit
) {
  return adminRequest(
    "/admin/cms/benefits",
    {
      method: "POST",
      body: JSON.stringify(benefit),
    }
  );
}

export async function updateCmsBenefit(
  id,
  benefit
) {
  return adminRequest(
    `/admin/cms/benefits/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(benefit),
    }
  );
}

export async function deleteCmsBenefit(id) {
  return adminRequest(
    `/admin/cms/benefits/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — CAMPAIGN PROCESS
// ============================================================

export async function getCmsCampaignProcess() {
  return adminRequest(
    "/admin/cms/campaign-process"
  );
}

export async function createCmsCampaignProcess(
  item
) {
  return adminRequest(
    "/admin/cms/campaign-process",
    {
      method: "POST",
      body: JSON.stringify(item),
    }
  );
}

export async function updateCmsCampaignProcess(
  id,
  item
) {
  return adminRequest(
    `/admin/cms/campaign-process/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(item),
    }
  );
}

export async function deleteCmsCampaignProcess(
  id
) {
  return adminRequest(
    `/admin/cms/campaign-process/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — SITE SETTINGS
// ============================================================

export async function getCmsSettings() {
  return adminRequest(
    "/admin/cms/settings"
  );
}

export async function createCmsSetting(
  setting
) {
  return adminRequest(
    "/admin/cms/settings",
    {
      method: "POST",
      body: JSON.stringify(setting),
    }
  );
}

export async function updateCmsSetting(
  id,
  setting
) {
  return adminRequest(
    `/admin/cms/settings/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(setting),
    }
  );
}

export async function deleteCmsSetting(id) {
  return adminRequest(
    `/admin/cms/settings/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CMS — IMAGE UPLOAD
// ============================================================

export async function uploadCmsImage(file) {
  const token = getAdminToken();

  if (!file) {
    throw new Error("Please select an image.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/admin/cms/images`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    clearAdminToken();
    notifyAdminSessionExpired();

    const error = new Error(
      data?.message ||
        "Your administrator session is no longer valid."
    );

    error.status = 401;
    error.data = data;

    throw error;
  }

  if (response.status === 403) {
    const error = new Error(
      data?.message ||
        "You do not have permission to upload images."
    );

    error.status = 403;
    error.data = data;

    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Image upload failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}


// ============================================================
// CMS — ASSIGN IMAGE TO SECTION
// ============================================================

export async function updateCmsSectionImage(
  id,
  image_url
) {
  return adminRequest(
    `/admin/cms/images/sections/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        image_url,
      }),
    }
  );
}