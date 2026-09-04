// Shared, dependency-free utility helpers.

export function generateId(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

// Round to 2 decimals avoiding floating point drift (work in integer piasters).
export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function toPiasters(value) {
  return Math.round(Number(value) * 100);
}

export function fromPiasters(value) {
  return roundMoney(value / 100);
}

export function formatMoney(value) {
  const n = roundMoney(value || 0);
  const formatted = n.toLocaleString('ar-EG', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} جنيه`;
}

export function formatDateAr(timestamp) {
  return new Date(timestamp).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeAr(timestamp) {
  return new Date(timestamp).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isSameDay(ts, reference = Date.now()) {
  const a = new Date(ts);
  const b = new Date(reference);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

export function generateOrderNumber(sequence) {
  const today = new Date();
  const y = String(today.getFullYear()).slice(2);
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}${m}${d}-${String(sequence).padStart(4, '0')}`;
}
