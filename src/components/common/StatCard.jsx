export default function StatCard({ icon: Icon, label, value, accent = 'brand', sub }) {
  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    leaf: 'bg-leaf-600/10 text-leaf-600',
    stone: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300',
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</span>
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}
