import { Printer } from 'lucide-react';
import Modal from '../common/Modal';
import { formatMoney, formatDateAr, formatTimeAr } from '../../utils/helpers';
import { printReceipt } from '../../services/printing/printReceipt';
import { useAppSelector } from '../../app/hooks';
import { selectSettings } from '../../features/settings/settingsSlice';

const PAYMENT_LABELS = { cash: 'نقدي', card: 'بطاقة', wallet: 'محفظة إلكترونية' };

export default function OrderDetailModal({ open, onClose, order }) {
  const settings = useAppSelector(selectSettings);
  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} title={`تفاصيل الطلب ${order.orderNumber}`} maxWidth="max-w-md">
      <p className="text-xs text-stone-400 mb-3">
        {formatDateAr(order.createdAt)} - {formatTimeAr(order.createdAt)}
      </p>
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between px-3 py-2 text-sm">
            <span>
              {item.name} × {item.quantity}
              {item.note && <span className="block text-[11px] text-stone-400">{item.note}</span>}
            </span>
            <span className="font-medium">{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 mb-5 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>المجموع الفرعي</span>
          <span>{formatMoney(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>الخصم</span>
          <span>{formatMoney(order.discount)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold border-t border-stone-100 dark:border-stone-800 pt-1.5">
          <span>الإجمالي</span>
          <span>{formatMoney(order.total)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>طريقة الدفع</span>
          <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
        </div>
        {order.paymentMethod === 'cash' && (
          <>
            <div className="flex justify-between text-stone-500">
              <span>المدفوع</span>
              <span>{formatMoney(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>الباقي</span>
              <span>{formatMoney(order.change)}</span>
            </div>
          </>
        )}
      </div>
      <button
        onClick={() => printReceipt(order, settings)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
      >
        <Printer size={17} />
        إعادة طباعة الفاتورة
      </button>
    </Modal>
  );
}
