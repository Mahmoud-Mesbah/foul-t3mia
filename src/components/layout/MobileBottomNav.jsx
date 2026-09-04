import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, ClipboardList, Package, Menu } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { sidebarOpened } from '../../features/ui/uiSlice';

const ITEMS = [
  { to: '/الرئيسية', label: 'الرئيسية', icon: LayoutGrid },
  { to: '/الكاشير', label: 'الكاشير', icon: ShoppingCart },
  { to: '/الطلبات', label: 'الطلبات', icon: ClipboardList },
  { to: '/المنتجات', label: 'المنتجات', icon: Package },
];

export default function MobileBottomNav() {
  const dispatch = useAppDispatch();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive ? 'text-brand-600' : 'text-stone-400'
            }`
          }
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
      <button
        onClick={() => dispatch(sidebarOpened())}
        className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-stone-400"
      >
        <Menu size={20} />
        المزيد
      </button>
    </nav>
  );
}
