import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import settingsReducer from '../features/settings/settingsSlice';
import authReducer from '../features/settings/authSlice';
import reportsReducer from '../features/reports/reportsSlice';
import uiReducer from '../features/ui/uiSlice';
import { persistenceMiddleware } from './persistenceMiddleware';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    orders: ordersReducer,
    settings: settingsReducer,
    auth: authReducer,
    reports: reportsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export default store;
