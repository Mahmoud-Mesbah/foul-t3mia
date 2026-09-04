import { ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscountAmount,
  selectCartTotal,
  cartCleared,
} from '../../features/cart/cartSlice';
import { formatMoney } from '../../utils/helpers';
import CartItemRow from './CartItemRow';
import DiscountEditor from './DiscountEditor';
import EmptyState from '../common/EmptyState';

export default function CartPanel({ onCheckout }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscountAmount);
  const total = useAppSelector(selectCartTotal);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-stone-900">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 px-4 py-3.5">
        <h2 className="flex items-center gap-2 font-bold">
          <ShoppingCart size={18} />
          الطلب الحالي
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => dispatch(cartCleared())}
            className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-red-600"
          >
            <Trash2 size={14} />
            إفراغ السلة
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="السلة فارغة"
            description="اختر منتجات من القائمة لإضافتها إلى الطلب"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <CartItemRow key={`${item.productId}-${index}`} item={item} index={index} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 dark:border-stone-800 px-4 py-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-500">الخصم</span>
          <DiscountEditor />
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>المجموع الفرعي</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>الخصم</span>
            <span>- {formatMoney(discount)}</span>
          </div>
          <div className="flex justify-between text-lg font-extrabold pt-1 border-t border-stone-100 dark:border-stone-800">
            <span>الإجمالي</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full rounded-xl bg-brand-500 py-3.5 font-bold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          إتمام الطلب
        </button>
      </div>
    </div>
  );
}
