import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ClipboardList,
  TrendingUp,
  Award,
  Percent,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppSelector } from '../../app/hooks';
import { selectAllOrders } from '../../features/orders/ordersSlice';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import {
  filterOrdersByDay,
  sumTotals,
  sumDiscounts,
  sumByPaymentMethod,
  averageOrderValue,
  topProducts,
  salesByDay,
} from '../../utils/reportSelectors';
import { formatMoney, formatTimeAr, formatDateAr } from '../../utils/helpers';

export default function DashboardPage() {
  const orders = useAppSelector(selectAllOrders);

  const todayOrders = useMemo(() => filterOrdersByDay(orders, Date.now()), [orders]);
  const cashTotal = useMemo(() => sumByPaymentMethod(todayOrders, 'cash'), [todayOrders]);
  const electronicTotal = useMemo(
    () =>
      sumByPaymentMethod(todayOrders, 'card') + sumByPaymentMethod(todayOrders, 'wallet'),
    [todayOrders]
  );
  const best = useMemo(() => topProducts(todayOrders, 5), [todayOrders]);
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const chartData = useMemo(
    () =>
      salesByDay(orders, 7).map((d) => ({
        name: new Date(d.date).toLocaleDateString('ar-EG', { weekday: 'short' }),
        الإجمالي: d.total,
      })),
    [orders]
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Wallet} label="مبيعات اليوم" value={formatMoney(sumTotals(todayOrders))} accent="brand" />
        <StatCard icon={ClipboardList} label="عدد الطلبات اليوم" value={todayOrders.length} accent="stone" />
        <StatCard
          icon={TrendingUp}
          label="متوسط قيمة الطلب"
          value={formatMoney(averageOrderValue(todayOrders))}
          accent="leaf"
        />
        <StatCard
          icon={Percent}
          label="إجمالي الخصومات"
          value={formatMoney(sumDiscounts(todayOrders))}
          accent="stone"
        />
        <StatCard icon={Banknote} label="إجمالي النقدية" value={formatMoney(cashTotal)} accent="leaf" />
        <StatCard
          icon={CreditCard}
          label="إجمالي المدفوعات الإلكترونية"
          value={formatMoney(electronicTotal)}
          accent="brand"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h3 className="mb-4 font-bold">مبيعات آخر 7 أيام</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-800" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={40} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Line type="monotone" dataKey="الإجمالي" stroke="#ec6c22" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <Award size={17} />
            المنتجات الأكثر مبيعًا
          </h3>
          {best.length === 0 ? (
            <p className="text-sm text-stone-400 py-6 text-center">لا توجد مبيعات اليوم بعد</p>
          ) : (
            <ul className="space-y-2.5">
              {best.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold">
                      {i + 1}
                    </span>
                    {p.name}
                  </span>
                  <span className="font-bold text-stone-500">{p.quantity} قطعة</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">آخر الطلبات</h3>
          <Link to="/الطلبات" className="text-sm font-medium text-brand-600 dark:text-brand-400">
            عرض الكل
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState icon={ClipboardList} title="لا توجد طلبات بعد" description="ستظهر هنا أحدث الطلبات المكتملة" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  <th className="py-2 text-start font-medium">رقم الطلب</th>
                  <th className="py-2 text-start font-medium">الوقت</th>
                  <th className="py-2 text-start font-medium">الإجمالي</th>
                  <th className="py-2 text-start font-medium">الدفع</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-stone-50 dark:border-stone-800/50">
                    <td className="py-2.5 font-medium">{o.orderNumber}</td>
                    <td className="py-2.5 text-stone-500">
                      {formatDateAr(o.createdAt)} - {formatTimeAr(o.createdAt)}
                    </td>
                    <td className="py-2.5 font-bold">{formatMoney(o.total)}</td>
                    <td className="py-2.5 text-stone-500">
                      {{ cash: 'نقدي', card: 'بطاقة', wallet: 'محفظة' }[o.paymentMethod]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
