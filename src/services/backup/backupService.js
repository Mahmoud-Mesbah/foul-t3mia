// Export/import a full local backup as a JSON file. Runs entirely offline.

const BACKUP_VERSION = 1;

export function buildBackupPayload({ products, categories, orders, settings }) {
  return {
    meta: {
      app: 'foul-pos',
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
    },
    products,
    categories,
    orders,
    settings,
  };
}

export function downloadBackupFile(payload) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `foul-pos-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        resolve(data);
      } catch (err) {
        reject(new Error('ملف النسخة الاحتياطية غير صالح أو تالف'));
      }
    };
    reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
    reader.readAsText(file, 'utf-8');
  });
}

// Validates the shape of an imported backup before it replaces local data.
export function validateBackupPayload(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['الملف لا يحتوي على بيانات صالحة'] };
  }
  if (!Array.isArray(data.products)) errors.push('بيانات المنتجات مفقودة أو غير صحيحة');
  if (!Array.isArray(data.categories)) errors.push('بيانات التصنيفات مفقودة أو غير صحيحة');
  if (!Array.isArray(data.orders)) errors.push('بيانات الطلبات مفقودة أو غير صحيحة');
  if (!data.settings || typeof data.settings !== 'object') errors.push('بيانات الإعدادات مفقودة أو غير صحيحة');

  if (Array.isArray(data.products)) {
    const invalid = data.products.some((p) => !p.id || !p.name || Number.isNaN(Number(p.price)));
    if (invalid) errors.push('بعض المنتجات في الملف غير صالحة');
  }

  return { valid: errors.length === 0, errors };
}
