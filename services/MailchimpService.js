import axios from "axios";

export function getDatacenter(apiKey) {
  if (typeof apiKey !== "string") return null;
  const parts = apiKey.split("-");
  return parts.length > 1 ? parts.pop() : null;
}

export function createClient(apiKey) {
  const dc = getDatacenter(apiKey);
  if (!dc)
    throw new Error(
      "Invalid Mailchimp API key format. Expected key with datacenter suffix (e.g. xxxx-us1)."
    );

  const baseURL = `https://${dc}.api.mailchimp.com/3.0`;
  return axios.create({
    baseURL,
    auth: { username: "anystring", password: apiKey },
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
  });
}

export async function mailChimpVerifyCredentials(apiKey) {
  const client = createClient(apiKey);
  try {
    const res = await client.get("/ping");
    return { ok: true, data: res.data };
  } catch (err) {
    const msg = err.response?.data || err.message || "Unknown error";
    throw new Error(
      `Mailchimp credential verification failed: ${JSON.stringify(msg)}`
    );
  }
}

export async function mailChimpFetchLists(apiKey, options = {}) {
  const client = createClient(apiKey);
  const params = {
    count: options.count ?? 100,
    offset: options.offset ?? 0,
  };

  try {
    const res = await client.get("/lists", { params });
    return {
      total_items: res.data.total_items,
      lists: (res.data.lists || []).map((l) => ({
        id: l.id,
        name: l.name,
        contact: l.contact,
        stats: l.stats,
        subscriber_count: l.stats.member_count ?? 0,
      })),
    };
  } catch (err) {
    const msg = err.response?.data || err.message || "Unknown error";
    throw new Error(`Failed to fetch Mailchimp lists: ${JSON.stringify(msg)}`);
  }
}
