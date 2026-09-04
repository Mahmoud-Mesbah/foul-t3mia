import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Field, { inputClass } from '../common/Field';

const emptyForm = { name: '', price: '', categoryId: '', description: '', available: true };

export default function ProductFormModal({ open, onClose, onSave, categories, initialProduct }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initialProduct
          ? {
              name: initialProduct.name,
              price: String(initialProduct.price),
              categoryId: initialProduct.categoryId,
              description: initialProduct.description || '',
              available: initialProduct.available,
            }
          : { ...emptyForm, categoryId: categories[0]?.id || '' }
      );
      setErrors({});
    }
  }, [open, initialProduct, categories]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'اسم المنتج مطلوب';
    if (form.price === '' || form.price === null) {
      e.price = 'السعر مطلوب';
    } else if (Number.isNaN(Number(form.price))) {
      e.price = 'السعر يجب أن يكون رقمًا صحيحًا';
    } else if (Number(form.price) < 0) {
      e.price = 'لا يمكن أن يكون السعر سالبًا';
    }
    if (!form.categoryId) e.categoryId = 'يجب اختيار التصنيف';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, price: roundedPrice(form.price) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      footer={
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-brand-500 py-2.5 font-bold text-white hover:bg-brand-600"
          >
            حفظ
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="اسم المنتج" required error={errors.name}>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: فول بالطحينة"
          />
        </Field>
        <Field label="السعر (جنيه)" required error={errors.price}>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
          />
        </Field>
        <Field label="التصنيف" required error={errors.categoryId}>
          <select
            className={inputClass}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">اختر التصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="الوصف (اختياري)">
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="وصف مختصر للمنتج"
          />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="h-4 w-4 rounded border-stone-300 accent-brand-500"
          />
          <span className="text-sm font-medium">متاح للبيع</span>
        </label>
      </form>
    </Modal>
  );
}

function roundedPrice(value) {
  return Math.round(Number(value) * 100) / 100;
}
