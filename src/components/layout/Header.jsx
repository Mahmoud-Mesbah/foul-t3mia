import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { sidebarOpened } from '../../features/ui/uiSlice';
import { selectTheme, themeToggled } from '../../features/settings/settingsSlice';

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  return online;
}

export default function Header() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const location = useLocation();
  const online = useOnlineStatus();
  const title = decodeURIComponent(location.pathname.replace('/', '')) || 'الرئيسية';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur px-4 lg:px-6 py-3.5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(sidebarOpened())}
          className="lg:hidden rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span
          title={online ? 'متصل بالإنترنت (غير مطلوب)' : 'وضع عدم الاتصال'}
          className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            online
              ? 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
              : 'bg-leaf-600/10 text-leaf-600'
          }`}
        >
          {online ? <Wifi size={13} /> : <WifiOff size={13} />}
          {online ? 'يعمل محليًا' : 'وضع غير متصل'}
        </span>
        <button
          onClick={() => dispatch(themeToggled())}
          className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="تبديل الوضع الداكن"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  );
}
