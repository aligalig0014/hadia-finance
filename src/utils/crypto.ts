/**
 * Secure password hashing utility using Web Crypto API (SHA-256 + Salt)
 */
export async function hashPassword(password: string, salt: string = 'hadia_secure_salt_v1'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:hadia_trade_secret`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
