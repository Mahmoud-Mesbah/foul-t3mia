import { Search, PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

export default function ProductGrid({
  products,
  categoriesById,
  onAdd,
  cartQuantities,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="px-4 lg:px-6 py-3">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-stone-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 py-2.5 ps-10 pe-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4">
        {products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="لا توجد منتجات"
            description="لم يتم العثور على منتجات مطابقة، جرّب تصنيفًا آخر أو كلمة بحث مختلفة"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoriesById[product.categoryId]?.name || ''}
                onAdd={onAdd}
                quantityInCart={cartQuantities[product.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
