import { useState } from 'react';
import { Plus, Minus, Trash2, StickyNote } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import {
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  itemNoteChanged,
} from '../../features/cart/cartSlice';
import { formatMoney } from '../../utils/helpers';
import NoteEditorModal from './NoteEditorModal';

export default function CartItemRow({ item, index }) {
  const dispatch = useAppDispatch();
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 dark:border-stone-800 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{item.name}</p>
          <p className="text-xs text-stone-400">{formatMoney(item.price)} / للقطعة</p>
          {item.note && (
            <p className="mt-1 inline-block rounded-md bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 text-[11px] text-brand-700 dark:text-brand-300">
              {item.note}
            </p>
          )}
        </div>
        <button
          onClick={() => dispatch(itemRemoved(index))}
          className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
          aria-label="حذف المنتج"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-stone-100 dark:bg-stone-800 p-1">
          <button
            onClick={() => dispatch(quantityDecreased(index))}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-stone-700 shadow-sm hover:bg-stone-50"
            aria-label="إنقاص الكمية"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
          <button
            onClick={() => dispatch(quantityIncreased(index))}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-stone-700 shadow-sm hover:bg-stone-50"
            aria-label="زيادة الكمية"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNoteOpen(true)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <StickyNote size={14} />
            ملاحظة
          </button>
          <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
            {formatMoney(item.price * item.quantity)}
          </span>
        </div>
      </div>
      <NoteEditorModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        initialNote={item.note}
        productName={item.name}
        onSave={(note) => dispatch(itemNoteChanged({ index, note }))}
      />
    </div>
  );
}
