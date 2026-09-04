import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  ShoppingCart,
  ClipboardList,
  Package,
  Tags,
  BarChart3,
  Settings,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSidebarOpen, sidebarClosed } from '../../features/ui/uiSlice';
import { selectSettings } from '../../features/settings/settingsSlice';

const NAV_ITEMS = [
  { to: '/الرئيسية', label: 'الرئيسية', icon: LayoutGrid },
  { to: '/الكاشير', label: 'الكاشير', icon: ShoppingCart },
  { to: '/الطلبات', label: 'الطلبات', icon: ClipboardList },
  { to: '/المنتجات', label: 'المنتجات', icon: Package },
  { to: '/التصنيفات', label: 'التصنيفات', icon: Tags },
  { to: '/التقارير', label: 'التقارير', icon: BarChart3 },
  { to: '/الإعدادات', label: 'الإعدادات', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`
          }
        >
          <item.icon size={19} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectSidebarOpen);
  const settings = useAppSelector(selectSettings);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-e border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-5">
        <div className="mb-6 flex items-center gap-2.5 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <p className="font-bold leading-tight">{settings.restaurantName}</p>
            <p className="text-xs text-stone-400">نظام الكاشير</p>
          </div>
        </div>
        <NavItems />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-stone-950/50"
            onClick={() => dispatch(sidebarClosed())}
          />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-white dark:bg-stone-900 h-full py-5 shadow-xl animate-in">
            <div className="mb-6 flex items-center justify-between px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <UtensilsCrossed size={20} />
                </div>
                <p className="font-bold">{settings.restaurantName}</p>
              </div>
              <button
                onClick={() => dispatch(sidebarClosed())}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X size={20} />
              </button>
            </div>
            <NavItems onNavigate={() => dispatch(sidebarClosed())} />
          </aside>
        </div>
      )}
    </>
  );
}
