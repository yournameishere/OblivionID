/**
 * In-memory rate limiter for API routes.
 * For production at scale, use @upstash/ratelimit with Redis.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

function getClientId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() || realIp || "unknown").toLowerCase();
}

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  default: { limit: 60, windowMs: 60_000 },
  kyc: { limit: 10, windowMs: 60_000 },
  proof: { limit: 30, windowMs: 60_000 },
  mint: { limit: 5, windowMs: 60_000 },
  stealth: { limit: 20, windowMs: 60_000 },
};

export function checkRateLimit(
  req: Request,
  config: RateLimitConfig = RATE_LIMITS.default
): { success: boolean; remaining: number; resetIn: number } {
  const id = getClientId(req);
  const key = `${id}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + config.windowMs };
    store.set(key, entry);
    return { success: true, remaining: config.limit - 1, resetIn: config.windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, config.limit - entry.count);
  const success = entry.count <= config.limit;

  return {
    success,
    remaining,
    resetIn: Math.max(0, entry.resetAt - now),
  };
}

export function withRateLimit<T>(
  req: Request,
  config: RateLimitConfig,
  handler: () => Promise<T>
): Promise<Response | T> {
  const result = checkRateLimit(req, config);
  if (!result.success) {
    return Promise.resolve(
      new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(result.resetIn / 1000)),
            "X-RateLimit-Remaining": String(result.remaining),
          },
        }
      )
    );
  }
  return handler() as Promise<T>;
}
