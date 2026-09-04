import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md', footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 p-0 sm:p-4">
      <div
        className={`w-full ${maxWidth} rounded-t-2xl sm:rounded-2xl bg-white dark:bg-stone-900 shadow-2xl max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 px-5 py-4 shrink-0">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 grow">{children}</div>
        {footer && (
          <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
}
