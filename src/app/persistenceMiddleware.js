import { saveProducts, saveCategories, saveOrders, saveSettings, saveCart } from '../services/storage/storage';

// After any mutating action for a given domain, persist the fresh slice
// state to LocalStorage via the centralized storage layer (src/services/storage/storage.js).
// This is the ONLY place besides app initialization that writes to storage,
// so every Redux state change is reflected on disk immediately and nothing
// is lost on refresh, tab close, or system restart.

const PRODUCTS_ACTIONS = new Set([
  'products/productAdded',
  'products/productUpdated',
  'products/productDeleted',
  'products/productAvailabilityToggled',
  'products/productsReplaced',
]);

const CATEGORIES_ACTIONS = new Set([
  'categories/categoryAdded',
  'categories/categoryUpdated',
  'categories/categoryDeleted',
  'categories/categoryToggled',
  'categories/categoriesReordered',
  'categories/categoriesReplaced',
]);

const ORDERS_ACTIONS = new Set([
  'orders/orderCompleted',
  'orders/orderDeleted',
  'orders/ordersReplaced',
]);

const SETTINGS_ACTIONS = new Set([
  'settings/settingsUpdated',
  'settings/receiptSettingsUpdated',
  'settings/themeToggled',
  'settings/themeSet',
  'settings/pinSet',
  'settings/settingsReset',
  'settings/settingsReplaced',
]);

const CART_ACTIONS = new Set([
  'cart/itemAdded',
  'cart/quantityIncreased',
  'cart/quantityDecreased',
  'cart/itemRemoved',
  'cart/itemNoteChanged',
  'cart/discountChanged',
  'cart/cartCleared',
]);

export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  try {
    if (PRODUCTS_ACTIONS.has(action.type)) {
      saveProducts(state.products.items);
    } else if (CATEGORIES_ACTIONS.has(action.type)) {
      saveCategories(state.categories.items);
    } else if (ORDERS_ACTIONS.has(action.type)) {
      saveOrders(state.orders.items);
    } else if (SETTINGS_ACTIONS.has(action.type)) {
      const { loaded: _loaded, ...persistable } = state.settings;
      saveSettings(persistable);
    } else if (CART_ACTIONS.has(action.type)) {
      saveCart({
        items: state.cart.items,
        discountType: state.cart.discountType,
        discountValue: state.cart.discountValue,
      });
    }
  } catch (err) {
    // Persistence failures should never crash the UI — the in-memory
    // Redux state remains correct even if a write to disk fails.
    console.error('فشل حفظ البيانات محليًا', err);
  }

  return result;
};
