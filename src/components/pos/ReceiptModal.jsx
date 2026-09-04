import { CheckCircle2, Printer, Plus, X } from 'lucide-react';
import Modal from '../common/Modal';
import { formatMoney, formatDateAr, formatTimeAr } from '../../utils/helpers';
import { printReceipt } from '../../services/printing/printReceipt';
import { useAppSelector } from '../../app/hooks';
import { selectSettings } from '../../features/settings/settingsSlice';

const PAYMENT_LABELS = { cash: 'نقدي', card: 'بطاقة', wallet: 'محفظة إلكترونية' };

export default function ReceiptModal({ open, onClose, order, onNewOrder }) {
  const settings = useAppSelector(selectSettings);

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} title="تمت العملية بنجاح" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600/10 text-leaf-600 mb-2">
          <CheckCircle2 size={28} />
        </div>
        <p className="font-bold">تم حفظ الطلب رقم {order.orderNumber}</p>
        <p className="text-xs text-stone-400">
          {formatDateAr(order.createdAt)} - {formatTimeAr(order.createdAt)}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-3 mb-4 max-h-48 overflow-y-auto">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span className="text-stone-600 dark:text-stone-300">
              {item.name} × {item.quantity}
              {item.note && <span className="block text-[11px] text-stone-400">{item.note}</span>}
            </span>
            <span className="font-medium">{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 mb-4 text-sm">
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

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => printReceipt(order, settings)}
          className="col-span-1 flex flex-col items-center gap-1 rounded-xl border border-stone-300 dark:border-stone-700 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
        >
          <Printer size={18} />
          طباعة
        </button>
        <button
          onClick={onNewOrder}
          className="col-span-1 flex flex-col items-center gap-1 rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600"
        >
          <Plus size={18} />
          طلب جديد
        </button>
        <button
          onClick={onClose}
          className="col-span-1 flex flex-col items-center gap-1 rounded-xl border border-stone-300 dark:border-stone-700 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
        >
          <X size={18} />
          إغلاق
        </button>
      </div>
    </Modal>
  );
}
