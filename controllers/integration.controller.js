import {
  mailChimpFetchLists,
  mailChimpVerifyCredentials,
} from "../services/MailchimpService.js";
import {
  getResponseFetchLists,
  getResponseVerifyCredentials,
} from "../services/GetResponseService.js";
import Integration from "../models/integration.model.js";
import { encrypt, decrypt } from "../utils/crypto.js";

export const postIntegrations = async (req, res, next) => {
  try {
    const { provider, apiKey, userId: bodyUserId } = req.body;
    const userId = req.user?._id || bodyUserId || req.query.userId;
    if (!userId)
      return res
        .status(400)
        .json({ error: "userId is required when not authenticated" });

    let verifyFn;
    if (provider === "mailchimp") {
      verifyFn = mailChimpVerifyCredentials;
    } else if (provider === "getresponse") {
      verifyFn = getResponseVerifyCredentials;
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }

    try {
      await verifyFn(apiKey);

      const existingIntegrations = await Integration.find({ userId, provider });
      const duplicate = existingIntegrations.find((integration) => {
        try {
          return decrypt(integration.apiKey) === apiKey;
        } catch {
          return false;
        }
      });

      if (duplicate) {
        return res
          .status(409)
          .json({ error: "Integration with this API key already exists" });
      }

      const encryptedKey = encrypt(apiKey);
      const data = await Integration.create({
        userId,
        provider,
        apiKey: encryptedKey,
        isVerified: true,
      });
      res.status(201).json({ success: true, data });
    } catch (err) {
      console.log(err);
      return res.status(401).json("Invalid Credentials");
    }
  } catch (error) {
    console.log("Verification failed:", error.response?.data || error.message);
    next(error);
  }
};

export const getEspLists = async (req, res, next) => {
  try {
    const provider = req.query.provider;
    const userId = req.user?._id || req.query.userId || req.body.userId;
    if (!userId)
      return res
        .status(400)
        .json({ error: "userId is required when not authenticated" });
    if (!provider)
      return res
        .status(400)
        .json({ error: "provider query param is required" });

    const integration = await Integration.findOne({
      provider,
      userId,
      isVerified: true,
    });

    if (!integration) {
      return res
        .status(404)
        .json({ error: "Integration not found or not verified" });
    }

    const apiKey = decrypt(integration.apiKey);

    let lists;
    if (provider === "mailchimp") {
      lists = await mailChimpFetchLists(apiKey);
    } else if (provider === "getresponse") {
      lists = await getResponseFetchLists(apiKey);
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }
    res.status(200).json({ lists });
  } catch (error) {
    next(error);
  }
};
