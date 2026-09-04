import { useMemo, useState } from 'react';
import { Search, ClipboardList, Eye } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectAllOrders } from '../../features/orders/ordersSlice';
import { formatMoney, formatDateAr, formatTimeAr } from '../../utils/helpers';
import { inputClass } from '../../components/common/Field';
import EmptyState from '../../components/common/EmptyState';
import OrderDetailModal from '../../components/orders/OrderDetailModal';

const PAYMENT_LABELS = { cash: 'نقدي', card: 'بطاقة', wallet: 'محفظة إلكترونية' };
const PAGE_SIZE = 10;

export default function OrdersPage() {
  const orders = useAppSelector(selectAllOrders);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.trim().toLowerCase());
      const matchesPayment = paymentFilter === 'all' || o.paymentMethod === paymentFilter;
      const matchesDate =
        !dateFilter || new Date(o.createdAt).toISOString().slice(0, 10) === dateFilter;
      return matchesSearch && matchesPayment && matchesDate;
    });
  }, [orders, search, paymentFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute top-1/2 -translate-y-1/2 start-3 text-stone-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ابحث برقم الطلب..."
            className={`${inputClass} ps-10`}
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className={`${inputClass} sm:w-44`}
        />
        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          className={`${inputClass} sm:w-44`}
        >
          <option value="all">كل طرق الدفع</option>
          <option value="cash">نقدي</option>
          <option value="card">بطاقة</option>
          <option value="wallet">محفظة إلكترونية</option>
        </select>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="لا توجد طلبات" description="لم يتم العثور على طلبات مطابقة" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-stone-400 border-b border-stone-100 dark:border-stone-800">
                    <th className="py-2 text-start font-medium">رقم الطلب</th>
                    <th className="py-2 text-start font-medium">التاريخ</th>
                    <th className="py-2 text-start font-medium">الوقت</th>
                    <th className="py-2 text-start font-medium">عدد المنتجات</th>
                    <th className="py-2 text-start font-medium">الإجمالي</th>
                    <th className="py-2 text-start font-medium">الدفع</th>
                    <th className="py-2 text-start font-medium">الحالة</th>
                    <th className="py-2 text-start font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((o) => (
                    <tr key={o.id} className="border-b border-stone-50 dark:border-stone-800/50">
                      <td className="py-2.5 font-medium">{o.orderNumber}</td>
                      <td className="py-2.5 text-stone-500">{formatDateAr(o.createdAt)}</td>
                      <td className="py-2.5 text-stone-500">{formatTimeAr(o.createdAt)}</td>
                      <td className="py-2.5 text-stone-500">
                        {o.items.reduce((s, i) => s + i.quantity, 0)}
                      </td>
                      <td className="py-2.5 font-bold">{formatMoney(o.total)}</td>
                      <td className="py-2.5 text-stone-500">{PAYMENT_LABELS[o.paymentMethod]}</td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-leaf-600/10 text-leaf-600 px-2 py-0.5 text-xs font-bold">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-brand-600"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded-lg text-sm font-bold ${
                      n === page
                        ? 'bg-brand-500 text-white'
                        : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <OrderDetailModal open={!!selectedOrder} order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
