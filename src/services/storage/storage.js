// Centralized LocalStorage persistence layer.
//
// This is the ONLY module in the app that talks to window.localStorage.
// Every other module (Redux middleware, backup/import, settings page, etc.)
// goes through the functions exported here. This keeps storage concerns in
// one place, makes the JSON (de)serialization and error handling consistent,
// and means the app works fully offline with zero network calls and zero
// IndexedDB usage.

const APP_PREFIX = 'foul_pos_';

// One dedicated LocalStorage key per data domain. Keeping each domain in its
// own key (rather than one giant blob) means a write to "orders" doesn't
// have to re-serialize "products", and a corrupted key only affects its own
// domain instead of the whole app.
export const STORAGE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  SETTINGS: 'settings',
  CART: 'cart',
  REPORTS_FILTER: 'reports_filter',
};

function fullKey(key) {
  return `${APP_PREFIX}${key}`;
}

function isStorageAvailable() {
  try {
    const testKey = `${APP_PREFIX}__probe__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (err) {
    return false;
  }
}

export const storageAvailable = isStorageAvailable();

/**
 * Reads and JSON-parses a value from LocalStorage.
 * Returns `fallback` (without throwing) if the key is missing, the browser
 * has no LocalStorage support, or the stored value is corrupted/invalid JSON.
 */
export function readJSON(key, fallback) {
  if (!storageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(fullKey(key));
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`تعذرت قراءة البيانات المحلية (${key})، سيتم استخدام القيم الافتراضية`, err);
    return fallback;
  }
}

/**
 * JSON-stringifies and writes a value to LocalStorage.
 * Never throws — logs and returns false on failure (e.g. quota exceeded,
 * private browsing restrictions, serialization errors).
 */
export function writeJSON(key, value) {
  if (!storageAvailable) return false;
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`فشل حفظ البيانات محليًا (${key})`, err);
    return false;
  }
}

export function removeKey(key) {
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(fullKey(key));
  } catch (err) {
    console.warn(`تعذر حذف البيانات المحلية (${key})`, err);
  }
}

/** Removes every key this app owns, leaving other sites'/apps' data untouched. */
export function clearAllAppData() {
  Object.values(STORAGE_KEYS).forEach((key) => removeKey(key));
}

// ---- Typed convenience helpers for each data domain ----

export function loadProducts(fallback = []) {
  const value = readJSON(STORAGE_KEYS.PRODUCTS, fallback);
  return Array.isArray(value) ? value : fallback;
}
export function saveProducts(products) {
  return writeJSON(STORAGE_KEYS.PRODUCTS, products);
}

export function loadCategories(fallback = []) {
  const value = readJSON(STORAGE_KEYS.CATEGORIES, fallback);
  return Array.isArray(value) ? value : fallback;
}
export function saveCategories(categories) {
  return writeJSON(STORAGE_KEYS.CATEGORIES, categories);
}

export function loadOrders(fallback = []) {
  const value = readJSON(STORAGE_KEYS.ORDERS, fallback);
  return Array.isArray(value) ? value : fallback;
}
export function saveOrders(orders) {
  return writeJSON(STORAGE_KEYS.ORDERS, orders);
}

export function loadSettings(fallback) {
  const value = readJSON(STORAGE_KEYS.SETTINGS, fallback);
  return value && typeof value === 'object' ? value : fallback;
}
export function saveSettings(settings) {
  return writeJSON(STORAGE_KEYS.SETTINGS, settings);
}

export function loadCart(fallback = null) {
  const value = readJSON(STORAGE_KEYS.CART, fallback);
  return value && typeof value === 'object' ? value : fallback;
}
export function saveCart(cart) {
  return writeJSON(STORAGE_KEYS.CART, cart);
}
