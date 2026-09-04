export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-bold text-stone-700 dark:text-stone-200">{title}</h3>
      {description && (
        <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400">{description}</p>
      )}
      {action}
    </div>
  );
}
