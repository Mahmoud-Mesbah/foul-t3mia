import { useState } from 'react';
import { Plus, Tags, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectAllCategories,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
  categoryToggled,
  categoriesReordered,
} from '../../features/categories/categoriesSlice';
import { selectAllProducts, productUpdated } from '../../features/products/productsSlice';
import { useToast } from '../../hooks/useToast';
import CategoryFormModal from '../../components/products/CategoryFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { inputClass } from '../../components/common/Field';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const categories = useAppSelector(selectAllCategories);
  const products = useAppSelector(selectAllProducts);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reassignTo, setReassignTo] = useState('');

  const handleSave = (name) => {
    if (editing) {
      dispatch(categoryUpdated({ id: editing.id, changes: { name } }));
      showSuccess('تم تحديث التصنيف');
    } else {
      dispatch(categoryAdded({ name }));
      showSuccess('تمت إضافة التصنيف');
    }
    setFormOpen(false);
  };

  const productsInCategory = (categoryId) => products.filter((p) => p.categoryId === categoryId);

  const handleDelete = () => {
    if (!deleteTarget) return;
    const affected = productsInCategory(deleteTarget.id);
    if (affected.length > 0 && !reassignTo) return; // guarded by disabled button
    affected.forEach((p) => {
      dispatch(productUpdated({ id: p.id, changes: { categoryId: reassignTo || null } }));
    });
    dispatch(categoryDeleted(deleteTarget.id));
    showSuccess('تم حذف التصنيف');
    setDeleteTarget(null);
    setReassignTo('');
  };

  const move = (index, direction) => {
    const ids = categories.map((c) => c.id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= ids.length) return;
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
    dispatch(categoriesReordered(ids));
  };

  const affectedCount = deleteTarget ? productsInCategory(deleteTarget.id).length : 0;
  const otherCategories = categories.filter((c) => c.id !== deleteTarget?.id);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 font-bold text-white hover:bg-brand-600"
        >
          <Plus size={18} />
          إضافة تصنيف
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        {categories.length === 0 ? (
          <EmptyState icon={Tags} title="لا توجد تصنيفات" description="أضف أول تصنيف لتنظيم المنتجات" />
        ) : (
          <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
            {categories.map((c, index) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <button
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="text-stone-400 hover:text-brand-600 disabled:opacity-30"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      disabled={index === categories.length - 1}
                      onClick={() => move(index, 1)}
                      className="text-stone-400 hover:text-brand-600 disabled:opacity-30"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-stone-400">{productsInCategory(c.id).length} منتج</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(categoryToggled(c.id))}
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      c.active ? 'bg-leaf-600/10 text-leaf-600' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    }`}
                  >
                    {c.active ? 'مفعّل' : 'معطّل'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(c);
                      setFormOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-brand-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialCategory={editing}
      />

      {deleteTarget && affectedCount > 0 ? (
        <Modal
          open={!!deleteTarget}
          onClose={() => {
            setDeleteTarget(null);
            setReassignTo('');
          }}
          title="حذف التصنيف"
          maxWidth="max-w-sm"
          footer={
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setReassignTo('');
                }}
                className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={!reassignTo}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                حذف ونقل المنتجات
              </button>
            </div>
          }
        >
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">
            يحتوي تصنيف "{deleteTarget.name}" على {affectedCount} منتج. اختر تصنيفًا آخر لنقل هذه المنتجات إليه
            قبل الحذف.
          </p>
          <select className={inputClass} value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
            <option value="">اختر تصنيفًا</option>
            {otherCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Modal>
      ) : (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="حذف التصنيف"
          message={`هل أنت متأكد من حذف تصنيف "${deleteTarget?.name}"؟`}
        />
      )}
    </div>
  );
}
