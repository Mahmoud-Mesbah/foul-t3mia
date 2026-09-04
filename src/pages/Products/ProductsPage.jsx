import { useMemo, useState } from 'react';
import { Plus, Package, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectAllProducts,
  productAdded,
  productUpdated,
  productDeleted,
  productAvailabilityToggled,
} from '../../features/products/productsSlice';
import { selectAllCategories } from '../../features/categories/categoriesSlice';
import { useToast } from '../../hooks/useToast';
import ProductFormModal from '../../components/products/ProductFormModal';
import ProductRow from '../../components/products/ProductRow';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const products = useAppSelector(selectAllProducts);
  const categories = useAppSelector(selectAllCategories);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [products, search]
  );

  const openAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSave = (form) => {
    if (editingProduct) {
      dispatch(productUpdated({ id: editingProduct.id, changes: form }));
      showSuccess('تم تحديث المنتج');
    } else {
      dispatch(productAdded(form));
      showSuccess('تمت إضافة المنتج');
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    dispatch(productDeleted(deleteTarget.id));
    showSuccess('تم حذف المنتج');
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={17} className="absolute top-1/2 -translate-y-1/2 start-3 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 py-2.5 ps-10 pe-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 font-bold text-white hover:bg-brand-600 shrink-0"
        >
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="لا توجد منتجات" description="ابدأ بإضافة أول منتج في القائمة" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  <th className="py-2 text-start font-medium">اسم المنتج</th>
                  <th className="py-2 text-start font-medium">التصنيف</th>
                  <th className="py-2 text-start font-medium">السعر</th>
                  <th className="py-2 text-start font-medium">الحالة</th>
                  <th className="py-2 text-start font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    categoryName={categoriesById[p.categoryId]?.name || '—'}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onToggleAvailable={(id) => dispatch(productAvailabilityToggled(id))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        categories={categories}
        initialProduct={editingProduct}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
      />
    </div>
  );
}
