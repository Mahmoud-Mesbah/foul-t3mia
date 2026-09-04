import {
  loadProducts,
  loadCategories,
  loadOrders,
  loadSettings,
  loadCart,
  saveProducts,
  saveCategories,
} from '../services/storage/storage';
import { seedCategories, seedProducts, defaultSettings } from '../data/seedData';
import { productsLoaded } from '../features/products/productsSlice';
import { categoriesLoaded } from '../features/categories/categoriesSlice';
import { ordersLoaded } from '../features/orders/ordersSlice';
import { settingsLoaded } from '../features/settings/settingsSlice';
import { cartRestored } from '../features/cart/cartSlice';
import { lockRequired } from '../features/settings/authSlice';
import { appMarkedReady, appErrorSet, toastShown } from '../features/ui/uiSlice';

// Loads persisted data from LocalStorage on startup. Falls back to seed data
// on a first run, and never lets a corrupted local record crash the app —
// invalid entries are dropped with a friendly toast instead.

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function sanitizeProducts(list) {
  return safeArray(list).filter(
    (p) => p && typeof p.id === 'string' && typeof p.name === 'string' && !Number.isNaN(Number(p.price))
  );
}

function sanitizeCategories(list) {
  return safeArray(list).filter((c) => c && typeof c.id === 'string' && typeof c.name === 'string');
}

function sanitizeOrders(list) {
  return safeArray(list).filter(
    (o) => o && typeof o.id === 'string' && Array.isArray(o.items) && !Number.isNaN(Number(o.total))
  );
}

export function initializeApp() {
  return (dispatch) => {
    try {
      let products = sanitizeProducts(loadProducts([]));
      let categories = sanitizeCategories(loadCategories([]));
      let orders = sanitizeOrders(loadOrders([]));

      const isFirstRun = products.length === 0 && categories.length === 0;

      if (isFirstRun) {
        categories = seedCategories;
        products = seedProducts;
        saveCategories(categories);
        saveProducts(products);
      }

      dispatch(categoriesLoaded(categories));
      dispatch(productsLoaded(products));
      dispatch(ordersLoaded(orders));

      const savedSettings = loadSettings(defaultSettings) || defaultSettings;
      dispatch(settingsLoaded(savedSettings));

      const savedCart = loadCart(null);
      if (savedCart) dispatch(cartRestored(savedCart));

      // Apply theme/direction to <html> immediately.
      const theme = savedSettings?.theme || 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');

      if (savedSettings?.pin) {
        dispatch(lockRequired());
      }

      dispatch(appMarkedReady());
    } catch (err) {
      console.error('فشل تحميل بيانات التطبيق', err);
      dispatch(appErrorSet('حدث خطأ أثناء تحميل البيانات المحلية. تم تشغيل التطبيق ببيانات مبدئية.'));
      // Fall back to in-memory seed data so the cashier can keep working.
      dispatch(categoriesLoaded(seedCategories));
      dispatch(productsLoaded(seedProducts));
      dispatch(ordersLoaded([]));
      dispatch(settingsLoaded(defaultSettings));
      dispatch(appMarkedReady());
      dispatch(toastShown({ message: 'تعذر الوصول للتخزين المحلي (LocalStorage)', type: 'error' }));
    }
  };
}
