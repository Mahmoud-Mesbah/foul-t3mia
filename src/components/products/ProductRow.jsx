import { Pencil, Trash2 } from 'lucide-react';
import { formatMoney } from '../../utils/helpers';

export default function ProductRow({ product, categoryName, onEdit, onDelete, onToggleAvailable }) {
  return (
    <tr className="border-b border-stone-50 dark:border-stone-800/50">
      <td className="py-3 font-medium">{product.name}</td>
      <td className="py-3 text-stone-500">{categoryName}</td>
      <td className="py-3 font-bold">{formatMoney(product.price)}</td>
      <td className="py-3">
        <button
          onClick={() => onToggleAvailable(product.id)}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
            product.available
              ? 'bg-leaf-600/10 text-leaf-600'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
          }`}
        >
          {product.available ? 'متاح' : 'غير متاح'}
        </button>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-brand-600"
            aria-label="تعديل"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
            aria-label="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
