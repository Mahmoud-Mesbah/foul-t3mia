import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { discountChanged } from '../../features/cart/cartSlice';

export default function DiscountEditor() {
  const dispatch = useAppDispatch();
  const discountType = useAppSelector((s) => s.cart.discountType);
  const discountValue = useAppSelector((s) => s.cart.discountValue);

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg bg-stone-100 dark:bg-stone-800 p-0.5">
        <button
          onClick={() => dispatch(discountChanged({ discountType: 'fixed', discountValue }))}
          className={`rounded-md px-2.5 py-1 text-xs font-bold ${
            discountType === 'fixed' ? 'bg-white dark:bg-stone-700 shadow-sm' : 'text-stone-400'
          }`}
        >
          جنيه
        </button>
        <button
          onClick={() => dispatch(discountChanged({ discountType: 'percentage', discountValue }))}
          className={`rounded-md px-2.5 py-1 text-xs font-bold ${
            discountType === 'percentage' ? 'bg-white dark:bg-stone-700 shadow-sm' : 'text-stone-400'
          }`}
        >
          %
        </button>
      </div>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        value={discountValue || ''}
        onChange={(e) =>
          dispatch(discountChanged({ discountType, discountValue: e.target.value }))
        }
        placeholder="0"
        className="w-20 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-2 py-1.5 text-sm text-center outline-none focus:border-brand-500"
      />
    </div>
  );
}
