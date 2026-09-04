import { useState, useMemo, useEffect } from 'react';
import { Banknote, CreditCard, Wallet } from 'lucide-react';
import Modal from '../common/Modal';
import { formatMoney, roundMoney } from '../../utils/helpers';

const METHODS = [
  { id: 'cash', label: 'نقدي', icon: Banknote },
  { id: 'card', label: 'بطاقة', icon: CreditCard },
  { id: 'wallet', label: 'محفظة إلكترونية', icon: Wallet },
];

export default function PaymentDialog({ open, onClose, total, onConfirm }) {
  const [method, setMethod] = useState('cash');
  const [paidInput, setPaidInput] = useState('');

  useEffect(() => {
    if (open) {
      setMethod('cash');
      setPaidInput('');
    }
  }, [open]);

  const paid = paidInput === '' ? 0 : Number(paidInput);
  const change = useMemo(() => roundMoney(Math.max(0, paid - total)), [paid, total]);
  const insufficient = method === 'cash' && paid < total;

  const quickAmounts = useMemo(() => {
    const rounded = Math.ceil(total / 5) * 5;
    return [...new Set([total, rounded, rounded + 5, rounded + 20])].filter((n) => n >= total);
  }, [total]);

  const handleConfirm = () => {
    if (method === 'cash' && insufficient) return;
    onConfirm({
      paymentMethod: method,
      paidAmount: method === 'cash' ? paid : total,
      change: method === 'cash' ? change : 0,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="إتمام الدفع" maxWidth="max-w-sm">
      <div className="mb-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 p-4 text-center">
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">إجمالي الطلب</p>
        <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{formatMoney(total)}</p>
      </div>

      <p className="mb-2 text-sm font-medium text-stone-600 dark:text-stone-300">طريقة الدفع</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-bold transition-colors ${
              method === m.id
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <m.icon size={18} />
            {m.label}
          </button>
        ))}
      </div>

      {method === 'cash' && (
        <div className="mb-2">
          <p className="mb-1.5 text-sm font-medium text-stone-600 dark:text-stone-300">المبلغ المدفوع</p>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            autoFocus
            value={paidInput}
            onChange={(e) => setPaidInput(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-3 text-lg text-center font-bold outline-none focus:border-brand-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setPaidInput(String(amt))}
                className="rounded-lg bg-stone-100 dark:bg-stone-800 px-3 py-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                {formatMoney(amt)}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-50 dark:bg-stone-800 px-4 py-3">
            <span className="text-sm font-medium text-stone-500">الباقي للعميل</span>
            <span className="text-lg font-extrabold">{formatMoney(change)}</span>
          </div>
          {insufficient && paidInput !== '' && (
            <p className="mt-2 text-sm font-medium text-red-600">المبلغ المدفوع غير كافٍ</p>
          )}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={method === 'cash' && (paidInput === '' || insufficient)}
        className="mt-3 w-full rounded-xl bg-brand-500 py-3.5 font-bold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        تأكيد الدفع وإتمام الطلب
      </button>
    </Modal>
  );
}
