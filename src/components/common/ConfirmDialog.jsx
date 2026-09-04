import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'تأكيد الحذف',
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            danger ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-brand-100 text-brand-600'
          }`}
        >
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`flex-1 rounded-xl py-2.5 font-bold text-white ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-500 hover:bg-brand-600'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
