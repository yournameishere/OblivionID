import { getMongoClient } from "./db";
import { logger } from "./logger";

export type AuditAction =
  | "kyc_start"
  | "kyc_submit"
  | "proof_issue"
  | "mint"
  | "profile_set"
  | "stealth_generate";

export async function auditLog(
  action: AuditAction,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const client = await getMongoClient();
    const col = client.db("oblivion").collection("auditLogs");
    await col.insertOne({
      action,
      ...data,
      createdAt: new Date(),
    });
  } catch (err) {
    // Don't fail the main operation if audit fails
    logger.error({ err, action, data }, "Audit log failed");
  }
}
