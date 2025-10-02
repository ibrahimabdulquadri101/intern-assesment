import axios from "axios";

const BASE_URL = "https://api.getresponse.com";
const DEFAULT_TIMEOUT = 60000; // ms

/**
 * Verify GetResponse API credentials by making a lightweight request.
 * @param {string} apiKey
 * @returns {Promise<{ valid: boolean, account?: any }>}
 * @throws {Error} on invalid credentials or network errors
 */
export async function getResponseVerifyCredentials(apiKey) {
  if (!apiKey) throw new Error("API key is required");

  try {
    const res = await axios.get(`${BASE_URL}/v3/accounts`, {
      headers: {
        "X-Auth-Token": `api-key ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      timeout: DEFAULT_TIMEOUT,
    });

    if (res.status === 200) {
      return { valid: true, account: res.data };
    }

    return { valid: false, account: res.data };
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        throw new Error("Unauthorized: invalid API key");
      }
      throw new Error(
        `GetResponse API error: ${err.response.status} ${err.response.statusText}`
      );
    } else if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out while verifying credentials");
    } else {
      throw new Error(`Network error: ${err.message}`);
    }
  }
}

/**
 * Fetch lists (GetResponse campaigns) for the given API key.
 * Returns simplified list objects: { id, name }
 * @param {string} apiKey
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.perPage=100]
 * @returns {Promise<Array<{id: string, name: string}>>}
 * @throws {Error} on invalid credentials or network errors
 */
export async function getResponseFetchLists(apiKey, options = {}) {
  if (!apiKey) throw new Error("API key is required");

  const { page = 1, perPage = 100 } = options;

  try {
    const res = await axios.get(`${BASE_URL}/v3/campaigns`, {
      headers: {
        "X-Auth-Token": `api-key ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      params: { page, perPage },
      timeout: DEFAULT_TIMEOUT,
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response from GetResponse: ${res.status}`);
    }
    const lists = Array.isArray(res.data)
      ? res.data.map((c) => ({
          id: c.campaignId || c.id || null,
          name: c.name || "",
          subscriber_count: c.subscribersCount ?? 0,
        }))
      : [];

    return lists;
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        throw new Error("Unauthorized: invalid API key");
      }
      throw new Error(
        `GetResponse API error: ${err.response.status} ${err.response.statusText}`
      );
    } else if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out while fetching lists");
    } else {
      throw new Error(`Network error: ${err.message}`);
    }
  }
}
