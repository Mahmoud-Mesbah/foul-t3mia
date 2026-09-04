export default function Field({ label, error, children, required }) {
  return (
    <label className="block mb-4">
      <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder:text-stone-400';
