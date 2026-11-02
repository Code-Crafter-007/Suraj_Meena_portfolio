import crypto from 'crypto';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'surajmeenam946@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'suraj2026';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'suraj-meena-portfolio-secure-session-key-2026';

// Generates an HMAC-SHA256 authenticated session token
export function createAdminSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    timestamp: Date.now(),
    role: 'admin',
  });
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}::${hmac}`).toString('base64');
  return token;
}

// Validates the session token from cookies
export function verifyAdminSessionToken(tokenString: string | null | undefined): boolean {
  if (!tokenString) return false;
  try {
    const raw = Buffer.from(tokenString, 'base64').toString('utf-8');
    const [payloadStr, signature] = raw.split('::');
    if (!payloadStr || !signature) return false;

    const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
    if (signature !== expectedHmac) return false;

    const data = JSON.parse(payloadStr);
    if (data.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return false;

    // Session valid for 14 days
    const age = Date.now() - data.timestamp;
    if (age > 14 * 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

// Validates credentials provided on login
export function validateAdminCredentials(email: string, pass: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    pass.trim() === ADMIN_PASSWORD
  );
}

