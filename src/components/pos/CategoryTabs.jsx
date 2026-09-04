export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 lg:px-6 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
      <button
        onClick={() => onSelect('all')}
        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
          activeId === 'all'
            ? 'bg-brand-500 text-white'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
        }`}
      >
        الكل
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
            activeId === cat.id
              ? 'bg-brand-500 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
