import { isSameDay, daysAgo, roundMoney, startOfDay } from './helpers';

export function filterOrdersByDay(orders, timestamp) {
  return orders.filter((o) => isSameDay(o.createdAt, timestamp));
}

export function filterOrdersInRange(orders, fromTs, toTs) {
  return orders.filter((o) => o.createdAt >= fromTs && o.createdAt <= toTs);
}

export function sumTotals(orders) {
  return roundMoney(orders.reduce((sum, o) => sum + o.total, 0));
}

export function sumDiscounts(orders) {
  return roundMoney(orders.reduce((sum, o) => sum + o.discount, 0));
}

export function sumByPaymentMethod(orders, method) {
  return roundMoney(
    orders.filter((o) => o.paymentMethod === method).reduce((sum, o) => sum + o.total, 0)
  );
}

export function averageOrderValue(orders) {
  if (orders.length === 0) return 0;
  return roundMoney(sumTotals(orders) / orders.length);
}

export function topProducts(orders, limit = 5, order = 'desc') {
  const counts = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!counts[item.name]) counts[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      counts[item.name].quantity += item.quantity;
      counts[item.name].revenue += item.price * item.quantity;
    });
  });
  const list = Object.values(counts).map((p) => ({ ...p, revenue: roundMoney(p.revenue) }));
  list.sort((a, b) => (order === 'desc' ? b.quantity - a.quantity : a.quantity - b.quantity));
  return list.slice(0, limit);
}

export function getRangeForPreset(preset, customFrom, customTo) {
  const now = Date.now();
  switch (preset) {
    case 'today':
      return { from: startOfDay(new Date()), to: now };
    case 'yesterday': {
      const y = daysAgo(1);
      return { from: y, to: y + 24 * 60 * 60 * 1000 - 1 };
    }
    case 'last7':
      return { from: daysAgo(6), to: now };
    case 'thisMonth': {
      const d = new Date();
      d.setDate(1);
      return { from: startOfDay(d), to: now };
    }
    case 'custom':
      return {
        from: customFrom ? new Date(customFrom).getTime() : daysAgo(6),
        to: customTo ? new Date(customTo).getTime() + 24 * 60 * 60 * 1000 - 1 : now,
      };
    default:
      return { from: startOfDay(new Date()), to: now };
  }
}

export function salesByDay(orders, days = 7) {
  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const dayStart = daysAgo(i);
    const dayOrders = filterOrdersByDay(orders, dayStart);
    result.push({
      date: dayStart,
      total: sumTotals(dayOrders),
      count: dayOrders.length,
    });
  }
  return result;
}
