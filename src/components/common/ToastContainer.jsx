import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectToasts, toastDismissed } from '../../features/ui/uiSlice';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-leaf-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-stone-800 text-white',
};

function ToastItem({ toast }) {
  const dispatch = useAppDispatch();
  const Icon = ICONS[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(toastDismissed(toast.id));
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg ${STYLES[toast.type] || STYLES.info} animate-in`}
      role="status"
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => dispatch(toastDismissed(toast.id))}
        className="ms-2 opacity-80 hover:opacity-100"
        aria-label="إغلاق"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <div className="flex flex-col gap-2 w-full max-w-sm pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </div>
  );
}
