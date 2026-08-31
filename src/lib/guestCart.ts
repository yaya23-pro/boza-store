const GUEST_TOKEN_COOKIE = "boza_guest_token";
const COOKIE_MAX_AGE_DAYS = 30;

export function getGuestToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(^| )${GUEST_TOKEN_COOKIE}=([^;]+)`));
  return match ? match[2] : null;
}

export function createGuestToken(): string {
  const token = crypto.randomUUID();
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${GUEST_TOKEN_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  return token;
}

export function getOrCreateGuestToken(): string {
  const existing = getGuestToken();
  if (existing) return existing;
  return createGuestToken();
}

export function clearGuestToken(): void {
  document.cookie = `${GUEST_TOKEN_COOKIE}=; path=/; max-age=0`;
}