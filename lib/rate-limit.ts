export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(identifier: string, maxRequests: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  
  // Clean up expired entries every call
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(identifier);

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs
    };
  }

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: record.resetAt
    };
  }

  record.count += 1;

  if (record.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt
    };
  }

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt
  };
}

export function checkRateLimit(ip: string, maxRequests: number, timeWindowMs: number): boolean {
  const result = rateLimit(ip, maxRequests, timeWindowMs);
  return result.success;
}

export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    if (ips.length > 0) {
      return ips[0].trim();
    }
  }
  return 'unknown';
}
