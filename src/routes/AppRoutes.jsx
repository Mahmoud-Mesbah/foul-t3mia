import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import POSPage from '../pages/POS/POSPage';
import OrdersPage from '../pages/Orders/OrdersPage';
import ProductsPage from '../pages/Products/ProductsPage';
import CategoriesPage from '../pages/Categories/CategoriesPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/الرئيسية" replace />} />
        <Route path="/الرئيسية" element={<DashboardPage />} />
        <Route path="/الكاشير" element={<POSPage />} />
        <Route path="/الطلبات" element={<OrdersPage />} />
        <Route path="/المنتجات" element={<ProductsPage />} />
        <Route path="/التصنيفات" element={<CategoriesPage />} />
        <Route path="/التقارير" element={<ReportsPage />} />
        <Route path="/الإعدادات" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/الرئيسية" replace />} />
      </Route>
    </Routes>
  );
}
