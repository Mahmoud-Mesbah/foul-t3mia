import { useMemo } from 'react';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAllOrders } from '../../features/orders/ordersSlice';
import { selectReportsFilter, presetChanged, customRangeChanged } from '../../features/reports/reportsSlice';
import StatCard from '../../components/common/StatCard';
import { inputClass } from '../../components/common/Field';
import {
  filterOrdersInRange,
  getRangeForPreset,
  sumTotals,
  sumDiscounts,
  sumByPaymentMethod,
  topProducts,
} from '../../utils/reportSelectors';
import { formatMoney } from '../../utils/helpers';

const PRESETS = [
  { id: 'today', label: 'اليوم' },
  { id: 'yesterday', label: 'أمس' },
  { id: 'last7', label: 'آخر 7 أيام' },
  { id: 'thisMonth', label: 'هذا الشهر' },
  { id: 'custom', label: 'نطاق مخصص' },
];

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const filter = useAppSelector(selectReportsFilter);

  const { from, to } = useMemo(
    () => getRangeForPreset(filter.preset, filter.customFrom, filter.customTo),
    [filter]
  );
  const rangeOrders = useMemo(() => filterOrdersInRange(orders, from, to), [orders, from, to]);

  const best = useMemo(() => topProducts(rangeOrders, 5, 'desc'), [rangeOrders]);
  const worst = useMemo(() => topProducts(rangeOrders, 5, 'asc'), [rangeOrders]);

  const chartData = useMemo(
    () =>
      best.map((p) => ({
        name: p.name,
        الكمية: p.quantity,
      })),
    [best]
  );

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => dispatch(presetChanged(p.id))}
            className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${
              filter.preset === p.id
                ? 'bg-brand-500 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {filter.preset === 'custom' && (
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={filter.customFrom || ''}
            onChange={(e) => dispatch(customRangeChanged({ from: e.target.value, to: filter.customTo }))}
            className={`${inputClass} w-48`}
          />
          <input
            type="date"
            value={filter.customTo || ''}
            onChange={(e) => dispatch(customRangeChanged({ from: filter.customFrom, to: e.target.value }))}
            className={`${inputClass} w-48`}
          />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="إجمالي المبيعات" value={formatMoney(sumTotals(rangeOrders))} accent="brand" />
        <StatCard label="عدد الطلبات" value={rangeOrders.length} accent="stone" />
        <StatCard label="إجمالي الخصومات" value={formatMoney(sumDiscounts(rangeOrders))} accent="stone" />
        <StatCard
          label="إجمالي النقدية"
          value={formatMoney(sumByPaymentMethod(rangeOrders, 'cash'))}
          accent="leaf"
        />
        <StatCard
          label="إجمالي البطاقات"
          value={formatMoney(sumByPaymentMethod(rangeOrders, 'card'))}
          accent="brand"
        />
        <StatCard
          label="إجمالي المحافظ الإلكترونية"
          value={formatMoney(sumByPaymentMethod(rangeOrders, 'wallet'))}
          accent="brand"
        />
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        <h3 className="mb-4 flex items-center gap-2 font-bold">
          <BarChart3 size={17} />
          أكثر المنتجات مبيعًا (بالكمية)
        </h3>
        {chartData.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">لا توجد بيانات كافية لهذه الفترة</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-800" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="الكمية" fill="#ec6c22" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <TrendingUp size={17} className="text-leaf-600" />
            أكثر المنتجات مبيعًا
          </h3>
          <ProductList list={best} empty="لا توجد بيانات" />
        </div>
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <TrendingDown size={17} className="text-red-500" />
            أقل المنتجات مبيعًا
          </h3>
          <ProductList list={worst} empty="لا توجد بيانات" />
        </div>
      </div>
    </div>
  );
}

function ProductList({ list, empty }) {
  if (list.length === 0) return <p className="text-sm text-stone-400 py-6 text-center">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {list.map((p) => (
        <li key={p.name} className="flex items-center justify-between text-sm">
          <span>{p.name}</span>
          <span className="font-bold text-stone-500">{p.quantity} قطعة · {formatMoney(p.revenue)}</span>
        </li>
      ))}
    </ul>
  );
}
