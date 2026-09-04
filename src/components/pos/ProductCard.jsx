import { Ban } from 'lucide-react';
import { formatMoney } from '../../utils/helpers';

export default function ProductCard({ product, categoryName, onAdd, quantityInCart }) {
  const disabled = !product.available;

  return (
    <button
      onClick={() => !disabled && onAdd(product)}
      disabled={disabled}
      className={`relative flex flex-col items-start gap-1.5 rounded-2xl border p-3.5 text-start transition-all active:scale-95 ${
        disabled
          ? 'cursor-not-allowed border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 opacity-60'
          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-brand-400 hover:shadow-md'
      }`}
    >
      {quantityInCart > 0 && (
        <span className="absolute -top-2 -end-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white shadow">
          {quantityInCart}
        </span>
      )}
      {disabled && (
        <span className="absolute top-2 end-2 flex items-center gap-1 rounded-full bg-stone-200 dark:bg-stone-700 px-2 py-0.5 text-[10px] font-bold text-stone-500 dark:text-stone-300">
          <Ban size={10} /> غير متاح
        </span>
      )}
      <span className="text-xs font-medium text-stone-400">{categoryName}</span>
      <span className="font-bold text-stone-800 dark:text-stone-100 leading-tight">{product.name}</span>
      <span className="text-brand-600 dark:text-brand-400 font-bold">{formatMoney(product.price)}</span>
    </button>
  );
}
