import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Field, { inputClass } from '../common/Field';

export default function CategoryFormModal({ open, onClose, onSave, initialCategory }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialCategory?.name || '');
      setError('');
    }
  }, [open, initialCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اسم التصنيف مطلوب');
      return;
    }
    onSave(name.trim());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
      maxWidth="max-w-sm"
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
        <Field label="اسم التصنيف" required error={error}>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: فول"
            autoFocus
          />
        </Field>
      </form>
    </Modal>
  );
}
