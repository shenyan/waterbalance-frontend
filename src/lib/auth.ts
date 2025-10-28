import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const ORG_KEY = 'currentOrg';

let inMemoryToken: string | null = null;

const isBrowser = () => typeof window !== 'undefined';

export function getAccessToken(): string | null {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  if (isBrowser()) {
    inMemoryToken = window.localStorage.getItem(TOKEN_KEY);
    return inMemoryToken;
  }
  return null;
}

export function setAccessToken(token: string) {
  inMemoryToken = token;
  if (isBrowser()) {
    window.localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(TOKEN_KEY, token);
  }
}

export function clearAccessToken() {
  inMemoryToken = null;
  if (isBrowser()) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(ORG_KEY);
    Cookies.remove(TOKEN_KEY);
  }
}

export function setCurrentOrg(orgId: number) {
  if (isBrowser()) {
    window.localStorage.setItem(ORG_KEY, String(orgId));
  }
}

export function getCurrentOrg(): number | undefined {
  if (isBrowser()) {
    const raw = window.localStorage.getItem(ORG_KEY);
    if (raw) {
      return Number.parseInt(raw, 10);
    }
  }
  return undefined;
}

export function handleAuthError(_error: unknown) {
  clearAccessToken();
  if (isBrowser()) {
    const current = window.location.pathname;
    if (!current.startsWith('/login')) {
      window.location.replace('/login');
    }
  }
}
